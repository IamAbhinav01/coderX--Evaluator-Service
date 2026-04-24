"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubmissionZodSchema = void 0;
const zod_1 = require("zod");
exports.createSubmissionZodSchema = zod_1.z.object({
    userId: zod_1.z.string(),
    problemId: zod_1.z.string(),
    code: zod_1.z.string(),
    language: zod_1.z.string(),
});
