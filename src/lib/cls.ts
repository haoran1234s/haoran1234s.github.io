export const cls = (...names: Array<string | false | null | undefined>) => names.filter(Boolean).join(' ')
