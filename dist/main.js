"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const server_config_1 = __importDefault(require("./config/server.config"));
const routes_1 = __importDefault(require("./routes"));
const BullBoard_config_1 = __importDefault(require("./config/BullBoard.config"));
// import sampleQueueProducers from './producers/sampleQueueProducers';
// import SampleWorker from './workers/sampleWorker';
// import execute from './containers/pythonExecutor';
// import runCpp from './containers/cppExecutor';
// import runJava from './containers/javaExecutor';
const PORT = server_config_1.default.PORT;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', routes_1.default);
// app.use('/api', apiRouter);
app.use('/admin/queues', BullBoard_config_1.default.getRouter());
app.listen(server_config_1.default.PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server started at ${server_config_1.default.PORT}`);
    //   // start worker
    //   SampleWorker('paymentQueue');
    //   const code = `
    // a = input()
    // print("hello world,a)
    // `;
    //   const inputCase = `20`;
    // execute(code, inputCase);
    // add job
    // await sampleQueueProducers('paymentQueue', {
    //   name: 'Abhinav Sunil',
    //   place: 'Jalndhar',
    //   college: 'LPU',
    //   program: 'Btech CSE Artificial INtelligence and Machine Learning',
    // });
}));
