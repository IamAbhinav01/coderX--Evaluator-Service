import { PYTHON_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';

async function runPython(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  console.log(`initialising new python docker container`);
  const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
    'bash',
    '-c',
    `cat <<EOF > main.py
    ${code}
    EOF
    echo "${inputTestCase}" | python main.py`,
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
}
