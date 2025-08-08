"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function catchErrors(controller) {
    return async function (req, res, next) {
        try {
            await controller(req, res, next);
        }
        catch (error) {
            next(error);
        }
    };
}
exports.default = catchErrors;
