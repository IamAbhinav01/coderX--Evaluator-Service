export default interface CodeExecutorStrategy {
    execute(code: string, testCases: { input: string; output: string }[]) : Promise<ExecutionResponse>;
};

export type TestCaseResult = {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  status: 'SUCCESS' | 'FAILED' | 'ERROR' | 'TLE' | 'MLE';
  error?: string;
};

export type ExecutionResponse = {
  overallStatus: 'SUCCESS' | 'FAILED' | 'ERROR' | 'TLE' | 'MLE';
  results: TestCaseResult[];
};