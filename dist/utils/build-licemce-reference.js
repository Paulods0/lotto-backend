"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildReference = buildReference;
function buildReference(props) {
    const { name = 'unknown', number = 'unknown', year = 'unknown', desc = 'unknown' } = props;
    return `${name}-N${number}-${year}-PT${desc ?? ''}`.toUpperCase();
}
