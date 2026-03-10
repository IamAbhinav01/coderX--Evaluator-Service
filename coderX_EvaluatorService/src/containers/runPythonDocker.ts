import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';

async function runPython(code: string, inputTestCase: string) {
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

  await new Promise((res, _) => {
    loggerStream.on('end', () => {
      const completeBuffer = Buffer.concat(rawLogBuffer);

      // console.log(completeBuffer.toString());

      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream);

      res(decodedStream);
    });
  });

  await pythonDockerContainer.remove();
  return pythonDockerContainer;
}
export default runPython;
