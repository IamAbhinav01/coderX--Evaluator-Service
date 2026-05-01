import codeExecutor, { ExecutionResponse, TestCaseResult } from '../types/codeExecutor';
import { JAVA_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';

class javaExecutor implements codeExecutor {
  async execute(
    code: string,
    testCases: { input: string; output: string }[]
  ): Promise<ExecutionResponse> {
    const results: TestCaseResult[] = [];
    let overallStatus: 'SUCCESS' | 'FAILED' | 'ERROR' | 'TLE' | 'MLE' = 'SUCCESS';

    for (const testCase of testCases) {
      let javaDockerContainer;
      let status: 'SUCCESS' | 'FAILED' | 'ERROR' | 'TLE' | 'MLE' = 'SUCCESS';
      let actualOutput = '';

      try {
        const rawLogBuffer: Buffer[] = [];
        console.log(`initialising docker container for java ....`);
        await pullImage(JAVA_IMAGE);

        javaDockerContainer = await createContainer(JAVA_IMAGE, [
          'bash',
          '-c',
          `cat <<'EOF' > Main.java
${code}
EOF
javac Main.java && cat <<'INPUT_EOF' | timeout 4s java Main
${testCase.input}
INPUT_EOF`,
        ], 256 * 1024 * 1024); // 256MB Limit
        await javaDockerContainer.start();

        // ── TIMEOUT LOGIC ───────────────────────────────────────────────
        // We give 15 seconds total for Compilation + Execution.
        const totalTimeout = 15000; 
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('TLE')), totalTimeout);
        });

        const executionPromise = (async () => {
          const loggerStream = await javaDockerContainer.logs({
            stderr: true,
            stdout: true,
            timestamps: false,
            follow: true,
          });
          loggerStream.on('data', (chunk) => {
            rawLogBuffer.push(chunk);
          });

          return this.fecthDecodeStream(loggerStream, rawLogBuffer);
        })();

        try {
          const codeResponse = (await Promise.race([
            executionPromise,
            timeoutPromise,
          ])) as string;
          
          const inspect = await javaDockerContainer.wait();
          if (inspect.StatusCode === 124) {
            status = 'TLE';
          } else {
            actualOutput = codeResponse.toString().trim();
            const expectedOutput = testCase.output.toString().trim();
            status = actualOutput === expectedOutput ? 'SUCCESS' : 'FAILED';
          }
        } catch (err: any) {
          if (err.message === 'TLE') {
            status = 'TLE';
          } else {
            throw err;
          }
        }

        // ── OOM CHECK (MLE) ──────────────────────────────────────────────
        const containerState = await javaDockerContainer.inspect();
        if (containerState.State.OOMKilled) {
          status = 'MLE';
        }

        if (status !== 'SUCCESS' && overallStatus === 'SUCCESS') {
          overallStatus = status;
        }

        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: actualOutput,
          status: status,
        });
      } catch (error) {
        console.error(`error while executing code in docker container ${error}`);
        status = 'ERROR';
        overallStatus = 'ERROR';
        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: '',
          status: 'ERROR',
          error: (error as Error).message,
        });
      } finally {
        if (javaDockerContainer) {
          try {
            await javaDockerContainer.remove({ force: true });
          } catch (e) {
            console.error('Error removing container', e);
          }
        }
      }
    }

    return {
      overallStatus,
      results,
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
