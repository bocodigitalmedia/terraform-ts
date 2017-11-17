import { trim, isPresentString } from './Util'

export const nothing = (str: string): void => { }
export const workspaceShow = trim
export const workspaceList = (str: string): string[] =>
    str.split("\n")
        .map(trim)
        .filter(isPresentString)
        .map(val => /^(\*\s+)?(.+)$/.exec(val)[2])

export const stateList = (str: string): string[] =>
    str.split("\n")
        .map(trim)
        .filter(isPresentString)

export const stateShow = (str: string): string[][] =>
    str.split("\n")
        .map(trim)
        .filter(isPresentString)
        .map(line => {
            const match = /^(\S+)\s+=\s*(.*)$/.exec(line)
            return [match[1], match[2]]
        })


export const statePull = JSON.parse