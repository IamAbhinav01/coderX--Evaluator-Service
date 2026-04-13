export default interface codeExecutor {
  execute(code: string, inputTestCase: string): Promise<ExecutionResponse>;
}

export type ExecutionResponse = {
  output: string;
  status: string;

  /**The status can be success or error
   * output can be a  string of message
   */
};
