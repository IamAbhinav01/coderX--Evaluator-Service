import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';
import codeExecutor, { ExecutionResponse, TestCaseResult } from '../types/codeExecutor';

class PythonExecutor implements codeExecutor {
  async execute(
    code: string,
    testCases: { input: string; output: string }[]
  ): Promise<ExecutionResponse> {
    const results: TestCaseResult[] = [];
    let overallStatus: 'SUCCESS' | 'FAILED' | 'ERROR' | 'TLE' | 'MLE' = 'SUCCESS';

    for (const testCase of testCases) {
      let pythonDockerContainer;
      let status: 'SUCCESS' | 'FAILED' | 'ERROR' | 'TLE' | 'MLE' = 'SUCCESS';
      let actualOutput = '';
      let errorMessage = '';

      try {
        const rawLogBuffer: Buffer[] = [];
        console.log(`initialising new python docker container for test case`);

        await pullImage(PYTHON_IMAGE);

        pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
          'sh',
          '-c',
          `cat <<'EOF' > test.py
${code}
EOF
cat <<'INPUT_EOF' | timeout 2s python3 test.py
${testCase.input}
INPUT_EOF`,
        ], 100 * 1024 * 1024); // 100MB Limit

        await pythonDockerContainer.start();

        // ── TIMEOUT LOGIC ───────────────────────────────────────────────
        const totalTimeout = 5000; // 5 seconds total
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('TLE')), totalTimeout);
        });

        const executionPromise = (async () => {
          const loggerStream = await pythonDockerContainer.logs({
            stderr: true,
            stdout: true,
            timestamps: false,
            follow: true,
          });

          loggerStream.on('data', (data) => {
            rawLogBuffer.push(data);
          });

          return this.fetchDecodeStream(loggerStream, rawLogBuffer);
        })();

        try {
          const codeResponse = (await Promise.race([
            executionPromise,
            timeoutPromise,
          ])) as string;
          
          const inspect = await pythonDockerContainer.wait();
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
        const containerState = await pythonDockerContainer.inspect();
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
      } catch (err) {
        console.error(`error while executing code in docker container ${err}`);
        status = 'ERROR';
        overallStatus = 'ERROR';
        results.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: '',
          status: 'ERROR',
          error: (err as Error).message,
        });
      } finally {
        if (pythonDockerContainer) {
          try {
            await pythonDockerContainer.remove({ force: true });
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
