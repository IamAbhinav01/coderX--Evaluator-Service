import DockerStreamOutput from '../types/dockerStream';
import { HEADER_SIZE } from '../utils/constants';

// Docker does not send stdout and stderr as
// plain text — it sends a multiplexed binary stream.

// DOCKER INTERNALLY SENDS OUTPUT AS A
// [HEADER][DATA][HEADER][DATA][HEADER][DATA]

// 1 → stdout

// 2 → stderr

// Docker mixes both streams in one binary buffer,
//  and we must decode it manually.

function decodeDockerStream(buffer: Buffer): DockerStreamOutput {
  let offset = 0;
  const output: DockerStreamOutput = {
    stdout: '',
    stderr: '',
  };

  while (offset < buffer.length) {
    const channel = buffer[0];
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
