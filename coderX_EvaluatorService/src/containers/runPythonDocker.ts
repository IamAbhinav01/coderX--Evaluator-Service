import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';

async function runPython(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];

  console.log(`initialising new python docker container`);

  await pullImage(PYTHON_IMAGE);

  const encodedCode = Buffer.from(code).toString('base64');
  const encodedInput = Buffer.from(inputTestCase).toString('base64');

  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    'sh',
    '-c',
    `echo ${encodedCode} | base64 -d > test.py && echo ${encodedInput} | base64 -d | python3 test.py`,
  ]);

  await pythonDockerContainer.start();
  console.log(`started the docker container`);

  await pythonDockerContainer.wait(); // IMPORTANT

  const loggerStream = await pythonDockerContainer.logs({
    stderr: true,
    stdout: true,
    timestamps: false,
    follow: true,
  });

  loggerStream.on('data', (data) => {
    rawLogBuffer.push(data);
  });

  await new Promise((res) => {
    loggerStream.on('end', () => {
      const completeBuffer = Buffer.concat(rawLogBuffer);

      console.log(completeBuffer.toString());

      const decoded = decodeDockerStream(completeBuffer);
      console.log(decoded);

      res(decoded);
    });
  });

  await pythonDockerContainer.remove();
}
export default runPython;
