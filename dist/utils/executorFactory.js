"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = createExecutor;
const cppExecutor_1 = __importDefault(require("../containers/cppExecutor"));
const javaExecutor_1 = __importDefault(require("../containers/javaExecutor"));
const pythonExecutor_1 = __importDefault(require("../containers/pythonExecutor"));
function createExecutor(codeLanguage) {
    if (codeLanguage.toLowerCase() === 'python') {
        return new pythonExecutor_1.default();
    }
    else if (codeLanguage.toLowerCase() === 'cpp') {
        return new cppExecutor_1.default();
    }
    else if (codeLanguage.toLowerCase() === 'java') {
        return new javaExecutor_1.default();
    }
    else {
        return null;
    }
}
