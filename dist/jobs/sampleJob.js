"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SampleJob {
    constructor(payload) {
        this.handle = (job) => {
            console.log('Handler of the job called');
            console.log(this.payload);
            if (job) {
                console.log(job.name, job.id, job.data);
            }
        };
        this.failed = (job) => {
            console.log('Job failed');
            if (job) {
                console.log(job.id);
            }
        };
        this.payload = payload;
        this.name = this.constructor.name;
    }
}
exports.default = SampleJob;
