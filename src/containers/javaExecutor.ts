import codeExecutor, { ExecutionResponse } from '../types/codeExecutor';
import { JAVA_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';

class javaExecutor implements codeExecutor {
  async execute(
    code: string,
    inputCase: string,
    outputCase: string
  ): Promise<ExecutionResponse> {
    let javaDockerContainer;
    try {
      const rawLogBuffer: Buffer[] = [];
      console.log(`initialising docker container for java ....`);
      await pullImage(JAVA_IMAGE);

      javaDockerContainer = await createContainer(JAVA_IMAGE, [
        'bash',
        '-c',
        `cat <<EOF > Main.java
${code}
EOF
javac Main.java
echo "${inputCase}" | java Main`,
      ]);
      await javaDockerContainer.start();
      console.log(`starting the JAVA docker container`);

      const loggerStream = await javaDockerContainer.logs({
        stderr: true,
        stdout: true,
        timestamps: false,
        follow: true,
      });
      loggerStream.on('data', (chunk) => {
        rawLogBuffer.push(chunk);
      });
      
      const codeResponse = await this.fecthDecodeStream(
        loggerStream,
        rawLogBuffer
      );
      if (inputCase != outputCase) {
        return {
          output: `Wrong Answer. Expected output: ${outputCase} but received ${codeResponse}`,
          status: 'FAILED',
        };
      }
    } catch (error) {
      console.error(`error while executing code in docker container ${error}`);
      return {
        output: (error as Error).message,
        status: 'ERROR',
      };
    } finally {
      if (javaDockerContainer) {
        try {
          await javaDockerContainer.remove({ force: true });
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
  fecthDecodeStream(
    loggerStream: NodeJS.ReadableStream,
    rawLogBuffer: Buffer[]
  ): Promise<string> {
    return new Promise((res, rej) => {
      loggerStream.on('end', () => {
        const completeBuffer = Buffer.concat(rawLogBuffer);

        const decodeStream = decodeDockerStream(completeBuffer);
        console.log(decodeStream);
        if (decodeStream.stderr) {
          rej(decodeStream.stderr);
        } else {
          res(decodeStream.stdout);
        }
      });
    });
  }
}

export default javaExecutor;
