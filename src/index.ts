// See: https://www.terraform.io/docs/commands/
import { spawn } from 'child_process'

export type Config = {
    path: string
    cwd: string
}

export const bind = (cfg: Config) => (cmd: Command): Promise<string> => exec(cmd, cfg)

export const exec = (cmd: Command, { path, cwd }: Config): Promise<string> => {
    const args = commandToArray(cmd)
    const cp = spawn(path, args, { cwd })

    let stdout = ""
    let stderr = ""

    const stdoutListener = (chunk: string | Buffer) => stdout = stdout.concat(chunk.toString())
    const stderrListener = (chunk: string | Buffer) => stderr = stderr.concat(chunk.toString())

    const removeListeners = (errorListener?: any, closeListener?: any) => {
        cp.stdout.removeListener("data", stdoutListener)
        cp.stderr.removeListener("data", stderrListener)
        if (errorListener) cp.removeListener("error", errorListener)
        if (closeListener) cp.removeListener("close", closeListener)
    }

    cp.stdout.on("data", stdoutListener)
    cp.stderr.on("data", stderrListener)

    return new Promise((resolve, reject) => {
        const errorListener = (error: Error) => {
            removeListeners(null, closeListener)
            reject(error)
        }

        const closeListener = (code: number) => {
            removeListeners(errorListener)
            code === 0 ? resolve(stdout) : reject(stderr)
        }

        cp.once("error", errorListener)
        cp.once("close", closeListener)
    })
}

export const commandToArray = ({ command, args, opts }: Command): string[] => {
    const commandArr = command.split(' ')
    const argsArr = args ? args : []
    const optsArr = optsToArray(opts)

    return commandArr.concat(optsArr, argsArr)
}

export const optsToArray = (opts: any): string[] => {
    if (typeof opts !== 'object') return []
    const keys = Object.keys(opts)

    return keys.reduce<string[]>((memo, key) => {
        const val = opts[key]
        const flag = "-" + key.replace(/[A-Z]/, "-$1").toLowerCase()
        const pair = (val: any) => `${flag}=${val.toString()}`

        if (val == null) {
            return memo.concat(flag)
        }
        if (Array.isArray(val)) {
            const pairs = val.map(pair)
            return memo.concat(pairs)
        }
        else {
            return memo.concat(pair(val))
        }
    }, [])
}

export type Command =
    | Apply
    | Destroy
    | Fmt
    | ForceUnlock
    | Get
    | Graph
    | Import
    | Init
    | Output
    | Plan
    | Providers
    | Push
    | Refresh
    | Show
    | StateList
    | StateMv
    | StatePull
    | StatePush
    | StateRm
    | StateShow
    | Taint
    | Validate
    | Untaint
    | WorkspaceList
    | WorkspaceSelect
    | WorkspaceNew
    | WorkspaceDelete
    | WorkspaceShow


export type DirOrPlan = string

export type Apply = {
    command: "apply"
    args?: [DirOrPlan]
    opts?: Partial<{
        backup: string
        lock: boolean
        lockTimeout: string
        autoApprove: null
        parallelism: number
        refresh: boolean
        state: string
        stateOut: string
        target: string[]
        var: string[]
        varFile: string
    }>

}

export const Apply = (args?: Apply['args'], opts?: Apply['opts']): Apply => ({
    command: "apply", args, opts
})


export type Destroy = {
    command: "destroy"
    args?: [string]
    opts?: Partial<{
        backup: string
        lock: boolean
        lockTimeout: string
        autoApprove: null
        parallelism: number
        refresh: boolean
        state: string
        stateOut: string
        target: string[]
        var: string[]
        varFile: string
    }>
}

export const Destroy = (args?: Destroy['args'], opts?: Destroy['opts']): Destroy => ({
    command: "destroy", args, opts
})

export type Fmt = {
    command: "fmt"
    args?: [string]
    opts?: Partial<{
        list: boolean
        write: boolean
        diff: boolean
        check: boolean
    }>
}

export const Fmt = (args?: Fmt['args'], opts?: Fmt['opts']): Fmt => ({
    command: "fmt", args, opts
})

export type ForceUnlock = {
    command: "force-unlock"
    args: [string] | [string, string]
    opts?: Partial<{
        force: boolean
    }>
}

export const ForceUnlock = (args: ForceUnlock['args'], opts?: ForceUnlock['opts']): ForceUnlock => ({
    command: "force-unlock", args, opts
})

export type Get = {
    command: "get"
    args?: [string]
    opts?: Partial<{
        update: null
    }>
}

export const Get = (args?: Get['args'], opts?: Get['opts']): Get => ({
    command: "get", args, opts
})

export type Graph = {
    command: "graph"
    args?: [string]
    opts?: Partial<{
        drawCycles: null
        type: "plan" | "plan-destroy" | "apply" | "legacy"
    }>
}

export const Graph = (args?: Graph['args'], opts?: Graph['opts']): Graph => ({
    command: "graph", args, opts
})

export type Import = {
    command: "import"
    args: [string, string]
    opts?: Partial<{
        backup: string
        config: string
        lock: boolean
        lockTimeout: string
        provider: string
        state: string
        stateOut: string
        var: string[]
        varFile: string
    }>
}

export const Import = (args: Import['args'], opts?: Import['opts']): Import => ({
    command: "import", args, opts
})

export type Init = {
    command: "init"
    args?: [string]
    opts?: Partial<{
        lock: boolean
        lockTimeout: string
        upgrade: null
    }>
}

export const Init = (args?: Init['args'], opts?: Init['opts']): Init => ({
    command: "init", args, opts
})

export type Output = {
    command: "output"
    args?: [string]
    opts?: Partial<{
        json: null
        state: string
        module: string
    }>
}

export const Output = (args?: Output['args'], opts?: Output['opts']): Output => ({
    command: "output", args, opts
})

export type Plan = {
    command: "plan"
    args?: [string]
    opts?: Partial<{
        destroy: null
        detailedExitcode: null
        lock: boolean
        lockTimeout: string
        moduleDepth: number
        out: string
        parallelism: number
        refresh: boolean
        state: string
        target: string[]
        var: string[]
        varFile: string
    }>
}

export const Plan = (args?: Plan['args'], opts?: Plan['opts']): Plan => ({
    command: "plan", args, opts
})

export type Providers = {
    command: "providers"
    args?: [string]
    opts?: never
}

export const Providers = (args?: Providers['args'], opts?: Providers['opts']): Providers => ({
    command: "providers", args, opts
})

export type Push = {
    command: "push"
    args?: [string]
    opts?: Partial<{
        atlasAddress: string
        uploadModules: boolean
        name: string
        overwrite: string[]
        token: string
        var: string[]
        varFile: string
        vcs: boolean
    }>
}

export const Push = (args?: Push['args'], opts?: Push['opts']): Push => ({
    command: "push", args, opts
})

export type Refresh = {
    command: "refresh"
    args?: [string]
    opts?: Partial<{
        backup: string
        lock: boolean
        lockTimeout: string
        state: string
        stateOut: string
        target: string[]
        var: string[]
        varFile: string
    }>
}


export const Refresh = (args?: Refresh['args'], opts?: Refresh['opts']): Refresh => ({
    command: "refresh", args, opts
})

export type Show = {
    command: "show"
    args?: [string]
    opts?: Partial<{
        moduleDepth: number
    }>
}

export const Show = (args?: Show['args'], opts?: Show['opts']): Show => ({
    command: "show", args, opts
})

export type StateList = {
    command: "state list"
    args?: string[]
    opts?: Partial<{
        state: string
    }>
}

export const StateList = (args?: StateList['args'], opts?: StateList['opts']): StateList => ({
    command: "state list", args, opts
})

export type StateMv = {
    command: "state mv"
    args: [string, string]
    opts?: Partial<{
        backup: string
        backupOut: string
        state: string
        stateOut: string
    }>
}

export const StateMv = (args: StateMv['args'], opts?: StateMv['opts']): StateMv => ({
    command: "state mv", args, opts
})

export type StatePull = {
    command: "state pull"
    args?: never
    opts?: never
}

export const StatePull = (args?: StatePull['args'], opts?: StatePull['opts']): StatePull => ({
    command: "state pull", args, opts
})

export type StatePush = {
    command: "state push"
    args: [string]
    opts?: Partial<{
        force: boolean
    }>
}

export const StatePush = (args: StatePush['args'], opts?: StatePush['opts']): StatePush => ({
    command: "state push", args, opts
})

export type StateRm = {
    command: "state rm"
    args: string[]
    opts?: Partial<{
        backup: string
        state: string
    }>
}

export const StateRm = (args: StateRm['args'], opts?: StateRm['opts']): StateRm => ({
    command: "state rm", args, opts
})

export type StateShow = {
    command: "state show"
    args: [string]
    opts?: Partial<{
        state: string
    }>
}

export const StateShow = (args: StateShow['args'], opts?: StateShow['opts']): StateShow => ({
    command: "state show", args, opts
})

export type Taint = {
    command: "taint"
    args: [string]
    opts?: Partial<{
        allowMissing: null
        backup: string
        lock: boolean
        lockTimeout: string
        module: string
        state: string
        stateOut: string
    }>
}

export const Taint = (args: Taint['args'], opts?: Taint['opts']): Taint => ({
    command: "taint", args, opts
})

export type Validate = {
    command: "validate"
    args?: [string]
    opts?: Partial<{
        checkVariables: boolean
        var: string[]
        varFile: string
    }>
}

export const Validate = (args?: Validate['args'], opts?: Validate['opts']): Validate => ({
    command: "validate", args, opts
})

export type Untaint = {
    command: "untaint"
    args: [string]
    opts?: Partial<{
        allowMissing: null
        backup: string
        index: number
        lock: boolean
        lockTimeout: string
        module: string
        state: string
        stateOut: string
    }>
}

export const Untaint = (args: Untaint['args'], opts?: Untaint['opts']): Untaint => ({
    command: "untaint", args, opts
})

export type WorkspaceList = {
    command: "workspace list",
    args?: never,
    opts?: never
}

export const WorkspaceList = (args?: WorkspaceList['args'], opts?: WorkspaceList['opts']): WorkspaceList => ({
    command: "workspace list", args, opts
})

export type WorkspaceSelect = {
    command: "workspace select",
    args: [string],
    opts?: never
}

export const WorkspaceSelect = (args: WorkspaceSelect['args'], opts?: WorkspaceSelect['opts']): WorkspaceSelect => ({
    command: "workspace select", args, opts
})

export type WorkspaceNew = {
    command: "workspace new",
    args: [string],
    opts?: Partial<{
        state: string
    }>
}

export const WorkspaceNew = (args: WorkspaceNew['args'], opts?: WorkspaceNew['opts']): WorkspaceNew => ({
    command: "workspace new", args, opts
})

export type WorkspaceDelete = {
    command: "workspace delete",
    args: [string],
    opts?: Partial<{
        force: boolean
    }>
}

export const WorkspaceDelete = (args: WorkspaceDelete['args'], opts?: WorkspaceDelete['opts']): WorkspaceDelete => ({
    command: "workspace delete", args, opts
})

export type WorkspaceShow = {
    command: "workspace show",
    args?: never,
    opts?: never
}

export const WorkspaceShow = (args?: WorkspaceShow['args'], opts?: WorkspaceShow['opts']): WorkspaceShow => ({
    command: "workspace show", args, opts
})

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
