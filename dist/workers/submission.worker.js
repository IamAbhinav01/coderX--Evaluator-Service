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
exports.default = SubmissionWorker;
const bullmq_1 = require("bullmq");
const Submission_jobs_1 = __importDefault(require("../jobs/Submission.jobs"));
const redis_config_1 = __importDefault(require("../config/redis.config"));
function SubmissionWorker(queueName) {
    new bullmq_1.Worker(queueName, (job) => __awaiter(this, void 0, void 0, function* () {
        if (job.name === 'SubmissionJob') {
            const submissionJobInstance = new Submission_jobs_1.default(job.data);
            console.log('calling job handler');
            submissionJobInstance.handle(job);
            return true;
        }
    }), {
        connection: redis_config_1.default,
    });
}
