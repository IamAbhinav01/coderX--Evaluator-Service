import DockerStreamOutput from '../types/dockerStream';
import { HEADER_SIZE } from '../utils/constants';














function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
  let offset = 0;
  const output: DockerStreamOutput = {
    stdout: '',
    stderr: '',
  };

  while (offset < buffer.length) {
    const channel = buffer[offset];
    const length = buffer.readUInt32BE(offset + 4);
    const dataStart = offset + HEADER_SIZE;
    const dataEnd = dataStart + length;
    const data = buffer.toString('utf-8', dataStart, dataEnd);
    if (channel == 1) {
      output.stdout += data;
    } else if (channel === 2) {
      output.stderr += data;
    }
    offset = dataEnd;
  }
  return output;
}
export default decodeDockerStream;
