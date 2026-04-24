"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = require("@bull-board/api");
const express_1 = require("@bull-board/express");
const bullMQAdapter_1 = require("@bull-board/api/bullMQAdapter");
const sampleQueue_1 = require("../queues/sampleQueue");
const serverAdapter = new express_1.ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
(0, api_1.createBullBoard)({
    queues: [
        new bullMQAdapter_1.BullMQAdapter(sampleQueue_1.SampleQueue),
        new bullMQAdapter_1.BullMQAdapter(sampleQueue_1.emailQueue),
        new bullMQAdapter_1.BullMQAdapter(sampleQueue_1.paymentQueue),
    ],
    serverAdapter,
});
exports.default = serverAdapter;
