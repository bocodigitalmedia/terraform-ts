import { Readable, Writable } from "stream"
import { ChildProcess, spawn } from "child_process"
import { Command, toArray } from "./Command"

export interface Terraform {
  path: string
  cwd: string
  env: any
  stdout?: Writable
  stderr?: Writable
}

// export interface Result {
//   stdout: string
//   stderr: string
// }

export function Terraform(props: Partial<Terraform>): Terraform {
  return {
    path: props.path || "terraform",
    cwd: props.cwd || process.cwd(),
    env: props.env || process.env,
    stdout: props.stdout,
    stderr: props.stderr
  }
}

export function exec(
  command: Command,
  { path, cwd, env, stderr, stdout }: Terraform
): Promise<string> {
  const options = toArray(command)
  const childProcess = spawn(path, options, { cwd, env })

  let out: string = ""
  let err: string = ""

  const stdoutListener = chunk => {
    if (stdout) stdout.write(chunk)
    out = out.concat(chunk)
  }

  const stderrListener = chunk => {
    if (stderr) stderr.write(chunk)
    err = err.concat(chunk)
  }

  childProcess.stdout.on("data", stdoutListener)
  childProcess.stderr.on("data", stderrListener)

  return new Promise((resolve, reject) => {
    childProcess.once("close", (code, signal) => {
      if (code === 0) {
        return resolve(out)
      } else {
        return reject(err)
      }
    })
  })
}
