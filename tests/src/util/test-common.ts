export function obtainPort(): Promise<number> {
  const fp = require("find-free-port")
  return new Promise<number>((ok, fail) => {
    const min = 10000
    const max = 50000
    const random = Math.round(Math.random() * (max - min) + min)
    fp(random, random + 1, function (err: any, freePort: number) {
      if (err) {
        fp(min, max, function (err: any, freePort: number) {
          if (err) return fail(err)
          ok(freePort)
        })
      } else {
        ok(freePort)
      }
    })
  })
}

export function sleep(ms: number): Promise<void> {
  return new Promise((ok) => {
    setTimeout(() => {
      ok()
    }, ms)
  })
}

export function getRealTypes(types: string[]): string[] {
  const excluded = [
    "Int",
    "BigInt",
    "String",
    "Boolean",
    "Model",
    "Input",
    "Query",
    "Mutation",
    "Subscription",
  ]
  return types.filter((type) => {
    return excluded.indexOf(type) === -1 && type.indexOf("__") === -1
  })
}
