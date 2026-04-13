import express from 'express';
import { addSubmission } from '../../controllers/submission.controller';
import { createSubmissionZodSchema } from '../../dtos/createSubmission.dto';
import { validatecreateSubmissionDto } from '../../validators/createSubmission.validator';

const submissionRouter = express.Router();
submissionRouter.post(
  '/',
  validatecreateSubmissionDto(createSubmissionZodSchema),
  addSubmission
);
export default submissionRouter;
