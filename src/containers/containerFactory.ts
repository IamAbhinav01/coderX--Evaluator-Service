import Docker from 'dockerode';

async function createContainer(
  imgName: string,
  cmdExecutable: string[],
  memoryLimit: number = 256 * 1024 * 1024 // Default 256MB
) {
  const docker = new Docker();
  const container = await docker.createContainer({
    Image: imgName,
    Cmd: cmdExecutable,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    OpenStdin: true,
    HostConfig: {
      Memory: memoryLimit,
      NanoCpus: 1000000000, // Limit to 1 CPU core
    },
  });
  return container;
}
export default createContainer;
