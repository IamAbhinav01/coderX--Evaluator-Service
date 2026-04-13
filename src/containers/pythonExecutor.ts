import e from 'express';
import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';
import codeExecutor, { ExecutionResponse } from '../types/codeExecutor';

class PythonExecutor implements codeExecutor {
  async execute(
    code: string,
    inputTestCase: string
  ): Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];

    console.log(`initialising new python docker container`);

    await pullImage(PYTHON_IMAGE);

    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
      'sh',
      '-c',
      `echo '${code}' > test.py && echo '${inputTestCase}' | python3 test.py`,
    ]);

    await pythonDockerContainer.start();
    console.log(`started the docker container`);

    const loggerStream = await pythonDockerContainer.logs({
      stderr: true,
      stdout: true,
      timestamps: false,
      follow: true,
    });

    loggerStream.on('data', (data) => {
      rawLogBuffer.push(data);
    });

    try {
      const codeResponse = await this.fetchDecodeStream(
        loggerStream,
        rawLogBuffer
      );
      return {
        output: codeResponse,
        status: 'success',
      };
    } catch (err) {
      console.error(`error while executing code in docker container ${err}`);
      return {
        output: (err as Error).message,
        status: 'error',
      };
    } finally {
      await pythonDockerContainer.stop();
      await pythonDockerContainer.remove();
    }
  }

  fetchDecodeStream(
    loggerStream: NodeJS.ReadableStream,
    rawLogBuffer: Buffer[]
  ): Promise<string> {
    return new Promise((res, rej) => {
      loggerStream.on('end', () => {
        const completeBuffer = Buffer.concat(rawLogBuffer);

        // console.log(completeBuffer.toString());

        const decodedStream = decodeDockerStream(completeBuffer);
        console.log(decodedStream);
        if (decodedStream.stderr) {
          rej(decodedStream.stderr);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default PythonExecutor;
