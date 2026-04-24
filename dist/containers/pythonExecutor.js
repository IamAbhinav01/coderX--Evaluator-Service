"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
const containerFactory_1 = __importDefault(require("./containerFactory"));
const dockerHelper_1 = __importDefault(require("./dockerHelper"));
const pullImage_1 = __importDefault(require("./pullImage"));
class PythonExecutor {
    execute(code, inputCase, outputCase) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawLogBuffer = [];
            console.log(`initialising new python docker container`);
            yield (0, pullImage_1.default)(constants_1.PYTHON_IMAGE);
            const pythonDockerContainer = yield (0, containerFactory_1.default)(constants_1.PYTHON_IMAGE, [
                'sh',
                '-c',
                `echo '${code}' > test.py && echo '${inputCase}' | python3 test.py`,
            ]);
            yield pythonDockerContainer.start();
            console.log(`started the docker container`);
            const loggerStream = yield pythonDockerContainer.logs({
                stderr: true,
                stdout: true,
                timestamps: false,
                follow: true,
            });
            loggerStream.on('data', (data) => {
                rawLogBuffer.push(data);
            });
            try {
                const codeResponse = yield this.fetchDecodeStream(loggerStream, rawLogBuffer);
                if (inputCase != outputCase) {
                    yield pythonDockerContainer.stop();
                    yield pythonDockerContainer.remove();
                    return {
                        output: `Wrong Answer. Expected output: ${outputCase} but received ${codeResponse}`,
                        status: 'FAILED',
                    };
                }
            }
            catch (err) {
                yield pythonDockerContainer.stop();
                yield pythonDockerContainer.remove();
                console.error(`error while executing code in docker container ${err}`);
                return {
                    output: err.message,
                    status: 'ERROR',
                };
            }
            finally {
                yield pythonDockerContainer.stop();
                yield pythonDockerContainer.remove();
            }
            return {
                output: 'All testcases passed',
                status: 'SUCCESS',
            };
        });
    }
    fetchDecodeStream(loggerStream, rawLogBuffer) {
        return new Promise((res, rej) => {
            loggerStream.on('end', () => {
                const completeBuffer = Buffer.concat(rawLogBuffer);
                // console.log(completeBuffer.toString());
                const decodedStream = (0, dockerHelper_1.default)(completeBuffer);
                console.log(decodedStream);
                if (decodedStream.stderr) {
                    rej(decodedStream.stderr);
                }
                else {
                    res(decodedStream.stdout);
                }
            });
        });
    }
}
exports.default = PythonExecutor;
