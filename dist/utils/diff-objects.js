"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.diffObjects = diffObjects;
function diffObjects(before, after) {
    const beforeFiltered = {};
    const afterFiltered = {};
    for (let key in after) {
        if (before[key] !== after[key]) {
            beforeFiltered[key] = before[key];
            afterFiltered[key] = after[key];
        }
    }
    return {
        before: Object.keys(beforeFiltered).length ? beforeFiltered : null,
        after: Object.keys(afterFiltered).length ? afterFiltered : null,
    };
}
