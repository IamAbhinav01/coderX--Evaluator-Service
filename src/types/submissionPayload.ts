export type SubmissionPayload = {
  code: string;
  language: string;
  testCases: { input: string; output: string }[];
  userId: string;
  submissionId: string;
};
