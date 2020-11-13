import { parse } from "@microframework/parser"
import {
  buildGraphQLSchema,
  DefaultNamingStrategy,
} from "@microframework/graphql"
import { isNonNullType, isObjectType, isScalarType } from "graphql"

describe("graphql > schema builder", () => {
  test("mutations with intersection input and output types", () => {
    const appMetadata = parse(__dirname + "/mutations-intersections-app.ts")
    const schema = buildGraphQLSchema({
      assert: false,
      appMetadata: appMetadata,
      namingStrategy: DefaultNamingStrategy,
      resolveFactory: () => undefined,
      subscribeFactory: () => undefined,
    })
    if (!schema) fail("Schema built failed")

    // ------------------------------------------------

    // TODO: make checks after Umed's fixes
    fail()
  })
})