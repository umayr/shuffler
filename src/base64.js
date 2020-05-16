export const to = target => btoa(JSON.stringify(target))

export const from = src => JSON.parse(atob(src))
