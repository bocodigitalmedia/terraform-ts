// See: https://www.terraform.io/docs/commands/
import { spawn } from 'child_process'

// Non-exported utility functions

const maybe1or2 = (a: string, b?: string): [string] | [string, string] => b ? [a, b] : [a]

const maybe1 = (a?: string): [string] | undefined => a ? [a] : undefined

const commandToArray = ({ command, args, opts }: Command): string[] => {
    const commandArr = command.split(' ')
    const argsArr = args ? args : []
    const optsArr = optsToArray(opts)

    return commandArr.concat(optsArr, argsArr)
}

const optsToArray = (opts: any): string[] => {
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

// Main

export type Config = {
    path: string
    cwd: string
}

export const Config = (props: Partial<Config> = {}): Config => ({
    path: props.path || "terraform",
    cwd: props.cwd || process.cwd()
})

export const bind = (cfg: Config) => (cmd: Command): Promise<string> => exec(cmd, cfg)

export const exec = (cmd: Command, cfg: Partial<Config> = {}): Promise<string> => {
    const { path, cwd } = Config(cfg)
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

// Commands

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


export type Apply = {
    command: "apply"
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

export const Apply = (dirOrPlan?: string, opts?: Apply['opts']): Apply => ({
    command: "apply", opts, args: maybe1(dirOrPlan)
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

export const Destroy = (dir?: string, opts?: Destroy['opts']): Destroy => ({
    command: "destroy", opts, args: maybe1(dir)
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

export const Fmt = (dir?: string, opts?: Fmt['opts']): Fmt => ({
    command: "fmt", opts, args: maybe1(dir)
})

export type ForceUnlock = {
    command: "force-unlock"
    args: [string] | [string, string]
    opts?: Partial<{
        force: boolean
    }>
}

export const ForceUnlock = (lockId: string, dir?: string, opts?: ForceUnlock['opts']): ForceUnlock => ({
    command: "force-unlock", opts, args: maybe1or2(lockId, dir)
})

export type Get = {
    command: "get"
    args?: [string]
    opts?: Partial<{
        update: null
    }>
}

export const Get = (dir?: string, opts?: Get['opts']): Get => ({
    command: "get", opts, args: maybe1(dir)
})

export type Graph = {
    command: "graph"
    args?: [string]
    opts?: Partial<{
        drawCycles: null
        type: "plan" | "plan-destroy" | "apply" | "legacy"
    }>
}

export const Graph = (dir?: string, opts?: Graph['opts']): Graph => ({
    command: "graph", opts, args: maybe1(dir)
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

export const Import = (src: string, dest: string, opts?: Import['opts']): Import => ({
    command: "import", opts, args: [src, dest]
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

export const Init = (dir?: string, opts?: Init['opts']): Init => ({
    command: "init", opts, args: maybe1(dir)
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

export const Output = (name?: string, opts?: Output['opts']): Output => ({
    command: "output", opts, args: maybe1(name)
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

export const Plan = (dirOrPlan?: string, opts?: Plan['opts']): Plan => ({
    command: "plan", opts, args: maybe1(dirOrPlan)
})

export type Providers = {
    command: "providers"
    args?: [string]
    opts?: never
}

export const Providers = (configPath?: string): Providers => ({
    command: "providers", args: maybe1(configPath)
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

export const Push = (path?: string, opts?: Push['opts']): Push => ({
    command: "push", opts, args: maybe1(path)
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


export const Refresh = (dir?: string, opts?: Refresh['opts']): Refresh => ({
    command: "refresh", opts, args: maybe1(dir)
})

export type Show = {
    command: "show"
    args?: [string]
    opts?: Partial<{
        moduleDepth: number
    }>
}

export const Show = (path?: string, opts?: Show['opts']): Show => ({
    command: "show", opts, args: maybe1(path)
})

export type StateList = {
    command: "state list"
    args?: string[]
    opts?: Partial<{
        state: string
    }>
}

export const StateList = (addresses?: string[], opts?: StateList['opts']): StateList => ({
    command: "state list", opts, args: addresses
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

export const StateMv = (src: string, dest: string, opts?: StateMv['opts']): StateMv => ({
    command: "state mv", opts, args: [src, dest]
})

export type StatePull = {
    command: "state pull"
    args?: never
    opts?: never
}

export const StatePull = (): StatePull => ({
    command: "state pull"
})

export type StatePush = {
    command: "state push"
    args: [string]
    opts?: Partial<{
        force: boolean
    }>
}

export const StatePush = (path: string, opts?: StatePush['opts']): StatePush => ({
    command: "state push", opts, args: [path]
})

export type StateRm = {
    command: "state rm"
    args: string[]
    opts?: Partial<{
        backup: string
        state: string
    }>
}

export const StateRm = (addresses: string[], opts?: StateRm['opts']): StateRm => ({
    command: "state rm", opts, args: addresses
})

export type StateShow = {
    command: "state show"
    args: [string]
    opts?: Partial<{
        state: string
    }>
}

export const StateShow = (address: string, opts?: StateShow['opts']): StateShow => ({
    command: "state show", opts, args: [address]
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

export const Taint = (name: string, opts?: Taint['opts']): Taint => ({
    command: "taint", opts, args: [name]
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

export const Validate = (dir?: string, opts?: Validate['opts']): Validate => ({
    command: "validate", opts, args: maybe1(dir)
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

export const Untaint = (name: string, opts?: Untaint['opts']): Untaint => ({
    command: "untaint", opts, args: [name]
})

export type WorkspaceList = {
    command: "workspace list",
    args?: never,
    opts?: never
}

export const WorkspaceList = (): WorkspaceList => ({
    command: "workspace list"
})

export type WorkspaceSelect = {
    command: "workspace select",
    args: [string],
    opts?: never
}

export const WorkspaceSelect = (name: string): WorkspaceSelect => ({
    command: "workspace select", args: [name]
})

export type WorkspaceNew = {
    command: "workspace new",
    args: [string],
    opts?: Partial<{
        state: string
    }>
}

export const WorkspaceNew = (name: string, opts?: WorkspaceNew['opts']): WorkspaceNew => ({
    command: "workspace new", opts, args: [name]
})

export type WorkspaceDelete = {
    command: "workspace delete",
    args: [string],
    opts?: Partial<{
        force: boolean
    }>
}

export const WorkspaceDelete = (name: string, opts?: WorkspaceDelete['opts']): WorkspaceDelete => ({
    command: "workspace delete", opts, args: [name]
})

export type WorkspaceShow = {
    command: "workspace show",
    args?: never,
    opts?: never
}

export const WorkspaceShow = (): WorkspaceShow => ({
    command: "workspace show"
})

export const Terraform = (cfg: Partial<Config> = {}) => {
    const exec = bind(Config(cfg))

    return {
        apply: (dirOrPlan?: string, opts?: Apply['opts']) => exec(Apply(dirOrPlan, opts)),
        destroy: (dir?: string, opts?: Destroy['opts']) => exec(Destroy(dir, opts)),
        fmt: (dir?: string, opts?: Fmt['opts']) => exec(Fmt(dir, opts)),
        forceUnlock: (lockId: string, dir?: string, opts?: ForceUnlock['opts']) => exec(ForceUnlock(lockId, dir, opts)),
        get: (dir?: string, opts?: Get['opts']) => exec(Get(dir, opts)),
        graph: (dir?: string, opts?: Graph['opts']) => exec(Graph(dir, opts)),
        import: (src: string, dest: string, opts?: Import['opts']) => exec(Import(src, dest, opts)),
        init: (dir?: string, opts?: Init['opts']) => exec(Init(dir, opts)),
        output: (name?: string, opts?: Output['opts']) => exec(Output(name, opts)),
        plan: (dirOrPlan?: string, opts?: Plan['opts']) => exec(Plan(dirOrPlan, opts)),
        providers: (configPath?: string) => exec(Providers(configPath)),
        push: (path?: string, opts?: Push['opts']) => exec(Push(path, opts)),
        refresh: (dir?: string, opts?: Refresh['opts']) => exec(Refresh(dir, opts)),
        show: (path?: string, opts?: Show['opts']) => exec(Show(path, opts)),
        state: {
            list: (addresses?: string[], opts?: StateList['opts']) => exec(StateList(addresses, opts)),
            mv: (src: string, dest: string, opts?: StateMv['opts']) => exec(StateMv(src, dest, opts)),
            pull: () => exec(StatePull()),
            push: (path: string, opts?: StatePush['opts']) => exec(StatePush(path, opts)),
            rm: (addresses: string[], opts?: StateRm['opts']) => exec(StateRm(addresses, opts)),
            show: (address: string, opts?: StateShow['opts']) => exec(StateShow(address, opts))
        },
        taint: (name: string, opts?: Taint['opts']) => exec(Taint(name, opts)),
        validate: (dir?: string, opts?: Validate['opts']) => exec(Validate(dir, opts)),
        untaint: (name: string, opts?: Untaint['opts']) => exec(Untaint(name, opts)),
        workspace: {
            list: () => exec(WorkspaceList()),
            select: (name: string) => exec(WorkspaceSelect(name)),
            new: (name: string, opts?: WorkspaceNew['opts']) => exec(WorkspaceNew(name, opts)),
            delete: (name: string, opts?: WorkspaceDelete['opts']) => exec(WorkspaceDelete(name, opts)),
            show: () => exec(WorkspaceShow())
        }
    }
}

// Example:
// const tf = Terraform({ cwd: '/Users/christianbradley/src/delphire-terraform/modules/environment/api' })
// tf.workspace.list().then(console.log).catch(console.error)