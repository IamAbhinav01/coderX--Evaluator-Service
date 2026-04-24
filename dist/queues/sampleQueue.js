"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentQueue = exports.emailQueue = exports.SampleQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_config_1 = __importDefault(require("../config/redis.config"));
exports.SampleQueue = new bullmq_1.Queue('SampleQueue', {
    connection: redis_config_1.default,
});
exports.emailQueue = new bullmq_1.Queue('emailQueue', {
    connection: redis_config_1.default,
});
exports.paymentQueue = new bullmq_1.Queue('paymentQueue', {
    connection: redis_config_1.default,
});
