import { Request, Response } from 'express';
import { createSubmissionDto } from '../dtos/createSubmission.dto';

export function addSubmission(req: Request, res: Response) {
  const submissionDto = req.body as createSubmissionDto;
  console.log(submissionDto);
  return res.status(201).json({
    success: true,
    error: {},
    message: 'Sucesfully collected submission',
    data: submissionDto,
  });
}
