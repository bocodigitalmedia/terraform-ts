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
function exec(command, tf, parse) {
    var options = Command_1.toArray(command);
    var childProcess = child_process_1.spawn(tf.path, options, { cwd: tf.cwd, env: tf.env });
    var parseStdout = function (stdout) { return parse ? parse(stdout) : stdout; };
    var stdout = "";
    var stderr = "";
    var stdoutListener = function (chunk) {
        if (tf.stdout)
            tf.stdout.write(chunk);
        stdout = stdout.concat(chunk);
    };
    var stderrListener = function (chunk) {
        if (tf.stderr)
            tf.stderr.write(chunk);
        stderr = stderr.concat(chunk);
    };
    childProcess.stdout.on("data", stdoutListener);
    childProcess.stderr.on("data", stderrListener);
    return new Promise(function (resolve, reject) {
        childProcess.once("close", function (code, signal) {
            childProcess.stdout.removeListener("data", stdoutListener);
            childProcess.stderr.removeListener("data", stderrListener);
            code === 0 ? resolve(parseStdout(stdout)) : reject(stderr);
        });
    });
}
exports.exec = exec;
