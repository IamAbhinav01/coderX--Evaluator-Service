import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

import { SampleQueue, emailQueue, paymentQueue } from '../queues/sampleQueue';

const serverAdapter = new ExpressAdapter();

serverAdapter.setBasePath('/admin/queues');

createBullBoard({
  queues: [
    new BullMQAdapter(SampleQueue),
    new BullMQAdapter(emailQueue),
    new BullMQAdapter(paymentQueue),
  ],
  serverAdapter,
});

export default serverAdapter;
