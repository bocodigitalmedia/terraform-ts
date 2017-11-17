"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// See: https://www.terraform.io/docs/commands/
var child_process_1 = require("child_process");
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
exports.Apply = function (args, opts) { return ({
    command: "apply", args: args, opts: opts
}); };
exports.Destroy = function (args, opts) { return ({
    command: "destroy", args: args, opts: opts
}); };
exports.Fmt = function (args, opts) { return ({
    command: "fmt", args: args, opts: opts
}); };
exports.ForceUnlock = function (args, opts) { return ({
    command: "force-unlock", args: args, opts: opts
}); };
exports.Get = function (args, opts) { return ({
    command: "get", args: args, opts: opts
}); };
exports.Graph = function (args, opts) { return ({
    command: "graph", args: args, opts: opts
}); };
exports.Import = function (args, opts) { return ({
    command: "import", args: args, opts: opts
}); };
exports.Init = function (args, opts) { return ({
    command: "init", args: args, opts: opts
}); };
exports.Output = function (args, opts) { return ({
    command: "output", args: args, opts: opts
}); };
exports.Plan = function (args, opts) { return ({
    command: "plan", args: args, opts: opts
}); };
exports.Providers = function (args, opts) { return ({
    command: "providers", args: args, opts: opts
}); };
exports.Push = function (args, opts) { return ({
    command: "push", args: args, opts: opts
}); };
exports.Refresh = function (args, opts) { return ({
    command: "refresh", args: args, opts: opts
}); };
exports.Show = function (args, opts) { return ({
    command: "show", args: args, opts: opts
}); };
exports.StateList = function (args, opts) { return ({
    command: "state list", args: args, opts: opts
}); };
exports.StateMv = function (args, opts) { return ({
    command: "state mv", args: args, opts: opts
}); };
exports.StatePull = function (args, opts) { return ({
    command: "state pull", args: args, opts: opts
}); };
exports.StatePush = function (args, opts) { return ({
    command: "state push", args: args, opts: opts
}); };
exports.StateRm = function (args, opts) { return ({
    command: "state rm", args: args, opts: opts
}); };
exports.StateShow = function (args, opts) { return ({
    command: "state show", args: args, opts: opts
}); };
exports.Taint = function (args, opts) { return ({
    command: "taint", args: args, opts: opts
}); };
exports.Validate = function (args, opts) { return ({
    command: "validate", args: args, opts: opts
}); };
exports.Untaint = function (args, opts) { return ({
    command: "untaint", args: args, opts: opts
}); };
exports.WorkspaceList = function (args, opts) { return ({
    command: "workspace list", args: args, opts: opts
}); };
exports.WorkspaceSelect = function (args, opts) { return ({
    command: "workspace select", args: args, opts: opts
}); };
exports.WorkspaceNew = function (args, opts) { return ({
    command: "workspace new", args: args, opts: opts
}); };
exports.WorkspaceDelete = function (args, opts) { return ({
    command: "workspace delete", args: args, opts: opts
}); };
exports.WorkspaceShow = function (args, opts) { return ({
    command: "workspace show", args: args, opts: opts
}); };
var tf = {
    path: "terraform",
    cwd: "/Users/christianbradley/src/delphire-terraform/modules/environment/api"
};
Promise.resolve()
    .then(function () { return exports.exec(exports.WorkspaceSelect(["inventiv.staging"]), tf); })
    .then(function () { return exports.exec(exports.StatePull(), tf); })
    .then(console.log)
    .catch(console.error);
