"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const constants_1 = require("../utils/constants");
// Docker does not send stdout and stderr as
// plain text — it sends a multiplexed binary stream.
// DOCKER INTERNALLY SENDS OUTPUT AS A
// [HEADER][DATA][HEADER][DATA][HEADER][DATA]
// 1 → stdout
// 2 → stderr
// Docker mixes both streams in one binary buffer,
//  and we must decode it manually.
function decodeDockerStream(buffer) {
    let offset = 0;
    const output = {
        stdout: '',
        stderr: '',
    };
    while (offset < buffer.length) {
        const channel = buffer[offset];
        const length = buffer.readUInt32BE(offset + 4);
        const dataStart = offset + constants_1.HEADER_SIZE;
        const dataEnd = dataStart + length;
        const data = buffer.toString('utf-8', dataStart, dataEnd);
        if (channel == 1) {
            output.stdout += data;
        }
        else if (channel === 2) {
            output.stderr += data;
        }
        offset = dataEnd;
    }
    return output;
}
exports.default = decodeDockerStream;
