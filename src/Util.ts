export const voidResult = () => undefined
export const trim = (str: string): string => String.prototype.trim.apply(str)
export const isString = (str: any) => typeof str === "string"
export const isPresentString = (str: any): boolean =>
  isString(str) && /\S/.test(str)
