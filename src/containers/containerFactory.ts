import Docker from 'dockerode';

async function createContainer(
  imgName: string,
  cmdExecutable: string[],
  memoryLimit: number = 256 * 1024 * 1024 
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
      NanoCpus: 1000000000, 
    },
  });
  return container;
}
export default createContainer;
