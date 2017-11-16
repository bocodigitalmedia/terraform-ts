"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var child_process_1 = require("child_process");
var Command_1 = require("./Command");
// export interface Result {
//   stdout: string
//   stderr: string
// }
function Terraform(props) {
    return {
        path: props.path || "terraform",
        cwd: props.cwd || process.cwd(),
        env: props.env || process.env,
        stdout: props.stdout,
        stderr: props.stderr
    };
}
exports.Terraform = Terraform;
function exec(command, _a) {
    var path = _a.path, cwd = _a.cwd, env = _a.env, stderr = _a.stderr, stdout = _a.stdout;
    var options = Command_1.toArray(command);
    var childProcess = child_process_1.spawn(path, options, { cwd: cwd, env: env });
    var out = "";
    var err = "";
    var stdoutListener = function (chunk) {
        if (stdout)
            stdout.write(chunk);
        out = out.concat(chunk);
    };
    var stderrListener = function (chunk) {
        if (stderr)
            stderr.write(chunk);
        err = err.concat(chunk);
    };
    childProcess.stdout.on("data", stdoutListener);
    childProcess.stderr.on("data", stderrListener);
    return new Promise(function (resolve, reject) {
        childProcess.once("close", function (code, signal) {
            if (code === 0) {
                return resolve(out);
            }
            else {
                return reject(err);
            }
        });
    });
}
exports.exec = exec;
