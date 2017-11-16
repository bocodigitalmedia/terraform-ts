"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.voidResult = function () { return undefined; };
exports.trim = function (str) { return String.prototype.trim.apply(str); };
exports.isString = function (str) { return typeof str === "string"; };
exports.isPresentString = function (str) {
    return exports.isString(str) && /\S/.test(str);
};
