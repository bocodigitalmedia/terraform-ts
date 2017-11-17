"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
exports.workspaceShow = Util_1.trim;
exports.workspaceList = function (str) {
    return str.split("\n")
        .map(Util_1.trim)
        .filter(Util_1.isPresentString)
        .map(function (val) { return /^(\*\s+)?(.+)$/.exec(val)[2]; });
};
exports.stateList = function (str) {
    return str.split("\n")
        .map(Util_1.trim)
        .filter(Util_1.isPresentString);
};
exports.stateShow = function (str) {
    return str.split("\n")
        .map(Util_1.trim)
        .filter(Util_1.isPresentString)
        .map(function (line) {
        var match = /^(\S+)\s+=\s*(.*)$/.exec(line);
        return [match[1], match[2]];
    });
};
exports.statePull = JSON.parse;
