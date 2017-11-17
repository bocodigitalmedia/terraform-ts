"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// See: https://www.terraform.io/docs/commands/
var child_process_1 = require("child_process");
// export const t1 = (a: string): [string] => [a]
// export const t2 = (a: string, b: string): [string, string] => [a, b]
exports.maybe1or2 = function (a, b) { return b ? [a, b] : [a]; };
exports.maybe1 = function (a) { return a ? [a] : undefined; };
exports.bind = function (cfg) { return function (cmd) { return exports.exec(cmd, cfg); }; };
exports.exec = function (cmd, _a) {
    var path = _a.path, cwd = _a.cwd;
    var args = exports.commandToArray(cmd);
    var cp = child_process_1.spawn(path, args, { cwd: cwd });
    var stdout = "";
    var stderr = "";
    var stdoutListener = function (chunk) { return stdout = stdout.concat(chunk.toString()); };
    var stderrListener = function (chunk) { return stderr = stderr.concat(chunk.toString()); };
    var removeListeners = function (errorListener, closeListener) {
        cp.stdout.removeListener("data", stdoutListener);
        cp.stderr.removeListener("data", stderrListener);
        if (errorListener)
            cp.removeListener("error", errorListener);
        if (closeListener)
            cp.removeListener("close", closeListener);
    };
    cp.stdout.on("data", stdoutListener);
    cp.stderr.on("data", stderrListener);
    return new Promise(function (resolve, reject) {
        var errorListener = function (error) {
            removeListeners(null, closeListener);
            reject(error);
        };
        var closeListener = function (code) {
            removeListeners(errorListener);
            code === 0 ? resolve(stdout) : reject(stderr);
        };
        cp.once("error", errorListener);
        cp.once("close", closeListener);
    });
};
exports.commandToArray = function (_a) {
    var command = _a.command, args = _a.args, opts = _a.opts;
    var commandArr = command.split(' ');
    var argsArr = args ? args : [];
    var optsArr = exports.optsToArray(opts);
    return commandArr.concat(optsArr, argsArr);
};
exports.optsToArray = function (opts) {
    if (typeof opts !== 'object')
        return [];
    var keys = Object.keys(opts);
    return keys.reduce(function (memo, key) {
        var val = opts[key];
        var flag = "-" + key.replace(/[A-Z]/, "-$1").toLowerCase();
        var pair = function (val) { return flag + "=" + val.toString(); };
        if (val == null) {
            return memo.concat(flag);
        }
        if (Array.isArray(val)) {
            var pairs = val.map(pair);
            return memo.concat(pairs);
        }
        else {
            return memo.concat(pair(val));
        }
    }, []);
};
exports.Apply = function (dirOrPlan, opts) { return ({
    command: "apply", opts: opts, args: exports.maybe1(dirOrPlan)
}); };
exports.Destroy = function (dir, opts) { return ({
    command: "destroy", opts: opts, args: exports.maybe1(dir)
}); };
exports.Fmt = function (dir, opts) { return ({
    command: "fmt", opts: opts, args: exports.maybe1(dir)
}); };
exports.ForceUnlock = function (lockId, dir, opts) { return ({
    command: "force-unlock", opts: opts, args: exports.maybe1or2(lockId, dir)
}); };
exports.Get = function (dir, opts) { return ({
    command: "get", opts: opts, args: exports.maybe1(dir)
}); };
exports.Graph = function (dir, opts) { return ({
    command: "graph", opts: opts, args: exports.maybe1(dir)
}); };
exports.Import = function (src, dest, opts) { return ({
    command: "import", opts: opts, args: [src, dest]
}); };
exports.Init = function (dir, opts) { return ({
    command: "init", opts: opts, args: exports.maybe1(dir)
}); };
exports.Output = function (name, opts) { return ({
    command: "output", opts: opts, args: exports.maybe1(name)
}); };
exports.Plan = function (dirOrPlan, opts) { return ({
    command: "plan", opts: opts, args: exports.maybe1(dirOrPlan)
}); };
exports.Providers = function (configPath) { return ({
    command: "providers", args: exports.maybe1(configPath)
}); };
exports.Push = function (path, opts) { return ({
    command: "push", opts: opts, args: exports.maybe1(path)
}); };
exports.Refresh = function (dir, opts) { return ({
    command: "refresh", opts: opts, args: exports.maybe1(dir)
}); };
exports.Show = function (path, opts) { return ({
    command: "show", opts: opts, args: exports.maybe1(path)
}); };
exports.StateList = function (addresses, opts) { return ({
    command: "state list", opts: opts, args: addresses
}); };
exports.StateMv = function (src, dest, opts) { return ({
    command: "state mv", opts: opts, args: [src, dest]
}); };
exports.StatePull = function () { return ({
    command: "state pull"
}); };
exports.StatePush = function (path, opts) { return ({
    command: "state push", opts: opts, args: [path]
}); };
exports.StateRm = function (addresses, opts) { return ({
    command: "state rm", opts: opts, args: addresses
}); };
exports.StateShow = function (address, opts) { return ({
    command: "state show", opts: opts, args: [address]
}); };
exports.Taint = function (name, opts) { return ({
    command: "taint", opts: opts, args: [name]
}); };
exports.Validate = function (dir, opts) { return ({
    command: "validate", opts: opts, args: exports.maybe1(dir)
}); };
exports.Untaint = function (name, opts) { return ({
    command: "untaint", opts: opts, args: [name]
}); };
exports.WorkspaceList = function () { return ({
    command: "workspace list"
}); };
exports.WorkspaceSelect = function (name) { return ({
    command: "workspace select", args: [name]
}); };
exports.WorkspaceNew = function (name, opts) { return ({
    command: "workspace new", opts: opts, args: [name]
}); };
exports.WorkspaceDelete = function (name, opts) { return ({
    command: "workspace delete", opts: opts, args: [name]
}); };
exports.WorkspaceShow = function () { return ({
    command: "workspace show"
}); };
// const e: Executor = {
//     path: "terraform",
//     cwd: "/Users/christianbradley/src/delphire-terraform/modules/environment/api"
// }
// const x = bind(e)
// Promise.resolve()
//     .then(() => x(WorkspaceSelect(["inventiv.staging"])))
//     .then(() => x(StatePull()))
//     .then(console.log)
//     // .then(() => exec(WorkspaceShow(), tf))
//     // .then(console.log)
//     .catch(console.error)
