"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Terraform_1 = require("./Terraform");
var Command_1 = require("./Command");
var tf = Terraform_1.Terraform({
    path: "/usr/local/bin/terraform",
    cwd: "/Users/christianbradley/src/delphire-terraform/modules/instance/api",
    stderr: process.stderr,
    stdout: process.stdout
});
Terraform_1.exec(Command_1.Plan(), tf).then(console.log).catch(console.error);
// exec(WorkspaceShow(), tf).then(console.log) 
