export interface IConfig {
    path: string;
    cwd: string;
}
/**
 * Construct a config object for calls to `exec`
 */
export declare const Config: (props?: Partial<IConfig>) => IConfig;
/**
 * Executes multiple commands and return a promise to an array of their results
 */
export declare function mapExec(commands: Command[]): (cfg: IConfig) => Promise<string[]>;
export declare function mapExec(commands: Command[], cfg: IConfig): Promise<string[]>;
/**
 * Executes a command with the given configuration.
 * @returns a Promise to the `stdout` string result
 */
export declare function exec(cmd: Command, cfg: undefined): (cfg: IConfig) => Promise<string>;
export declare function exec(cmd: Command, cfg: IConfig): Promise<string>;
/**
 * A Terraform class bound to a configuration, providing methods for all commands.
 */
export declare class Terraform {
    private config;
    constructor(config?: Partial<IConfig>);
    exec(cmd: Command): Promise<string>;
    apply(dirOrPlan?: string, opts?: Partial<IApplyOpts>): Promise<string>;
    destroy(dir?: string, opts?: Partial<IDestroyOpts>): Promise<string>;
    fmt(dir?: string, opts?: Partial<IFmtOpts>): Promise<string>;
    forceUnlock(lockId: string, dir?: string, opts?: Partial<IForceUnlockOpts>): Promise<string>;
    get(dir?: string, opts?: Partial<IGetOpts>): Promise<string>;
    graph(dir?: string, opts?: Partial<IGraphOpts>): Promise<string>;
    import(src: string, dest: string, opts?: Partial<IImportOpts>): Promise<string>;
    init(dir?: string, opts?: Partial<IInitOpts>): Promise<string>;
    output(name?: string, opts?: Partial<IOutputOpts>): Promise<string>;
    plan(dirOrPlan?: string, opts?: Partial<IPlanOpts>): Promise<string>;
    providers(configPath?: string): Promise<string>;
    push(path?: string, opts?: Partial<IPushOpts>): Promise<string>;
    refresh(dir?: string, opts?: Partial<IRefreshOpts>): Promise<string>;
    show(path?: string, opts?: Partial<IShowOpts>): Promise<string>;
    stateList(addresses?: string[], opts?: Partial<IStateListOpts>): Promise<string>;
    stateMv(src: string, dest: string, opts?: Partial<IStateMvOpts>): Promise<string>;
    statePull(): Promise<string>;
    statePush(path: string, opts?: Partial<IStatePushOpts>): Promise<string>;
    stateRm(addresses: string[], opts?: Partial<IStateRmOpts>): Promise<string>;
    stateShow(address: string, opts?: Partial<IStateShowOpts>): Promise<string>;
    taint(name: string, opts?: Partial<ITaintOpts>): Promise<string>;
    validate(dir?: string, opts?: Partial<IValidateOpts>): Promise<string>;
    untaint(name: string, opts?: Partial<IUntaintOpts>): Promise<string>;
    workspaceList(): Promise<string>;
    workspaceSelect(name: string): Promise<string>;
    workspaceNew(name: string, opts?: Partial<IWorkspaceNewOpts>): Promise<string>;
    workspaceDelete(name: string, opts?: Partial<IWorkspaceDeleteOpts>): Promise<string>;
    workspaceShow(): Promise<string>;
}
export declare type Command = IApply | IDestroy | IFmt | IForceUnlock | IGet | IGraph | IImport | IInit | IOutput | IPlan | IProviders | IPush | IRefresh | IShow | IStateList | IStateMv | IStatePull | IStatePush | IStateRm | IStateShow | ITaint | IValidate | IUntaint | IWorkspaceList | IWorkspaceSelect | IWorkspaceNew | IWorkspaceDelete | IWorkspaceShow;
export interface IApply {
    command: "apply";
    args?: [string];
    opts?: Partial<IApplyOpts>;
}
export interface IApplyOpts {
    backup: string;
    lock: boolean;
    lockTimeout: string;
    autoApprove: null;
    parallelism: number;
    refresh: boolean;
    state: string;
    stateOut: string;
    target: string[];
    var: string[];
    varFile: string;
}
export declare const Apply: (dirOrPlan?: string | undefined, opts?: Partial<IApplyOpts> | undefined) => IApply;
export interface IDestroy {
    command: "destroy";
    args?: [string];
    opts?: Partial<IDestroyOpts>;
}
export interface IDestroyOpts {
    backup: string;
    lock: boolean;
    lockTimeout: string;
    autoApprove: null;
    parallelism: number;
    refresh: boolean;
    state: string;
    stateOut: string;
    target: string[];
    var: string[];
    varFile: string;
}
export declare const Destroy: (dir?: string | undefined, opts?: Partial<IDestroyOpts> | undefined) => IDestroy;
export interface IFmt {
    command: "fmt";
    args?: [string];
    opts?: Partial<IFmtOpts>;
}
export interface IFmtOpts {
    list: boolean;
    write: boolean;
    diff: boolean;
    check: boolean;
}
export declare const Fmt: (dir?: string | undefined, opts?: Partial<IFmtOpts> | undefined) => IFmt;
export interface IForceUnlock {
    command: "force-unlock";
    args: [string] | [string, string];
    opts?: Partial<IForceUnlockOpts>;
}
export interface IForceUnlockOpts {
    force: boolean;
}
export declare const ForceUnlock: (lockId: string, dir?: string | undefined, opts?: Partial<IForceUnlockOpts> | undefined) => IForceUnlock;
export interface IGet {
    command: "get";
    args?: [string];
    opts?: Partial<IGetOpts>;
}
export interface IGetOpts {
    update: null;
}
export declare const Get: (dir?: string | undefined, opts?: Partial<IGetOpts> | undefined) => IGet;
export interface IGraph {
    command: "graph";
    args?: [string];
    opts?: Partial<IGraphOpts>;
}
export interface IGraphOpts {
    drawCycles: null;
    type: "plan" | "plan-destroy" | "apply" | "legacy";
}
export declare const Graph: (dir?: string | undefined, opts?: Partial<IGraphOpts> | undefined) => IGraph;
export interface IImport {
    command: "import";
    args: [string, string];
    opts?: Partial<IImportOpts>;
}
export interface IImportOpts {
    backup: string;
    config: string;
    lock: boolean;
    lockTimeout: string;
    provider: string;
    state: string;
    stateOut: string;
    var: string[];
    varFile: string;
}
export declare const Import: (src: string, dest: string, opts?: Partial<IImportOpts> | undefined) => IImport;
export interface IInit {
    command: "init";
    args?: [string];
    opts?: Partial<IInitOpts>;
}
export interface IInitOpts {
    lock: boolean;
    lockTimeout: string;
    upgrade: null;
}
export declare const Init: (dir?: string | undefined, opts?: Partial<IInitOpts> | undefined) => IInit;
export interface IOutput {
    command: "output";
    args?: [string];
    opts?: Partial<IOutputOpts>;
}
export interface IOutputOpts {
    json: null;
    state: string;
    module: string;
}
export declare const Output: (name?: string | undefined, opts?: Partial<IOutputOpts> | undefined) => IOutput;
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
export declare const Plan: (dirOrPlan?: string | undefined, opts?: Partial<IPlanOpts> | undefined) => IPlan;
export interface IProviders {
    command: "providers";
    args?: [string];
    opts?: never;
}
export declare const Providers: (configPath?: string | undefined) => IProviders;
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
export declare const Push: (path?: string | undefined, opts?: Partial<IPushOpts> | undefined) => IPush;
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
export declare const Refresh: (dir?: string | undefined, opts?: Partial<IRefreshOpts> | undefined) => IRefresh;
export interface IShow {
    command: "show";
    args?: [string];
    opts?: Partial<IShowOpts>;
}
export interface IShowOpts {
    moduleDepth: number;
}
export declare const Show: (path?: string | undefined, opts?: Partial<IShowOpts> | undefined) => IShow;
export interface IStateList {
    command: "state list";
    args?: string[];
    opts?: Partial<IStateListOpts>;
}
export interface IStateListOpts {
    state: string;
}
export declare const StateList: (addresses?: string[] | undefined, opts?: Partial<IStateListOpts> | undefined) => IStateList;
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
export declare const StateMv: (src: string, dest: string, opts?: Partial<IStateMvOpts> | undefined) => IStateMv;
export interface IStatePull {
    command: "state pull";
    args?: never;
    opts?: never;
}
export declare const StatePull: () => IStatePull;
export interface IStatePush {
    command: "state push";
    args: [string];
    opts?: Partial<IStatePushOpts>;
}
export interface IStatePushOpts {
    force: boolean;
}
export declare const StatePush: (path: string, opts?: Partial<IStatePushOpts> | undefined) => IStatePush;
export interface IStateRm {
    command: "state rm";
    args: string[];
    opts?: Partial<IStateRmOpts>;
}
export interface IStateRmOpts {
    backup: string;
    state: string;
}
export declare const StateRm: (addresses: string[], opts?: Partial<IStateRmOpts> | undefined) => IStateRm;
export interface IStateShow {
    command: "state show";
    args: [string];
    opts?: Partial<IStateShowOpts>;
}
export interface IStateShowOpts {
    state: string;
}
export declare const StateShow: (address: string, opts?: Partial<IStateShowOpts> | undefined) => IStateShow;
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
export declare const Taint: (name: string, opts?: Partial<ITaintOpts> | undefined) => ITaint;
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
export declare const Validate: (dir?: string | undefined, opts?: Partial<IValidateOpts> | undefined) => IValidate;
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
export declare const Untaint: (name: string, opts?: Partial<IUntaintOpts> | undefined) => IUntaint;
export interface IWorkspaceList {
    command: "workspace list";
    args?: never;
    opts?: never;
}
export declare const WorkspaceList: () => IWorkspaceList;
export interface IWorkspaceSelect {
    command: "workspace select";
    args: [string];
    opts?: never;
}
export declare const WorkspaceSelect: (name: string) => IWorkspaceSelect;
export interface IWorkspaceNew {
    command: "workspace new";
    args: [string];
    opts?: Partial<IWorkspaceNewOpts>;
}
export interface IWorkspaceNewOpts {
    state: string;
}
export declare const WorkspaceNew: (name: string, opts?: Partial<IWorkspaceNewOpts> | undefined) => IWorkspaceNew;
export interface IWorkspaceDelete {
    command: "workspace delete";
    args: [string];
    opts?: Partial<IWorkspaceDeleteOpts>;
}
export interface IWorkspaceDeleteOpts {
    force: boolean;
}
export declare const WorkspaceDelete: (name: string, opts?: Partial<IWorkspaceDeleteOpts> | undefined) => IWorkspaceDelete;
export interface IWorkspaceShow {
    command: "workspace show";
    args?: never;
    opts?: never;
}
export declare const WorkspaceShow: () => IWorkspaceShow;
