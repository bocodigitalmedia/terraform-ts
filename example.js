"use strict";
exports.__esModule = true;
var dist_1 = require("./dist");
var cfg = dist_1.Config();
console.log("Config", cfg);
var commands = [
    dist_1.WorkspaceList(),
    dist_1.WorkspaceNew("delete-me"),
    dist_1.WorkspaceList(),
    dist_1.WorkspaceSelect("default"),
    dist_1.WorkspaceDelete("delete-me"),
    dist_1.WorkspaceList()
];
dist_1.mapExec(commands, cfg).then(function (results) {
    results.forEach(function (result) { return console.log(result); });
});
