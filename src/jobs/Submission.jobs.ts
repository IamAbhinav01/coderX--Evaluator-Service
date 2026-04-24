import { Job } from 'bullmq';
import { IJOB } from '../types/bullMQJobDefinition';
import { SubmissionPayload } from '../types/submissionPayload';
import createExecutor from '../utils/executorFactory';

export default class SubmissionJob implements IJOB {
  name: string;
  payload?: Record<string, SubmissionPayload>;
  constructor(payload: Record<string, SubmissionPayload>) {
    this.payload = payload;
    this.name = this.constructor.name;
  }
  handle = async (job?: Job) => {
    console.log('handler of the job called');
    console.log(this.payload);

    if (job && this.payload) {
      const key = Object.keys(this.payload)[0];
      const codeLanguage = this.payload[key].language?.toString().trim();
      const code = this.payload[key].code;
      const inputCase = this.payload[key].inputCase;
      const outputCase = this.payload[key].outputCase;
      console.log(job.name, job.id, job.data);
      console.log('normalized language:', codeLanguage);
      const strategy = createExecutor(codeLanguage);
      console.log('Strategy called is : ', strategy);

      if (strategy != null) {
        const response = await strategy.execute(code, inputCase, outputCase);
        if (response.status === 'SUCCESS') {
          console.log('code executed successfully');
          console.log(response);
        } else {
          console.log('Something went wrong with code execution');
          console.log(response);
        }
        return response;
      }

      console.error(`No executor found for language: ${codeLanguage}`);
      return {
        output: `Unsupported language: ${codeLanguage}`,
        status: 'ERROR',
      };
    }
    return {
      output: 'Invalid job payload or missing job data',
      status: 'ERROR',
    };
  };
  failed = (job?: Job): void => {
    console.log('Job failed');
    if (job) {
      console.log(job.id);
    }
  };
}
