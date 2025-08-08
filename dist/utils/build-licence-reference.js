"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildLicenceReference = buildLicenceReference;
function buildLicenceReference(props) {
    const { name = 'unknown', number = 'unknown', year, desc = 'unknown' } = props;
    const newYear = new Date(year).getFullYear();
    return `${name}-N${number}-${newYear}-PT${desc ?? ''}`.toUpperCase();
}
