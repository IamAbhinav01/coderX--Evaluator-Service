"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addSubmission = addSubmission;
function addSubmission(req, res) {
    const submissionDto = req.body;
    console.log(submissionDto);
    return res.status(201).json({
        success: true,
        error: {},
        message: 'Sucesfully collected submission',
        data: submissionDto,
    });
}
