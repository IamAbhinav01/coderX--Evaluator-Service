"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const submission_controller_1 = require("../../controllers/submission.controller");
const createSubmission_dto_1 = require("../../dtos/createSubmission.dto");
const createSubmission_validator_1 = require("../../validators/createSubmission.validator");
const submissionRouter = express_1.default.Router();
submissionRouter.post('/', (0, createSubmission_validator_1.validatecreateSubmissionDto)(createSubmission_dto_1.createSubmissionZodSchema), submission_controller_1.addSubmission);
exports.default = submissionRouter;
