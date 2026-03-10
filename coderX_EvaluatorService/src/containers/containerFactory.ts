import Docker from 'dockerode';

async function createContainer(imgName: string, cmdExecutable: string[]) {
  const docker = new Docker();
  const container = await docker.createContainer({
    Image: imgName,
    Cmd: cmdExecutable,
    AttachStdin: true,
    AttachStdout: true,
    AttachStderr: true,
    Tty: false,
    OpenStdin: true,
  });
  return container;
}
export default createContainer;
