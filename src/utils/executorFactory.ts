import JavaExecutor from "../containers/javaExecutor";
import PythonExecutor from "../containers/pythonExecutor";
import CPPExecutor from "../containers/cppExecutor";
import CodeExecutorStrategy from "../types/CodeExecutorStrategy";

export default function createExecutor(codeLanguage: string) : CodeExecutorStrategy | null {
    const lang = codeLanguage.toLowerCase();
    if(lang === "python" || lang === "py") {
        return new PythonExecutor();
    } else if (lang === "java"){
        return new JavaExecutor();
    } else if (lang === "cpp" || lang === "c++") {
        return new CPPExecutor();
    } else {
        return null;
    }
}