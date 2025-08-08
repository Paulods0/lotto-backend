"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectIfDefined = connectIfDefined;
exports.connectOrDisconnect = connectOrDisconnect;
function connectIfDefined(field, id) {
    return id ? { [field]: { connect: { id } } } : {};
}
function connectOrDisconnect(field, id) {
    return id ? { [field]: { connect: { id } } } : { [field]: { disconnect: true } };
}
