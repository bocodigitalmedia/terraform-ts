"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// See: https://www.terraform.io/docs/commands/
var child_process_1 = require("child_process");
/**
 * Construct a config object for calls to `exec`
 */
exports.Config = function (props) {
    if (props === void 0) { props = {}; }
    return ({
        cwd: props.cwd || process.cwd(),
        path: props.path || "terraform",
    });
};
function mapExec(commands, cfg) {
    if (cfg === undefined) {
        return function (cfg) { return mapExec(commands, cfg); };
    }
    var reduceFn = function (promise, cmd) {
        return promise.then(function (results) { return exec(cmd, cfg).then(function (result) { return results.concat(result); }); });
    };
    return commands.reduce(reduceFn, Promise.resolve([]));
}
exports.mapExec = mapExec;
function exec(cmd, cfg) {
    if (cfg === undefined) {
        return function (cfg) { return exec(cmd, cfg); };
    }
    var _a = exports.Config(cfg), path = _a.path, cwd = _a.cwd;
    var args = toArray(cmd);
    var cp = child_process_1.spawn(path, args, { cwd: cwd });
    var stdout = "";
    var stderr = "";
    var stdoutListener = function (chunk) { return stdout = stdout.concat(chunk.toString()); };
    var stderrListener = function (chunk) { return stderr = stderr.concat(chunk.toString()); };
    var removeListeners = function (errorListener, closeListener) {
        cp.stdout.removeListener("data", stdoutListener);
        cp.stderr.removeListener("data", stderrListener);
        if (errorListener) {
            cp.removeListener("error", errorListener);
        }
        if (closeListener) {
            cp.removeListener("close", closeListener);
        }
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
}
exports.exec = exec;
/**
 * A Terraform class bound to a configuration, providing methods for all commands.
 */
var Terraform = /** @class */ (function () {
    function Terraform(config) {
        if (config === void 0) { config = {}; }
        this.config = exports.Config(config);
    }
    Terraform.prototype.exec = function (cmd) {
        return exec(cmd, this.config);
    };
    Terraform.prototype.apply = function (dirOrPlan, opts) {
        return this.exec(exports.Apply(dirOrPlan, opts));
    };
    Terraform.prototype.destroy = function (dir, opts) {
        return this.exec(exports.Destroy(dir, opts));
    };
    Terraform.prototype.fmt = function (dir, opts) {
        return this.exec(exports.Fmt(dir, opts));
    };
    Terraform.prototype.forceUnlock = function (lockId, dir, opts) {
        return this.exec(exports.ForceUnlock(lockId, dir, opts));
    };
    Terraform.prototype.get = function (dir, opts) {
        return this.exec(exports.Get(dir, opts));
    };
    Terraform.prototype.graph = function (dir, opts) {
        return this.exec(exports.Graph(dir, opts));
    };
    Terraform.prototype.import = function (src, dest, opts) {
        return this.exec(exports.Import(src, dest, opts));
    };
    Terraform.prototype.init = function (dir, opts) {
        return this.exec(exports.Init(dir, opts));
    };
    Terraform.prototype.output = function (name, opts) {
        return this.exec(exports.Output(name, opts));
    };
    Terraform.prototype.plan = function (dirOrPlan, opts) {
        return this.exec(exports.Plan(dirOrPlan, opts));
    };
    Terraform.prototype.providers = function (configPath) {
        return this.exec(exports.Providers(configPath));
    };
    Terraform.prototype.push = function (path, opts) {
        return this.exec(exports.Push(path, opts));
    };
    Terraform.prototype.refresh = function (dir, opts) {
        return this.exec(exports.Refresh(dir, opts));
    };
    Terraform.prototype.show = function (path, opts) {
        return this.exec(exports.Show(path, opts));
    };
    Terraform.prototype.stateList = function (addresses, opts) {
        return this.exec(exports.StateList(addresses, opts));
    };
    Terraform.prototype.stateMv = function (src, dest, opts) {
        return this.exec(exports.StateMv(src, dest, opts));
    };
    Terraform.prototype.statePull = function () {
        return this.exec(exports.StatePull());
    };
    Terraform.prototype.statePush = function (path, opts) {
        return this.exec(exports.StatePush(path, opts));
    };
    Terraform.prototype.stateRm = function (addresses, opts) {
        return this.exec(exports.StateRm(addresses, opts));
    };
    Terraform.prototype.stateShow = function (address, opts) {
        return this.exec(exports.StateShow(address, opts));
    };
    Terraform.prototype.taint = function (name, opts) {
        return this.exec(exports.Taint(name, opts));
    };
    Terraform.prototype.validate = function (dir, opts) {
        return this.exec(exports.Validate(dir, opts));
    };
    Terraform.prototype.untaint = function (name, opts) {
        return this.exec(exports.Untaint(name, opts));
    };
    Terraform.prototype.workspaceList = function () {
        return this.exec(exports.WorkspaceList());
    };
    Terraform.prototype.workspaceSelect = function (name) {
        return this.exec(exports.WorkspaceSelect(name));
    };
    Terraform.prototype.workspaceNew = function (name, opts) {
        return this.exec(exports.WorkspaceNew(name, opts));
    };
    Terraform.prototype.workspaceDelete = function (name, opts) {
        return this.exec(exports.WorkspaceDelete(name, opts));
    };
    Terraform.prototype.workspaceShow = function () {
        return this.exec(exports.WorkspaceShow());
    };
    return Terraform;
}());
exports.Terraform = Terraform;
exports.Apply = function (dirOrPlan, opts) { return ({
    command: "apply", opts: opts, args: maybe1(dirOrPlan),
}); };
exports.Destroy = function (dir, opts) { return ({
    command: "destroy", opts: opts, args: maybe1(dir),
}); };
exports.Fmt = function (dir, opts) { return ({
    command: "fmt", opts: opts, args: maybe1(dir),
}); };
exports.ForceUnlock = function (lockId, dir, opts) { return ({
    command: "force-unlock", opts: opts, args: maybe1or2(lockId, dir),
}); };
exports.Get = function (dir, opts) { return ({
    command: "get", opts: opts, args: maybe1(dir),
}); };
exports.Graph = function (dir, opts) { return ({
    command: "graph", opts: opts, args: maybe1(dir),
}); };
exports.Import = function (src, dest, opts) { return ({
    command: "import", opts: opts, args: [src, dest],
}); };
exports.Init = function (dir, opts) { return ({
    command: "init", opts: opts, args: maybe1(dir),
}); };
exports.Output = function (name, opts) { return ({
    command: "output", opts: opts, args: maybe1(name),
}); };
exports.Plan = function (dirOrPlan, opts) { return ({
    command: "plan", opts: opts, args: maybe1(dirOrPlan),
}); };
exports.Providers = function (configPath) { return ({
    command: "providers", args: maybe1(configPath),
}); };
exports.Push = function (path, opts) { return ({
    command: "push", opts: opts, args: maybe1(path),
}); };
exports.Refresh = function (dir, opts) { return ({
    command: "refresh", opts: opts, args: maybe1(dir),
}); };
exports.Show = function (path, opts) { return ({
    command: "show", opts: opts, args: maybe1(path),
}); };
exports.StateList = function (addresses, opts) { return ({
    command: "state list", opts: opts, args: addresses,
}); };
exports.StateMv = function (src, dest, opts) { return ({
    command: "state mv", opts: opts, args: [src, dest],
}); };
exports.StatePull = function () { return ({
    command: "state pull",
}); };
exports.StatePush = function (path, opts) { return ({
    command: "state push", opts: opts, args: [path],
}); };
exports.StateRm = function (addresses, opts) { return ({
    command: "state rm", opts: opts, args: addresses,
}); };
exports.StateShow = function (address, opts) { return ({
    command: "state show", opts: opts, args: [address],
}); };
exports.Taint = function (name, opts) { return ({
    command: "taint", opts: opts, args: [name],
}); };
exports.Validate = function (dir, opts) { return ({
    command: "validate", opts: opts, args: maybe1(dir),
}); };
exports.Untaint = function (name, opts) { return ({
    command: "untaint", opts: opts, args: [name],
}); };
exports.WorkspaceList = function () { return ({
    command: "workspace list",
}); };
exports.WorkspaceSelect = function (name) { return ({
    command: "workspace select", args: [name],
}); };
exports.WorkspaceNew = function (name, opts) { return ({
    command: "workspace new", opts: opts, args: [name],
}); };
exports.WorkspaceDelete = function (name, opts) { return ({
    command: "workspace delete", opts: opts, args: [name],
}); };
exports.WorkspaceShow = function () { return ({
    command: "workspace show",
}); };
var toArray = function (_a) {
    var command = _a.command, args = _a.args, opts = _a.opts;
    var commandArr = command.split(" ");
    var argsArr = args ? args : [];
    var optsArr = ['-no-color'].concat(optsToArray(opts));
    return commandArr.concat(optsArr, argsArr);
};
var optsToArray = function (opts) {
    if (typeof opts !== "object") {
        return [];
    }
    var keys = Object.keys(opts);
    return keys.reduce(function (memo, key) {
        var val = opts[key];
        var flg = flag(key);
        var next = Array.isArray(val) ? val.map(flg) : flg(val);
        return memo.concat(next);
    }, []);
};
var flag = function (key) { return function (val) {
    var k = flagKey(key);
    return val === null ? k : k + "=" + val;
}; };
var dasherize = function (str) { return str.replace(/[A-Z]/, "-$&").toLowerCase(); };
var flagKey = function (str) { return "-" + dasherize(str); };
var maybe1or2 = function (a, b) { return b ? [a, b] : [a]; };
var maybe1 = function (a) { return a ? [a] : undefined; };
