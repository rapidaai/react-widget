"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toTitleCase = exports.toTextContent = exports.toContentText = void 0;
const common_pb_1 = require("@/app/clients/protos/common_pb");
const toContentText = (cnt) => {
    if (!cnt)
        return "";
    try {
        return new TextDecoder().decode(cnt.getContent());
    }
    catch (error) {
        return "";
    }
};
exports.toContentText = toContentText;
/**
 *
 * @param str
 * @returns
 */
const toTextContent = (str) => {
    const cnt = new common_pb_1.Content();
    cnt.setContentformat("raw");
    cnt.setContenttype("text");
    cnt.setContent(new TextEncoder().encode(str));
    return cnt;
};
exports.toTextContent = toTextContent;
const toTitleCase = (str) => {
    return str
        .toLowerCase()
        .split(" ")
        .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
    })
        .join(" ");
};
exports.toTitleCase = toTitleCase;
