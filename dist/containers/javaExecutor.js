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
class javaExecutor {
    execute(code, inputCase, outputCase) {
        return __awaiter(this, void 0, void 0, function* () {
            const rawLogBuffer = [];
            console.log(`initialising docker container for java ....`);
            yield (0, pullImage_1.default)(constants_1.JAVA_IMAGE);
            const javaDockerContainer = yield (0, containerFactory_1.default)(constants_1.JAVA_IMAGE, [
                'bash',
                '-c',
                `cat <<EOF > Main.java
${code}
EOF
javac Main.java
echo "${inputCase}" | java Main`,
            ]);
            yield javaDockerContainer.start();
            console.log(`starting the JAVA docker container`);
            const loggerStream = yield javaDockerContainer.logs({
                stderr: true,
                stdout: true,
                timestamps: false,
                follow: true,
            });
            loggerStream.on('data', (chunk) => {
                rawLogBuffer.push(chunk);
            });
            try {
                const codeResponse = yield this.fecthDecodeStream(loggerStream, rawLogBuffer);
                if (inputCase != outputCase) {
                    yield javaDockerContainer.stop();
                    yield javaDockerContainer.remove();
                    return {
                        output: `Wrong Answer. Expected output: ${outputCase} but received ${codeResponse}`,
                        status: 'FAILED',
                    };
                }
            }
            catch (error) {
                yield javaDockerContainer.stop();
                yield javaDockerContainer.remove();
                console.error(`error while executing code in docker container ${error}`);
                return {
                    output: error.message,
                    status: 'ERROR',
                };
            }
            finally {
                yield javaDockerContainer.stop();
                yield javaDockerContainer.remove();
            }
            return {
                output: 'All testcases passed',
                status: 'SUCCESS',
            };
        });
    }
    fecthDecodeStream(loggerStream, rawLogBuffer) {
        return new Promise((res, rej) => {
            loggerStream.on('end', () => {
                const completeBuffer = Buffer.concat(rawLogBuffer);
                const decodeStream = (0, dockerHelper_1.default)(completeBuffer);
                console.log(decodeStream);
                if (decodeStream.stderr) {
                    rej(decodeStream.stderr);
                }
                else {
                    res(decodeStream.stdout);
                }
            });
        });
    }
}
exports.default = javaExecutor;
