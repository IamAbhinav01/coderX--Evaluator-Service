import { CPP_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import pullImage from './pullImage';
import decodeDockerStream from './dockerHelper';
import codeExecutor, { ExecutionResponse } from '../types/codeExecutor';

class CPPExecutor implements codeExecutor {
  async execute(
    code: string,
    inputTestCase: string
  ): Promise<ExecutionResponse> {
    const rawLogBuffer: Buffer[] = [];
    console.log(`initialising docker container for cpp ...`);

    await pullImage(CPP_IMAGE);

    const cppDockerContainer = await createContainer(CPP_IMAGE, [
      'bash',
      '-c',
      `cat <<EOF > main.cpp
${code}
EOF
g++ main.cpp -o main
printf "${inputTestCase}" | ./main`,
    ]);
    await cppDockerContainer.start();
    console.log('started the CPP docker container');

    const loggerStream = await cppDockerContainer.logs({
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
      await cppDockerContainer.stop();
      await cppDockerContainer.remove();
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
          rej(decodedStream);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default CPPExecutor;
