// See: https://www.terraform.io/docs/commands/
import { spawn } from 'child_process'

export interface IConfig {
    path: string
    cwd: string
}

/**
 * Construct a config object for calls to `exec`
 */
export const Config = (props: Partial<IConfig> = {}): IConfig => ({
    cwd: props.cwd || process.cwd(),
    path: props.path || "terraform",
})

/**
 * Executes multiple commands and return a promise to an array of their results
 */
export function mapExec(commands: Command[]): (cfg: IConfig) => Promise<string[]>
export function mapExec(commands: Command[], cfg: IConfig): Promise<string[]>
export function mapExec(commands: Command[], cfg?: IConfig) {
    if (cfg === undefined) { return (cfg: IConfig) => mapExec(commands, cfg) }
    const reduceFn = (promise: Promise<string[]>, cmd: Command): Promise<string[]> =>
        promise.then((results) => exec(cmd, cfg).then((result) => results.concat(result)))

    return commands.reduce(reduceFn, Promise.resolve([]))
}

/**
 * Executes a command with the given configuration.
 * @returns a Promise to the `stdout` string result
 */
export function exec(cmd: Command, cfg: undefined): (cfg: IConfig) => Promise<string>
export function exec(cmd: Command, cfg: IConfig): Promise<string>
export function exec(cmd: Command, cfg: IConfig | undefined) {
    if (cfg === undefined) { return (cfg: IConfig) => exec(cmd, cfg) }

    const { path, cwd } = Config(cfg)
    const args = toArray(cmd)
    const cp = spawn(path, args, { cwd })

    let stdout = ""
    let stderr = ""

    const stdoutListener = (chunk: string | Buffer) => stdout = stdout.concat(chunk.toString())
    const stderrListener = (chunk: string | Buffer) => stderr = stderr.concat(chunk.toString())

    const removeListeners = (errorListener?: any, closeListener?: any) => {
        cp.stdout.removeListener("data", stdoutListener)
        cp.stderr.removeListener("data", stderrListener)
        if (errorListener) { cp.removeListener("error", errorListener) }
        if (closeListener) { cp.removeListener("close", closeListener) }
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

/**
 * A Terraform class bound to a configuration, providing methods for all commands.
 */
export class Terraform {
    private config: IConfig

    constructor(config: Partial<IConfig> = {}) {
        this.config = Config(config)
    }

    exec(cmd: Command): Promise<string> {
        return exec(cmd, this.config)
    }

    apply(dirOrPlan?: string, opts?: Partial<IApplyOpts>) {
        return this.exec(Apply(dirOrPlan, opts))
    }

    destroy(dir?: string, opts?: Partial<IDestroyOpts>) {
        return this.exec(Destroy(dir, opts))
    }

    fmt(dir?: string, opts?: Partial<IFmtOpts>) {
        return this.exec(Fmt(dir, opts))
    }

    forceUnlock(lockId: string, dir?: string, opts?: Partial<IForceUnlockOpts>) {
        return this.exec(ForceUnlock(lockId, dir, opts))
    }

    get(dir?: string, opts?: Partial<IGetOpts>) {
        return this.exec(Get(dir, opts))
    }

    graph(dir?: string, opts?: Partial<IGraphOpts>) {
        return this.exec(Graph(dir, opts))
    }

    import(src: string, dest: string, opts?: Partial<IImportOpts>) {
        return this.exec(Import(src, dest, opts))
    }

    init(dir?: string, opts?: Partial<IInitOpts>) {
        return this.exec(Init(dir, opts))
    }

    output(name?: string, opts?: Partial<IOutputOpts>) {
        return this.exec(Output(name, opts))
    }

    plan(dirOrPlan?: string, opts?: Partial<IPlanOpts>) {
        return this.exec(Plan(dirOrPlan, opts))
    }

    providers(configPath?: string) {
        return this.exec(Providers(configPath))
    }

    push(path?: string, opts?: Partial<IPushOpts>) {
        return this.exec(Push(path, opts))
    }

    refresh(dir?: string, opts?: Partial<IRefreshOpts>) {
        return this.exec(Refresh(dir, opts))
    }

    show(path?: string, opts?: Partial<IShowOpts>) {
        return this.exec(Show(path, opts))
    }

    stateList(addresses?: string[], opts?: Partial<IStateListOpts>) {
        return this.exec(StateList(addresses, opts))
    }

    stateMv(src: string, dest: string, opts?: Partial<IStateMvOpts>) {
        return this.exec(StateMv(src, dest, opts))
    }

    statePull() {
        return this.exec(StatePull())
    }

    statePush(path: string, opts?: Partial<IStatePushOpts>) {
        return this.exec(StatePush(path, opts))
    }

    stateRm(addresses: string[], opts?: Partial<IStateRmOpts>) {
        return this.exec(StateRm(addresses, opts))
    }

    stateShow(address: string, opts?: Partial<IStateShowOpts>) {
        return this.exec(StateShow(address, opts))
    }

    taint(name: string, opts?: Partial<ITaintOpts>) {
        return this.exec(Taint(name, opts))
    }

    validate(dir?: string, opts?: Partial<IValidateOpts>) {
        return this.exec(Validate(dir, opts))
    }

    untaint(name: string, opts?: Partial<IUntaintOpts>) {
        return this.exec(Untaint(name, opts))
    }

    workspaceList() {
        return this.exec(WorkspaceList())
    }

    workspaceSelect(name: string) {
        return this.exec(WorkspaceSelect(name))
    }

    workspaceNew(name: string, opts?: Partial<IWorkspaceNewOpts>) {
        return this.exec(WorkspaceNew(name, opts))
    }

    workspaceDelete(name: string, opts?: Partial<IWorkspaceDeleteOpts>) {
        return this.exec(WorkspaceDelete(name, opts))
    }

    workspaceShow() {
        return this.exec(WorkspaceShow())
    }

}

// export const apply = (dirOrPlan?: string, opts?: Partial<IApplyOpts>) => (cfg: IConfig) =>
//     exec(Apply(dirOrPlan, opts), cfg)

// export const destroy = (dir?: string, opts?: Partial<IDestroyOpts>) => (cfg: IConfig) =>
//     exec(Destroy(dir, opts), cfg)

// export const fmt = (dir?: string, opts?: Partial<IFmtOpts>) => (cfg: IConfig) =>
//     exec(Fmt(dir, opts), cfg)

// export const forceUnlock = (lockId: string, dir?: string, opts?: Partial<IForceUnlockOpts>) => (cfg: IConfig) =>
//     exec(ForceUnlock(lockId, dir, opts), cfg)

// export const get = (dir?: string, opts?: Partial<IGetOpts>) => (cfg: IConfig) =>
//     exec(Get(dir, opts), cfg)

// export const graph = (dir?: string, opts?: Partial<IGraphOpts>) => (cfg: IConfig) =>
//     exec(Graph(dir, opts), cfg)

// // tslint:disable-next-line:variable-name
// export const import_ = (src: string, dest: string, opts?: Partial<IImportOpts>) => (cfg: IConfig) =>
//     exec(Import(src, dest, opts), cfg)

// export const init = (dir?: string, opts?: Partial<IInitOpts>) => (cfg: IConfig) =>
//     exec(Init(dir, opts), cfg)

// export const output = (name?: string, opts?: Partial<IOutputOpts>) => (cfg: IConfig) =>
//     exec(Output(name, opts), cfg)

// export const plan = (dirOrPlan?: string, opts?: Partial<IPlanOpts>) => (cfg: IConfig) =>
//     exec(Plan(dirOrPlan, opts), cfg)

// export const providers = (configPath?: string) => (cfg: IConfig) =>
//     exec(Providers(configPath), cfg)

// export const push = (path?: string, opts?: Partial<IPushOpts>) => (cfg: IConfig) =>
//     exec(Push(path, opts), cfg)

// export const refresh = (dir?: string, opts?: Partial<IRefreshOpts>) => (cfg: IConfig) =>
//     exec(Refresh(dir, opts), cfg)

// export const show = (path?: string, opts?: Partial<IShowOpts>) => (cfg: IConfig) =>
//     exec(Show(path, opts), cfg)

// export const stateList = (addresses?: string[], opts?: Partial<IStateListOpts>) => (cfg: IConfig) =>
//     exec(StateList(addresses, opts), cfg)

// export const stateMv = (src: string, dest: string, opts?: Partial<IStateMvOpts>) => (cfg: IConfig) =>
//     exec(StateMv(src, dest, opts), cfg)

// export const statePull = () => (cfg: IConfig) =>
//     exec(StatePull(), cfg)

// export const statePush = (path: string, opts?: Partial<IStatePushOpts>) => (cfg: IConfig) =>
//     exec(StatePush(path, opts), cfg)

// export const stateRm = (addresses: string[], opts?: Partial<IStateRmOpts>) => (cfg: IConfig) =>
//     exec(StateRm(addresses, opts), cfg)

// export const stateShow = (address: string, opts?: Partial<IStateShowOpts>) => (cfg: IConfig) =>
//     exec(StateShow(address, opts), cfg)

// export const taint = (name: string, opts?: Partial<ITaintOpts>) => (cfg: IConfig) =>
//     exec(Taint(name, opts), cfg)

// export const validate = (dir?: string, opts?: Partial<IValidateOpts>) => (cfg: IConfig) =>
//     exec(Validate(dir, opts), cfg)

// export const untaint = (name: string, opts?: Partial<IUntaintOpts>) => (cfg: IConfig) =>
//     exec(Untaint(name, opts), cfg)

// export const workspaceList = () => (cfg: IConfig) =>
//     exec(WorkspaceList(), cfg)

// export const workspaceSelect = (name: string) => (cfg: IConfig) =>
//     exec(WorkspaceSelect(name), cfg)

// export const workspaceNew = (name: string, opts?: Partial<IWorkspaceNewOpts>) => (cfg: IConfig) =>
//     exec(WorkspaceNew(name, opts), cfg)

// export const workspaceDelete = (name: string, opts?: Partial<IWorkspaceDeleteOpts>) => (cfg: IConfig) =>
//     exec(WorkspaceDelete(name, opts), cfg)

export type Command =
    | IApply
    | IDestroy
    | IFmt
    | IForceUnlock
    | IGet
    | IGraph
    | IImport
    | IInit
    | IOutput
    | IPlan
    | IProviders
    | IPush
    | IRefresh
    | IShow
    | IStateList
    | IStateMv
    | IStatePull
    | IStatePush
    | IStateRm
    | IStateShow
    | ITaint
    | IValidate
    | IUntaint
    | IWorkspaceList
    | IWorkspaceSelect
    | IWorkspaceNew
    | IWorkspaceDelete
    | IWorkspaceShow

export interface IApply {
    command: "apply"
    args?: [string]
    opts?: Partial<IApplyOpts>
}

export interface IApplyOpts {
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
}

export const Apply = (dirOrPlan?: string, opts?: Partial<IApplyOpts>): IApply => ({
    command: "apply", opts, args: maybe1(dirOrPlan),
})

export interface IDestroy {
    command: "destroy"
    args?: [string]
    opts?: Partial<IDestroyOpts>
}

export interface IDestroyOpts {
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
}

export const Destroy = (dir?: string, opts?: Partial<IDestroyOpts>): IDestroy => ({
    command: "destroy", opts, args: maybe1(dir),
})

export interface IFmt {
    command: "fmt"
    args?: [string]
    opts?: Partial<IFmtOpts>
}

export interface IFmtOpts {
    list: boolean
    write: boolean
    diff: boolean
    check: boolean
}

export const Fmt = (dir?: string, opts?: Partial<IFmtOpts>): IFmt => ({
    command: "fmt", opts, args: maybe1(dir),
})

export interface IForceUnlock {
    command: "force-unlock"
    args: [string] | [string, string]
    opts?: Partial<IForceUnlockOpts>
}

export interface IForceUnlockOpts {
    force: boolean
}

export const ForceUnlock = (lockId: string, dir?: string, opts?: Partial<IForceUnlockOpts>): IForceUnlock => ({
    command: "force-unlock", opts, args: maybe1or2(lockId, dir),
})

export interface IGet {
    command: "get"
    args?: [string]
    opts?: Partial<IGetOpts>
}

export interface IGetOpts {
    update: null
}

export const Get = (dir?: string, opts?: Partial<IGetOpts>): IGet => ({
    command: "get", opts, args: maybe1(dir),
})

export interface IGraph {
    command: "graph"
    args?: [string]
    opts?: Partial<IGraphOpts>
}

export interface IGraphOpts {
    drawCycles: null
    type: "plan" | "plan-destroy" | "apply" | "legacy"
}

export const Graph = (dir?: string, opts?: Partial<IGraphOpts>): IGraph => ({
    command: "graph", opts, args: maybe1(dir),
})

export interface IImport {
    command: "import"
    args: [string, string]
    opts?: Partial<IImportOpts>
}

export interface IImportOpts {
    backup: string
    config: string
    lock: boolean
    lockTimeout: string
    provider: string
    state: string
    stateOut: string
    var: string[]
    varFile: string
}

export const Import = (src: string, dest: string, opts?: Partial<IImportOpts>): IImport => ({
    command: "import", opts, args: [src, dest],
})

export interface IInit {
    command: "init"
    args?: [string]
    opts?: Partial<IInitOpts>
}

export interface IInitOpts {
    lock: boolean
    lockTimeout: string
    upgrade: null
}

export const Init = (dir?: string, opts?: Partial<IInitOpts>): IInit => ({
    command: "init", opts, args: maybe1(dir),
})

export interface IOutput {
    command: "output"
    args?: [string]
    opts?: Partial<IOutputOpts>;
}

export interface IOutputOpts {
    json: null;
    state: string;
    module: string;
}

export const Output = (name?: string, opts?: Partial<IOutputOpts>): IOutput => ({
    command: "output", opts, args: maybe1(name),
});

export interface IPlan {
    command: "plan";
    args?: [string];
    opts?: Partial<IPlanOpts>;
}

export interface IPlanOpts {
    destroy: null;
    detailedExitcode: null;
    lock: boolean;
    lockTimeout: string;
    moduleDepth: number;
    out: string;
    parallelism: number;
    refresh: boolean;
    state: string;
    target: string[];
    var: string[];
    varFile: string;
}

export const Plan = (dirOrPlan?: string, opts?: Partial<IPlanOpts>): IPlan => ({
    command: "plan", opts, args: maybe1(dirOrPlan),
});

export interface IProviders {
    command: "providers";
    args?: [string];
    opts?: never;
}

export const Providers = (configPath?: string): IProviders => ({
    command: "providers", args: maybe1(configPath),
});

export interface IPush {
    command: "push";
    args?: [string];
    opts?: Partial<IPushOpts>;
}

export interface IPushOpts {
    atlasAddress: string;
    uploadModules: boolean;
    name: string;
    overwrite: string[];
    token: string;
    var: string[];
    varFile: string;
    vcs: boolean;
}

export const Push = (path?: string, opts?: Partial<IPushOpts>): IPush => ({
    command: "push", opts, args: maybe1(path),
});

export interface IRefresh {
    command: "refresh";
    args?: [string];
    opts?: Partial<IRefreshOpts>;
}

export interface IRefreshOpts {
    backup: string;
    lock: boolean;
    lockTimeout: string;
    state: string;
    stateOut: string;
    target: string[];
    var: string[];
    varFile: string;
}

export const Refresh = (dir?: string, opts?: Partial<IRefreshOpts>): IRefresh => ({
    command: "refresh", opts, args: maybe1(dir),
});

export interface IShow {
    command: "show";
    args?: [string];
    opts?: Partial<IShowOpts>;
}

export interface IShowOpts {
    moduleDepth: number;
}

export const Show = (path?: string, opts?: Partial<IShowOpts>): IShow => ({
    command: "show", opts, args: maybe1(path),
});

export interface IStateList {
    command: "state list";
    args?: string[];
    opts?: Partial<IStateListOpts>;
}

export interface IStateListOpts {
    state: string;
}

export const StateList = (addresses?: string[], opts?: Partial<IStateListOpts>): IStateList => ({
    command: "state list", opts, args: addresses,
});

export interface IStateMv {
    command: "state mv";
    args: [string, string];
    opts?: Partial<IStateMvOpts>;
}

export interface IStateMvOpts {
    backup: string;
    backupOut: string;
    state: string;
    stateOut: string;
}

export const StateMv = (src: string, dest: string, opts?: Partial<IStateMvOpts>): IStateMv => ({
    command: "state mv", opts, args: [src, dest],
});

export interface IStatePull {
    command: "state pull";
    args?: never;
    opts?: never;
}

export const StatePull = (): IStatePull => ({
    command: "state pull",
});

export interface IStatePush {
    command: "state push";
    args: [string];
    opts?: Partial<IStatePushOpts>;
}

export interface IStatePushOpts {
    force: boolean;
}

export const StatePush = (path: string, opts?: Partial<IStatePushOpts>): IStatePush => ({
    command: "state push", opts, args: [path],
});

export interface IStateRm {
    command: "state rm";
    args: string[];
    opts?: Partial<IStateRmOpts>;
}

export interface IStateRmOpts {
    backup: string;
    state: string;
}

export const StateRm = (addresses: string[], opts?: Partial<IStateRmOpts>): IStateRm => ({
    command: "state rm", opts, args: addresses,
});

export interface IStateShow {
    command: "state show";
    args: [string];
    opts?: Partial<IStateShowOpts>;
}

export interface IStateShowOpts {
    state: string;
}

export const StateShow = (address: string, opts?: Partial<IStateShowOpts>): IStateShow => ({
    command: "state show", opts, args: [address],
});

export interface ITaint {
    command: "taint";
    args: [string];
    opts?: Partial<ITaintOpts>;
}

export interface ITaintOpts {
    allowMissing: null;
    backup: string;
    lock: boolean;
    lockTimeout: string;
    module: string;
    state: string;
    stateOut: string;
}

export const Taint = (name: string, opts?: Partial<ITaintOpts>): ITaint => ({
    command: "taint", opts, args: [name],
});

export interface IValidate {
    command: "validate";
    args?: [string];
    opts?: Partial<IValidateOpts>;
}

export interface IValidateOpts {
    checkVariables: boolean;
    var: string[];
    varFile: string;
}

export const Validate = (dir?: string, opts?: Partial<IValidateOpts>): IValidate => ({
    command: "validate", opts, args: maybe1(dir),
});

export interface IUntaint {
    command: "untaint";
    args: [string];
    opts?: Partial<IUntaintOpts>;
}

export interface IUntaintOpts {
    allowMissing: null;
    backup: string;
    index: number;
    lock: boolean;
    lockTimeout: string;
    module: string;
    state: string;
    stateOut: string;
}

export const Untaint = (name: string, opts?: Partial<IUntaintOpts>): IUntaint => ({
    command: "untaint", opts, args: [name],
});

export interface IWorkspaceList {
    command: "workspace list";
    args?: never;
    opts?: never;
}

export const WorkspaceList = (): IWorkspaceList => ({
    command: "workspace list",
});

export interface IWorkspaceSelect {
    command: "workspace select";
    args: [string];
    opts?: never;
}

export const WorkspaceSelect = (name: string): IWorkspaceSelect => ({
    command: "workspace select", args: [name],
});

export interface IWorkspaceNew {
    command: "workspace new";
    args: [string];
    opts?: Partial<IWorkspaceNewOpts>;
}

export interface IWorkspaceNewOpts {
    state: string;
}

export const WorkspaceNew = (name: string, opts?: Partial<IWorkspaceNewOpts>): IWorkspaceNew => ({
    command: "workspace new", opts, args: [name],
});

export interface IWorkspaceDelete {
    command: "workspace delete";
    args: [string];
    opts?: Partial<IWorkspaceDeleteOpts>;
}

export interface IWorkspaceDeleteOpts {
    force: boolean;
}

export const WorkspaceDelete = (name: string, opts?: Partial<IWorkspaceDeleteOpts>): IWorkspaceDelete => ({
    command: "workspace delete", opts, args: [name],
});

export interface IWorkspaceShow {
    command: "workspace show";
    args?: never;
    opts?: never;
}

export const WorkspaceShow = (): IWorkspaceShow => ({
    command: "workspace show",
});

const toArray = ({ command, args, opts }: Command): string[] => {
    const commandArr = command.split(" ")
    const argsArr = args ? args : []
    const optsArr = ['-no-color'].concat(optsToArray(opts))

    return commandArr.concat(optsArr, argsArr)
};

const optsToArray = (opts: any): string[] => {
    if (typeof opts !== "object") { return []; }
    const keys = Object.keys(opts);

    return keys.reduce<string[]>((memo, key) => {
        const val = opts[key]
        const flg = flag(key)
        const next = Array.isArray(val) ? val.map(flg) : flg(val)
        return memo.concat(next)
    }, []);
};

const flag = (key: string) => (val: string | number | null | boolean): string => {
    const k = flagKey(key)
    return val === null ? k : `${k}=${val}`
}

const dasherize = (str: string) => str.replace(/[A-Z]/, "-$&").toLowerCase()
const flagKey = (str: string) => "-" + dasherize(str)
const maybe1or2 = (a: string, b?: string): [string] | [string, string] => b ? [a, b] : [a];
const maybe1 = (a?: string): [string] | undefined => a ? [a] : undefined;
