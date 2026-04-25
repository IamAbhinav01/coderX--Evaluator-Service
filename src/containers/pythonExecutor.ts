import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';
import codeExecutor, { ExecutionResponse } from '../types/codeExecutor';

class PythonExecutor implements codeExecutor {
  async execute(
    code: string,
    inputCase: string,
    outputCase: string
  ): Promise<ExecutionResponse> {
    let pythonDockerContainer;
    try {
      const rawLogBuffer: Buffer[] = [];

      console.log(`initialising new python docker container`);

      await pullImage(PYTHON_IMAGE);

      pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
        'sh',
        '-c',
        `echo '${code}' > test.py && echo '${inputCase}' | python3 test.py`,
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

      const codeResponse = await this.fetchDecodeStream(
        loggerStream,
        rawLogBuffer
      );
      const actualOutput = codeResponse.toString().trim();
      const expectedOutput = outputCase.toString().trim();
      if (actualOutput !== expectedOutput) {
        return {
          output: `Wrong Answer. Expected output: ${outputCase} but received ${codeResponse}`,
          status: 'FAILED',
        };
      }
    } catch (err) {
      console.error(`error while executing code in docker container ${err}`);
      return {
        output: (err as Error).message,
        status: 'ERROR',
      };
    } finally {
      if (pythonDockerContainer) {
        try {
          await pythonDockerContainer.remove({ force: true });
        } catch (e) {
          console.error('Error removing container', e);
        }
      }
    }
    return {
      output: 'All testcases passed',
      status: 'SUCCESS',
    };
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
