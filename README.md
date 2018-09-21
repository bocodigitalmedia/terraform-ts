# terraform-ts

A Javascript wrapper for terraform CLI.

Supports all commands with the exception of `terraform console`.

## Installation

```
npm install terraform-ts
```

## Usage

See the generated [API Docs](https://bocodigitalmedia.github.io/terraform-ts/api) for detailed documentation.

### Using the Terraform Class

```ts
import { Terraform, Parse } from "terraform-ts"

const tf = new Terraform({
    path: "/path/to/terraform",
    cwd: "/path/to/project"
})

tf.workspaceList().then(console.log)

//   workspace1
// * workspace2
//   workspace3
```

### Functional Style

```ts
import { exec, map, Config, WorkspaceList, WorkspaceSelect, WorkspaceNew } from 'terraform-ts'

const cfg = Config({ cwd: "/path/to/project" })

// execute a single command
exec(WorkspaceNew("test-2"), cfg).then((console.log))

//> * default


// execute multiple commands
const commands = [
    WorkspaceNew("test-1"),
    WorkspaceSelect("default")
    WorkspaceList()
]

mapExec(commands, cfg).then(results => results.forEach(console.log))

// logs output of each command
```
