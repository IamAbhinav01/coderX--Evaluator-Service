import { CPP_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import pullImage from './pullImage';
import decodeDockerStream from './dockerHelper';

async function runCpp(code: string, inputTestCase: string) {
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

  await new Promise((res, _) => {
    loggerStream.on('end', () => {
      const completeBuffer = Buffer.concat(rawLogBuffer);

      // console.log(completeBuffer.toString());

      const decodedStream = decodeDockerStream(completeBuffer);
      console.log(decodedStream);

      res(decodedStream);
    });
  });
  await cppDockerContainer.remove();
  return cppDockerContainer;
}
export default runCpp;
