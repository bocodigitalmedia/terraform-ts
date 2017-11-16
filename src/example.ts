import { Terraform, exec } from "./Terraform"
import { Plan } from "./Command"

const tf = Terraform({
  path: "/usr/local/bin/terraform",
  cwd: "/Users/christianbradley/src/delphire-terraform/modules/instance/api",
  stderr: process.stderr,
  stdout: process.stdout
})

exec(Plan(), tf).then(console.log).catch(console.error)
// exec(WorkspaceShow(), tf).then(console.log)