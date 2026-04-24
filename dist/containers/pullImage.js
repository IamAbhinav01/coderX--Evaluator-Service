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
exports.default = pullImage;
const dockerode_1 = __importDefault(require("dockerode"));
function pullImage(imgName) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const docker = new dockerode_1.default();
            return new Promise((res, rej) => {
                docker.pull(imgName, (err, stream) => {
                    if (err)
                        throw err;
                    docker.modem.followProgress(stream, (err, response) => (err ? rej(err) : res(response)), (event) => {
                        console.log(event.status);
                    });
                });
            });
        }
        catch (err) {
            console.log(err);
        }
    });
}
