"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const redis_config_1 = __importDefault(require("../config/redis.config"));
exports.default = new bullmq_1.Queue('SubmissionQueue', {
    connection: redis_config_1.default,
});
