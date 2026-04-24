export default interface codeExecutor {
  execute(
    code: string,
    inputCase: string,
    outputCase: string
  ): Promise<ExecutionResponse>;
}

export type ExecutionResponse = {
  output: string;
  status: string;

  /**The status can be success or error
   * output can be a  string of message
   */
};
