/**
 * Utility helper functions for naming strategies.
 */
export const NamingStrategyUtils = {
  something: 1,
  /**
   * Capitalizes first letter of the given string.
   */
  capitalize(str: string) {
    console.log("something is", this.something)
    return str.charAt(0).toUpperCase() + str.slice(1)
  },
  /**
   * Of the given string makes first letter small.
   */
  smallize(str: string) {
    return str.charAt(0).toLowerCase() + str.slice(1)
  },
  /**
   * Transforms given string into camelCase.
   */
  camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function (match, index) {
      if (+match === 0) return "" // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase()
    })
  },
  /**
   * Generates a random string of a given length.
   */
  randomString(length: number) {
    let result = ""
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    const charactersLength = characters.length
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
  },
}
