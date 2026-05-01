import { CPP_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import pullImage from './pullImage';
import decodeDockerStream from './dockerHelper';
import codeExecutor, {
  ExecutionResponse,
  TestCaseResult,
} from '../types/codeExecutor';

class CPPExecutor implements codeExecutor {
  async execute(
    code: string,
    testCases: { input: string; output: string }[]
  ): Promise<ExecutionResponse> {
    const results: TestCaseResult[] = [];
    let overallStatus: 'SUCCESS' | 'FAILED' | 'ERROR' | 'TLE' | 'MLE' =
      'SUCCESS';

    for (const testCase of testCases) {
      let cppDockerContainer;
      let status: 'SUCCESS' | 'FAILED' | 'ERROR' | 'TLE' | 'MLE' = 'SUCCESS';
      let actualOutput = '';

      try {
        const rawLogBuffer: Buffer[] = [];
        console.log(`initialising docker container for cpp ...`);
        await pullImage(CPP_IMAGE);

        cppDockerContainer = await createContainer(
          CPP_IMAGE,
          [
            'bash',
            '-c',
            `cat <<'EOF' > main.cpp
${code}
EOF
g++ main.cpp -o main && cat <<'INPUT_EOF' | timeout 2s ./main
${testCase.input}
INPUT_EOF`,
          ],
          128 * 1024 * 1024
        ); 
        await cppDockerContainer.start();

        
        
        
        const totalTimeout = 10000; 
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('TLE')), totalTimeout);
        });

        const executionPromise = (async () => {
          const loggerStream = await cppDockerContainer.logs({
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
          
          
          const inspect = await cppDockerContainer.wait();
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

        
        const containerState = await cppDockerContainer.inspect();
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
        if (cppDockerContainer) {
          try {
            await cppDockerContainer.remove({ force: true });
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
