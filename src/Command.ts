import { isPresentString } from './Util'

export interface Command {
  name: string
  opts?: any
  args?: string[]
}

export function optsToArray(opts?: Command["opts"]): string[] {
  if (opts == null) return []

  return Object.keys(opts)
    .map(key => optToString(key, opts[key]))
    .filter(isPresentString)
    .concat(["-no-color"])
}

export function normalizeKey(key: string): string {
  return key.replace(/([A-Z])/, "-$1").toLowerCase()
}

export function optToString(key: string, value: string | boolean | null | number | string[]): string {
  const nkey = `-${normalizeKey(key)}`

  if (value === null) {
    return nkey
  }
  if (Array.isArray(value)) {
    return value.map(val => `${nkey}=${val}`).join(" ")
  }
  else {
    return `${nkey}=${value}`
  }
}

export function argsToArray(args?: Command["args"]): string[] {
  if (args == null) return []
  return args.filter(isPresentString)
}

export function toArray({ name, opts, args }: Command): string[] {
  return name.split(/\s+/).concat(optsToArray(opts)).concat(argsToArray(args))
}

// Workspace

export const WorkspaceList = (): Command => ({
  name: "workspace list"
})

export const WorkspaceSelect = (name: string): Command => ({
  name: "workspace select",
  args: [name]
})

export const WorkspaceDelete = (name: string): Command => ({
  name: "workspace delete",
  args: [name]
})

export const WorkspaceShow = (): Command => ({
  name: "workspace show"
})

export const WorkspaceNew = (name: string): Command => ({
  name: "workspace new",
  args: [name]
})

// State

export const StateList = (opts?: { state: string }): Command => ({
  name: "state list",
  opts
})

export const StateShow = (address: string, opts?: { state: string }): Command => ({
  name: "state show",
  args: [address],
  opts
})

interface StateMvOpts { backup: string, backupOut: string, state: string, stateOut: string }
export const StateMv = (src: string, dest: string, opts?: Partial<StateMvOpts>): Command => ({
  name: "state mv",
  args: [src, dest],
  opts
})

export const StatePush = (path: string, opts?: { force: boolean }): Command => ({
  name: "state push",
  args: [path],
  opts
})

export const StatePull = (): Command => ({
  name: "state pull",
})


export interface StateRmOpts { backup: string, state: string }

export const StateRm = (address: string | string[], opts?: Partial<StateRmOpts>): Command => ({
  name: "state rm",
  args: typeof address === "string" ? [address] : address,
  opts
})

// Rest
export interface ApplyOpts {
  backup: string
  lock: boolean
  lockTimeout: number
  // input: boolean
  autoApprove: null
  parallelism: number
  refresh: boolean
  state: string
  stateOut: string
  target: string
  var: string[]
  varFile: string
}

export const Apply = (dirOrPlan?: string, opts?: Partial<ApplyOpts>): Command => ({
  name: "apply",
  args: [dirOrPlan],
  opts: Object.assign({ input: false }, opts)
})


export type DestroyOpts = ApplyOpts

export const Destroy = (dir?: string, opts?: Partial<DestroyOpts>): Command => ({
  name: "destroy",
  args: [dir],
  opts
})


export interface GetOpts { update: null }
export const Get = (dir: string, opts?: Partial<GetOpts>): Command => ({
  name: "get",
  args: [dir],
  opts
})


export interface ImportOpts {
  backup: string
  config: string
  // input: boolean
  lock: boolean
  lockTimeout: number
  provider: string
  state: string
  stateOut: string
  var: string[]
  varFile: string
}

export const Import = (address: string, id: string, opts?: Partial<ImportOpts>): Command => ({
  name: "import",
  args: [address, id],
  opts: Object.assign({ input: false }, opts)
})


export interface InitOpts {
  // input: boolean
  lock: boolean
  lockTimeout: string
  upgrade: null
}

export const Init = (dir?: string, opts?: Partial<InitOpts>): Command => ({
  name: "init",
  args: [dir],
  opts: Object.assign({ input: false }, opts)
})


export interface OutputOpts {
  json: null,
  state: string,
  module: string
}

export const Output = (name?: string, opts?: Partial<OutputOpts>): Command => ({
  name: "output",
  args: [name],
  opts
})


export interface PlanOpts {
  destroy: boolean
  detailedExitCode: null
  // input: boolean
  lock: boolean
  lockTimeout: string
  moduleDepth: number
  out: string
  parallelism: number
  refresh: boolean
  state: string
  var: string[]
  varFile: string
}

export const Plan = (dirOrPlan?: string, opts?: Partial<PlanOpts>): Command => ({
  name: "plan",
  args: [dirOrPlan],
  opts: Object.assign({ input: false }, opts)
})


export const Providers = (configPath?: string): Command => ({
  name: "providers",
  args: [configPath]
})


export interface RefreshOpts {
  backup: string
  // input: boolean
  lock: boolean
  lockTimeout: string
  state: string
  stateOut: string
  target: string[]
  var: string[]
  varFile: string
}

export const Refresh = (dir?: string, opts?: Partial<RefreshOpts>): Command => ({
  name: "refresh",
  args: [dir],
  opts: Object.assign({ input: false }, opts)
})


export interface ShowOpts {
  moduleDepth: number
}

export const Show = (path?: string, opts?: Partial<ShowOpts>): Command => ({
  name: "show",
  args: [path],
  opts
})


export interface TaintOpts {
  allowMissing: null
  backup: string
  lock: boolean
  lockTimeout: string
  module: string
  state: string
  stateOut: string
}

export const Taint = (name: string, opts?: Partial<TaintOpts>): Command => ({
  name: "taint",
  args: [name],
  opts
})


export interface UntaintOpts {
  allowMissing: null
  backup: string
  index: number
  lock: boolean
  lockTimeout: string
  module: string
  state: string
  stateOut: string
}

export const Untaint = (name: string, opts?: Partial<UntaintOpts>): Command => ({
  name: "untaint",
  args: [name],
  opts
})
