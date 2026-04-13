import { paymentQueue, SampleQueue } from '../queues/sampleQueue';

export default async function (name: string, payload: Record<string, unknown>) {
  await paymentQueue.add(name, payload);
  console.log('succesfullt added new job');
}
