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
const executorFactory_1 = __importDefault(require("../utils/executorFactory"));
class SubmissionJob {
    constructor(payload) {
        this.handle = (job) => __awaiter(this, void 0, void 0, function* () {
            console.log('handler of the job called');
            console.log(this.payload);
            if (job && this.payload) {
                const key = Object.keys(this.payload)[0];
                const codeLanguage = this.payload[key].language;
                const code = this.payload[key].code;
                const inputCase = this.payload[key].inputCase;
                const outputCase = this.payload[key].outputCase;
                console.log(job.name, job.id, job.data);
                const strategy = (0, executorFactory_1.default)(codeLanguage);
                console.log('Strategy called is : ', strategy);
                if (strategy != null) {
                    const response = yield strategy.execute(code, inputCase, outputCase);
                    if (response.status === 'SUCCESS') {
                        console.log('code executed successfully');
                        console.log(response);
                    }
                    else {
                        console.log('Something went wrong with code execution');
                        console.log(response);
                    }
                }
            }
        });
        this.failed = (job) => {
            console.log('Job failed');
            if (job) {
                console.log(job.id);
            }
        };
        this.payload = payload;
        this.name = this.constructor.name;
    }
}
exports.default = SubmissionJob;
