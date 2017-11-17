"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
exports.workspaceList = function (str) {
    return str
        .split("\n")
        .map(Util_1.trim)
        .filter(Util_1.isPresentString)
        .map(function (val) { return /^(\*\s+)?(.+)$/.exec(val)[1]; });
};
