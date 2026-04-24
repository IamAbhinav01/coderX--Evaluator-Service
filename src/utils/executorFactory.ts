import CPPExecutor from '../containers/cppExecutor';
import javaExecutor from '../containers/javaExecutor';
import PythonExecutor from '../containers/pythonExecutor';
import codeExecutor from '../types/codeExecutor';

export default function createExecutor(
  codeLanguage: string
): codeExecutor | null {
  const normalized = codeLanguage?.toString().trim().toLowerCase();
  if (normalized === 'python') {
    return new PythonExecutor();
  } else if (normalized === 'cpp' || normalized === 'c++') {
    return new CPPExecutor();
  } else if (normalized === 'java') {
    return new javaExecutor();
  } else {
    return null;
  }
}
