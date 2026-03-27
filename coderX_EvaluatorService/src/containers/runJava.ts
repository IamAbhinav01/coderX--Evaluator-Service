import { JAVA_IMAGE } from '../utils/constants';
import createContainer from './containerFactory';
import decodeDockerStream from './dockerHelper';
import pullImage from './pullImage';

async function runJava(code: string, inputTestCase: string) {
  const rawLogBuffer: Buffer[] = [];
  console.log(`initialising docker container for java ....`);
  await pullImage(JAVA_IMAGE);

  const javaDockerContainer = await createContainer(JAVA_IMAGE, [
    'bash',
    '-c',
    `cat <<EOF > Main.java
${code}
EOF
javac Main.java
echo "${inputTestCase}" | java Main`,
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
  await new Promise((res, _) => {
    loggerStream.on('end', () => {
      const completeBuffer = Buffer.concat(rawLogBuffer);

      const decodeStream = decodeDockerStream(completeBuffer);
      console.log(decodeStream);
      res(decodeStream);
    });
  });
  await javaDockerContainer.remove();
  return javaDockerContainer;
}
export default runJava;
