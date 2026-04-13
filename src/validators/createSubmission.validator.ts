import { ZodType } from 'zod';
import { createSubmissionDto } from '../dtos/createSubmission.dto';
import { Request, Response, NextFunction } from 'express';

export const validatecreateSubmissionDto =
  (schema: ZodType<createSubmissionDto>) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        ...req.body,
      });
      next();
    } catch (error) {
      console.log(error);
      return res.status(404).json({
        message: 'something went wrong.',
      });
    }
  };
