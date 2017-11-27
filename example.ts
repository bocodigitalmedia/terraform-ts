import { exec, mapExec, Terraform, Config, WorkspaceList, WorkspaceSelect, WorkspaceNew, WorkspaceDelete } from "./dist"

const cfg = Config()

console.log("Config", cfg)

const commands = [
    WorkspaceList(),
    WorkspaceNew("delete-me"),
    WorkspaceList(),
    WorkspaceSelect("default"),
    WorkspaceDelete("delete-me"),
    WorkspaceList()
]

mapExec(commands, cfg).then(results => {
    results.forEach(result => console.log(result))
})
