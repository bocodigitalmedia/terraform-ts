"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util_1 = require("./Util");
function optsToArray(opts) {
    if (opts == null)
        return [];
    return Object.keys(opts)
        .map(function (key) { return optToString(key, opts[key]); })
        .filter(Util_1.isPresentString);
}
exports.optsToArray = optsToArray;
function normalizeKey(key) {
    return key.replace(/([A-Z])/, "-$1").toLowerCase();
}
exports.normalizeKey = normalizeKey;
function optToString(key, value) {
    var nkey = "-" + normalizeKey(key);
    if (value === null) {
        return nkey;
    }
    if (Array.isArray(value)) {
        return value.map(function (val) { return nkey + "=" + val; }).join(" ");
    }
    else {
        return nkey + "=" + value;
    }
}
exports.optToString = optToString;
function argsToArray(args) {
    if (args == null)
        return [];
    return args.filter(Util_1.isPresentString);
}
exports.argsToArray = argsToArray;
function toArray(_a) {
    var name = _a.name, opts = _a.opts, args = _a.args;
    return name.split(/\s+/)
        .concat(["-no-color"])
        .concat(optsToArray(opts))
        .concat(argsToArray(args));
}
exports.toArray = toArray;
// Workspace
exports.WorkspaceList = function () { return ({
    name: "workspace list"
}); };
exports.WorkspaceSelect = function (name) { return ({
    name: "workspace select",
    args: [name]
}); };
exports.WorkspaceDelete = function (name) { return ({
    name: "workspace delete",
    args: [name]
}); };
exports.WorkspaceShow = function () { return ({
    name: "workspace show"
}); };
exports.WorkspaceNew = function (name) { return ({
    name: "workspace new",
    args: [name]
}); };
// State
exports.StateList = function (opts) { return ({
    name: "state list",
    opts: opts
}); };
exports.StateShow = function (address, opts) { return ({
    name: "state show",
    args: [address],
    opts: opts
}); };
exports.StateMv = function (src, dest, opts) { return ({
    name: "state mv",
    args: [src, dest],
    opts: opts
}); };
exports.StatePush = function (path, opts) { return ({
    name: "state push",
    args: [path],
    opts: opts
}); };
exports.StatePull = function () { return ({
    name: "state pull",
}); };
exports.StateRm = function (address, opts) { return ({
    name: "state rm",
    args: typeof address === "string" ? [address] : address,
    opts: opts
}); };
exports.Apply = function (dirOrPlan, opts) { return ({
    name: "apply",
    args: [dirOrPlan],
    opts: Object.assign({ input: false }, opts)
}); };
exports.Destroy = function (dir, opts) { return ({
    name: "destroy",
    args: [dir],
    opts: opts
}); };
exports.Get = function (dir, opts) { return ({
    name: "get",
    args: [dir],
    opts: opts
}); };
exports.Import = function (address, id, opts) { return ({
    name: "import",
    args: [address, id],
    opts: Object.assign({ input: false }, opts)
}); };
exports.Init = function (dir, opts) { return ({
    name: "init",
    args: [dir],
    opts: Object.assign({ input: false }, opts)
}); };
exports.Output = function (name, opts) { return ({
    name: "output",
    args: [name],
    opts: opts
}); };
exports.Plan = function (dirOrPlan, opts) { return ({
    name: "plan",
    args: [dirOrPlan],
    opts: Object.assign({ input: false }, opts)
}); };
exports.Providers = function (configPath) { return ({
    name: "providers",
    args: [configPath]
}); };
exports.Refresh = function (dir, opts) { return ({
    name: "refresh",
    args: [dir],
    opts: Object.assign({ input: false }, opts)
}); };
exports.Show = function (path, opts) { return ({
    name: "show",
    args: [path],
    opts: opts
}); };
exports.Taint = function (name, opts) { return ({
    name: "taint",
    args: [name],
    opts: opts
}); };
exports.Untaint = function (name, opts) { return ({
    name: "untaint",
    args: [name],
    opts: opts
}); };
