import { Job } from 'bullmq';

export interface IJOB {
  name: string;
  payload?: Record<string, unknown>;
  handle: (_job?: Job) => void;
  failed: (_job?: Job) => void;
}
