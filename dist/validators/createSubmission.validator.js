"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatecreateSubmissionDto = void 0;
const validatecreateSubmissionDto = (schema) => (req, res, next) => {
    try {
        schema.parse(Object.assign({}, req.body));
        next();
    }
    catch (error) {
        console.log(error);
        return res.status(404).json({
            message: 'something went wrong.',
        });
    }
};
exports.validatecreateSubmissionDto = validatecreateSubmissionDto;
