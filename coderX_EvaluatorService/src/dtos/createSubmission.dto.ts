import { z, ZodAny } from 'zod';

export const createSubmissionZodSchema = z.object({
  userId: z.string(),
  problemId: z.string(),
  code: z.string(),
  language: z.string(),
});

export type createSubmissionDto = z.infer<typeof createSubmissionZodSchema>;
