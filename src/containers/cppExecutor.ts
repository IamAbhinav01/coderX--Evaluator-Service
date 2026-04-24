import { CPP_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import pullImage from './pullImage';
import decodeDockerStream from './dockerHelper';
import codeExecutor, { ExecutionResponse } from '../types/codeExecutor';

class CPPExecutor implements codeExecutor {
  async execute(
    code: string,
    inputCase: string,
    outputCase: string
  ): Promise<ExecutionResponse> {
    let cppDockerContainer;
    try {
      const rawLogBuffer: Buffer[] = [];
      console.log(`initialising docker container for cpp ...`);

      await pullImage(CPP_IMAGE);

      cppDockerContainer = await createContainer(CPP_IMAGE, [
        'bash',
        '-c',
        `cat <<EOF > main.cpp
${code}
EOF
g++ main.cpp -o main
printf "${inputCase}" | ./main`,
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
      
      const codeResponse = await this.fetchDecodeStream(
        loggerStream,
        rawLogBuffer
      );
      const actualOutput = codeResponse.toString().trim();
      const expectedOutput = outputCase.toString().trim();
      if (actualOutput !== expectedOutput) {
        return {
          output: `Wrong Answer. Expected output: ${expectedOutput} but received ${actualOutput}`,
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
      if (cppDockerContainer) {
        try {
          await cppDockerContainer.remove({ force: true });
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
          rej(decodedStream);
        } else {
          res(decodedStream.stdout);
        }
      });
    });
  }
}

export default CPPExecutor;
