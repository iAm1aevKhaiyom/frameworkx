import {
  ActionTypeMetadata,
  ApplicationTypeMetadata,
  DeclarationTypes,
  TypeMetadata,
} from "@microframework/core"
import * as ts from "typescript"
import * as path from "path"
import { Errors } from "./errors"
import { ModelParser } from "./models-parser"
import { ParserUtils } from "./utils"

export function parse(appFileName: string): ApplicationTypeMetadata {
  // create a TypeScript program
  const program = ts.createProgram([appFileName], {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS,
  })
  const modelsAndInputs: string[] = []

  // -- local functions --

  function parseAppDefinition(appDefinition: ts.TypeLiteralNode) {
    return {
      actions: parseActions(appDefinition),
      models: parseModelsInputs("models", appDefinition),
      inputs: parseModelsInputs("inputs", appDefinition),
      queries: parseQueries(appDefinition),
      mutations: parseMutations(appDefinition),
      subscriptions: parseSubscriptions(appDefinition),
    }
  }

  function appDeclaration(
    type: DeclarationTypes,
    appDefinition: ts.TypeLiteralNode,
  ) {
    const declaration = ParserUtils.findTypeLiteralProperty(appDefinition, type)
    if (!declaration) return undefined

    // make sure signature is supported
    if (!declaration.type || !ts.isTypeLiteralNode(declaration.type))
      throw Errors.appItemInvalidSignature(type, declaration.type)

    // no members - not a problem, user can add them on demand
    if (!declaration.type.members.length) return undefined

    return declaration.type
  }

  function declarationPropertyNames(
    type: DeclarationTypes,
    appDefinition: ts.TypeLiteralNode,
  ): string[] {
    const declaration = ParserUtils.findTypeLiteralProperty(appDefinition, type)
    if (!declaration) return []

    // make sure signature is supported
    if (!declaration.type || !ts.isTypeLiteralNode(declaration.type))
      throw Errors.appItemInvalidSignature(type, declaration.type)

    // no members - not a problem, user can add them on demand
    if (!declaration.type.members.length) return []

    return declaration.type.members.map((member) => {
      if (!ts.isPropertySignature(member) || !ts.isIdentifier(member.name))
        throw new Error(`invalid property`)
      return member.name.text
    })
  }

  function parseActions(
    appDefinition: ts.TypeLiteralNode,
  ): ActionTypeMetadata[] {
    // extract "actions" out of application declaration
    const declaration = appDeclaration("actions", appDefinition)
    if (!declaration) return []

    // parse members
    const modelParser = new ModelParser(program, modelsAndInputs, 1)
    const actions = modelParser.parse(
      declaration,
      "",
      // false,
      "app.actions",
      // false,

      false,
    )
    return actions.properties.map((action) => {
      if (!action.propertyName)
        throw Errors.appDeclarationItemInvalidDefinition("actions")

      const returning = action.properties.find(
        (property) => property.propertyName === "return",
      )
      // if (!returning)
      //     throw new Error(`Returning was not found in the action ${action.propertyName}`)

      const query = action.properties.find(
        (property) => property.propertyName === "query",
      )
      const params = action.properties.find(
        (property) => property.propertyName === "params",
      )
      const headers = action.properties.find(
        (property) => property.propertyName === "headers",
      )
      const cookies = action.properties.find(
        (property) => property.propertyName === "cookies",
      )
      const body = action.properties.find(
        (property) => property.propertyName === "body",
      )

      return {
        "@type": "ActionTypeMetadata",
        name: action.propertyName,
        description: action.description,
        deprecated: !!action.deprecated,
        return: returning ? { ...returning, propertyName: "" } : undefined,
        query,
        params,
        headers,
        cookies,
        body,
      }
    })
  }

  /**
   * Parses "models" or "inputs" section of the app.
   */
  function parseModelsInputs(
    type: "models" | "inputs",
    appDefOptions: ts.TypeLiteralNode,
  ): TypeMetadata[] {
    // extract "models" / "inputs" out of application declaration
    // const declaration = appDeclaration(type, appDefOptions)
    // console.log("declaration", declaration)
    // if (!declaration) return []

    // parse members
    // const typeChecker = program.getTypeChecker()
    const modelParser = new ModelParser(program, modelsAndInputs, 2)

    const declaration2 = ParserUtils.findTypeLiteralProperty(
      appDefOptions,
      type,
    )
    if (!declaration2) return []

    const models = modelParser.parse(declaration2, "", `app`, false)
    // console.log("models", models)

    return models.properties

    // return models.properties.map((modelMetadata) => {
    //   console.log("modelMetadata", modelMetadata)
    //   // extract a model name and make sure its correct
    //   // if (!member.name) throw Errors.appDeclarationItemInvalidDefinition(type)
    //   // const memberName = member.name.getText()
    //   // if (!memberName || typeof memberName !== "string")
    //   //   throw Errors.appDeclarationItemInvalidDefinition(type)
    //
    //   // parse model metadata
    //   // const modelMetadata = modelParser.parse(
    //   //   member,
    //   //   "",
    //   //   false,
    //   //   `app.${type}`,
    //   //   false,
    //   // )
    //
    //   // if model is a ModelWithArgs, we just return things as they are
    //   // (at least for now, until all ModelWithArgs cases be covered)
    //   // if (modelMetadata.modelName) {
    //   //   // todo: make it's a good idea to introduce a flag inside modelMetadata
    //   //   //       instead of checking for a modelName here? (maybe we can use ".args"?)
    //   //   return modelMetadata
    //   // }
    //
    //   // if there is a "typeName" in the model, it means type was referenced to some type/class/interface/etc.
    //   // but if there's no type name, it most likely means a literal type was used
    //   // in this case, we'll use a memberName (model's "name" defined in { models: { [name]: { ... } } })
    //   // as a model typeName
    //   // if (!modelMetadata.typeName && modelMetadata.propertyName) {
    //   //   // const description = ParserUtils.getDescription(typeChecker, member)
    //   //   // const deprecated = ParserUtils.getDeprecation(member)
    //   //
    //   //   return {
    //   //     ...modelMetadata,
    //   //     typeName: modelMetadata.propertyName,
    //   //     // description,
    //   //     // deprecated,
    //   //   } as TypeMetadata
    //   // }
    //
    //   // otherwise if there is a "typeName" in the model, we need to make sure its name matches
    //   // the name defined as a memberName (model's "name" defined in { models: { [name]: TypeName } })
    //   // if they don't match, we just throw an error
    //   // if (modelMetadata.typeName !== modelMetadata.propertyName) {
    //   //   throw Errors.modelInputKeyNameAndTypeNameMismatch(
    //   //     type,
    //   //     modelMetadata.propertyName!,
    //   //     modelMetadata.typeName!,
    //   //   )
    //   // }
    //
    //   // modelsAndInputs.push(modelMetadata)
    //   return modelMetadata
    // })
  }

  // todo: use same approach as in "actions"
  function parseQueries(appDefOptions: ts.TypeLiteralNode): TypeMetadata[] {
    const declaration = ParserUtils.findTypeLiteralProperty(
      appDefOptions,
      "queries",
    )
    if (!declaration) return []

    const modelParser = new ModelParser(program, modelsAndInputs, 1)
    const type = modelParser.parse(declaration, "", "app.queries", false)
    // console.log(JSON.stringify(type, undefined, 2))
    return type.properties
  }

  function parseMutations(appDefOptions: ts.TypeLiteralNode): TypeMetadata[] {
    const modelsMember = ParserUtils.findTypeLiteralProperty(
      appDefOptions,
      "mutations",
    )

    if (!modelsMember) return []
    // throw Errors.appModelsInvalidSignature()

    const modelParser = new ModelParser(program, modelsAndInputs, 1)
    return modelParser.parse(modelsMember, "", "app.mutations", false)
      .properties
  }

  function parseSubscriptions(
    appDefOptions: ts.TypeLiteralNode,
  ): TypeMetadata[] {
    const modelsMember = ParserUtils.findTypeLiteralProperty(
      appDefOptions,
      "subscriptions",
    )

    if (!modelsMember) return []
    // throw Errors.appModelsInvalidSignature()

    const modelParser = new ModelParser(program, modelsAndInputs, 1)
    return modelParser.parse(
      modelsMember,
      "",
      // false,
      "app.subscriptions",
      // false,
      false,
    ).properties
  }

  // -- logic itself --

  // find a provided application source file
  const normalizedAppFileName = path.resolve(appFileName) // .replace(/\\/g, "/"))
  const appSourceFile = program.getSourceFiles().find((file) => {
    return path.resolve(file.fileName) === normalizedAppFileName
  })
  if (!appSourceFile) throw Errors.appFileInvalid(appFileName)

  // find all exported nodes from app file
  const exportedNodes = appSourceFile.statements.filter((statement) => {
    return (
      ParserUtils.isNodeExported(statement) && ts.isVariableStatement(statement)
    )
  })

  // validate app file content
  if (!exportedNodes.length) throw Errors.appFileExportMissing()

  if (exportedNodes.length > 1) throw Errors.appFileTooManyExports()

  const node = exportedNodes[0]
  if (!ts.isVariableStatement(node)) throw Errors.appFileNotTypeAlias()

  let appDefOptions: ts.Node | undefined = undefined // declaration.initializer.typeArguments[0]
  const declaration = node.declarationList.declarations[0]

  if (appSourceFile.isDeclarationFile === false) {
    if (!declaration.initializer) throw new Error("Invalid declarations[0]")

    if (!ts.isCallExpression(declaration.initializer))
      throw new Error("Invalid declaration.initializer")

    if (!ts.isIdentifier(declaration.initializer.expression))
      throw new Error("Invalid declaration.initializer.expression")

    if (declaration.initializer.expression.text !== "createApp")
      throw new Error("Invalid createApp")

    if (!declaration.initializer.typeArguments)
      throw new Error("Invalid typeArguments")

    if (declaration.initializer.typeArguments.length > 1)
      throw new Error("Invalid typeArguments")

    appDefOptions = declaration.initializer.typeArguments[0]
  } else {
    if (!declaration.type) throw new Error("Invalid declaration type")

    if (!ts.isImportTypeNode(declaration.type))
      throw new Error("Invalid declaration type import")

    if (!declaration.type.typeArguments)
      throw new Error("Invalid typeArguments")

    if (declaration.type.typeArguments.length > 1)
      throw new Error("Invalid typeArguments")

    appDefOptions = declaration.type.typeArguments[0]
  }

  if (!ts.isIdentifier(declaration.name))
    throw new Error("Invalid declaration.name")

  // todo: find a more reliable way to extract documentation
  let description = ""
  if (
    (node as any).jsDoc &&
    (node as any).jsDoc.length &&
    (node as any).jsDoc[0].comment
  ) {
    description = (node as any).jsDoc[0].comment
  }

  const result: ApplicationTypeMetadata = {
    "@type": "ApplicationTypeMetadata",
    name: declaration.name.text,
    description,
    actions: [],
    models: [],
    inputs: [],
    queries: [],
    mutations: [],
    subscriptions: [],
  }
  // first we collect all root input and model names
  if (ts.isIntersectionTypeNode(appDefOptions)) {
    appDefOptions.types.forEach((type) => {
      if (ts.isTypeLiteralNode(type)) {
        modelsAndInputs.push(...declarationPropertyNames("inputs", type))
        modelsAndInputs.push(...declarationPropertyNames("models", type))
      } else if (ts.isTypeReferenceNode(type)) {
        const referencedType = program.getTypeChecker().getTypeAtLocation(type)
        const symbol = referencedType.aliasSymbol || referencedType.symbol
        if (symbol && symbol.declarations[0]) {
          const declaration = symbol.declarations[0]
          if (ts.isTypeLiteralNode(declaration)) {
            modelsAndInputs.push(
              ...declarationPropertyNames("inputs", declaration),
            )
            modelsAndInputs.push(
              ...declarationPropertyNames("models", declaration),
            )
            return
          } else if (
            ts.isTypeAliasDeclaration(declaration) &&
            ts.isTypeLiteralNode(declaration.type)
          ) {
            modelsAndInputs.push(
              ...declarationPropertyNames("inputs", declaration.type),
            )
            modelsAndInputs.push(
              ...declarationPropertyNames("models", declaration.type),
            )
            return
          }
        }
      }
    })
  } else {
    if (!ts.isTypeLiteralNode(appDefOptions))
      throw Errors.appTypeInvalidArguments()

    modelsAndInputs.push(...declarationPropertyNames("inputs", appDefOptions))
    modelsAndInputs.push(...declarationPropertyNames("models", appDefOptions))
  }

  // next, parse all actions, models, inputs, queries, mutations, subscriptions
  if (ts.isIntersectionTypeNode(appDefOptions)) {
    appDefOptions.types.forEach((type) => {
      if (ts.isTypeLiteralNode(type)) {
        const r = parseAppDefinition(type)
        result.actions.push(...r.actions)
        result.models.push(...r.models)
        result.inputs.push(...r.inputs)
        result.queries.push(...r.queries)
        result.mutations.push(...r.mutations)
        result.subscriptions.push(...r.subscriptions)
        return
      } else if (ts.isTypeReferenceNode(type)) {
        const referencedType = program.getTypeChecker().getTypeAtLocation(type)
        const symbol = referencedType.aliasSymbol || referencedType.symbol

        if (symbol && symbol.declarations[0]) {
          const declaration = symbol.declarations[0]
          if (ts.isTypeLiteralNode(declaration)) {
            const r = parseAppDefinition(declaration)
            result.actions.push(...r.actions)
            result.models.push(...r.models)
            result.inputs.push(...r.inputs)
            result.queries.push(...r.queries)
            result.mutations.push(...r.mutations)
            result.subscriptions.push(...r.subscriptions)
            return
          } else if (
            ts.isTypeAliasDeclaration(declaration) &&
            ts.isTypeLiteralNode(declaration.type)
          ) {
            const r = parseAppDefinition(declaration.type)
            result.actions.push(...r.actions)
            result.models.push(...r.models)
            result.inputs.push(...r.inputs)
            result.queries.push(...r.queries)
            result.mutations.push(...r.mutations)
            result.subscriptions.push(...r.subscriptions)
            return
          }
        }
      }

      // console.log(type.kind)
      throw Errors.appTypeInvalidArguments()
    })
  } else {
    if (!ts.isTypeLiteralNode(appDefOptions))
      throw Errors.appTypeInvalidArguments()

    const r = parseAppDefinition(appDefOptions)
    result.actions.push(...r.actions)
    result.models.push(...r.models)
    result.inputs.push(...r.inputs)
    result.queries.push(...r.queries)
    result.mutations.push(...r.mutations)
    result.subscriptions.push(...r.subscriptions)
  }

  if (!ts.isIdentifier(declaration.name))
    throw new Error("Invalid declaration.name")

  // ----------------------------------------------------------------
  // Check if queries with the same name are defined more than once
  // ----------------------------------------------------------------

  const duplicatedQueries = result.queries
    .map((it) => it.propertyName!)
    .filter((e, i, a) => a.indexOf(e) !== i)
    .filter(onlyUnique)

  if (duplicatedQueries.length) {
    throw Errors.appQueriesDuplicate(duplicatedQueries)
  }

  // ----------------------------------------------------------------
  // Check if mutations with the same name are defined more than once
  // ----------------------------------------------------------------

  const duplicatedMutations = result.mutations
    .map((it) => it.propertyName!)
    .filter((e, i, a) => a.indexOf(e) !== i)
    .filter(onlyUnique)

  if (duplicatedMutations.length) {
    throw Errors.appMutationsDuplicate(duplicatedMutations)
  }

  // --------------------------------------------------------------------
  // Check if subscriptions with the same name are defined more than once
  // --------------------------------------------------------------------

  const duplicatedSubscriptions = result.subscriptions
    .map((it) => it.propertyName!)
    .filter((e, i, a) => a.indexOf(e) !== i)
    .filter(onlyUnique)

  if (duplicatedSubscriptions.length) {
    throw Errors.appSubscriptionsDuplicate(duplicatedSubscriptions)
  }

  const modelTypes = result.models
    .filter((it) => it.typeName)
    .map((it) => it.typeName!)

  // -----------------------------------------------------
  // Check if queries return types are defined in 'model'
  // -----------------------------------------------------

  // const queryReturnTypes = result.queries
  //   .filter((it) => it.typeName)
  //   .map((it) => it.typeName!)
  //   .filter(onlyUnique)
  //
  // const missingQueryReturnTypes = queryReturnTypes.filter(
  //   (it) => modelTypes.indexOf(it) === -1,
  // )
  //
  // if (missingQueryReturnTypes.length) {
  //   throw Errors.appMissingModelType("queries", missingQueryReturnTypes)
  // }

  // ------------------------------------------------------
  // Check if mutations return types are defined in 'model'
  // ------------------------------------------------------

  // const mutationReturnTypes = result.mutations
  //   .filter((it) => it.typeName)
  //   .map((it) => it.typeName!)
  //   .filter(onlyUnique)
  //
  // const missingMutationReturnTypes = mutationReturnTypes.filter(
  //   (it) => modelTypes.indexOf(it) === -1,
  // )
  //
  // if (missingMutationReturnTypes.length) {
  //   throw Errors.appMissingModelType("mutations", missingMutationReturnTypes)
  // }

  // ----------------------------------------------------------
  // Check if subscriptions return types are defined in 'model'
  // ----------------------------------------------------------

  // const subscriptionReturnTypes = result.subscriptions
  //   .filter((it) => it.typeName)
  //   .map((it) => it.typeName!)
  //   .filter(onlyUnique)
  //
  // const missingSubscriptionReturnTypes = subscriptionReturnTypes.filter(
  //   (it) => modelTypes.indexOf(it) === -1,
  // )
  //
  // if (missingSubscriptionReturnTypes.length) {
  //   throw Errors.appMissingModelType(
  //     "subscriptions",
  //     missingSubscriptionReturnTypes,
  //   )
  // }

  // ------------------------------------------------------
  // Check if actions return types are defined in 'model'
  // ------------------------------------------------------

  // const actionReturnTypes = result.actions
  //   .filter((it) => it.return && it.return.typeName)
  //   .map((it) => it.return!.typeName!)
  //   .filter(onlyUnique)
  //
  // const missingActionReturnTypes = actionReturnTypes.filter(
  //   (it) => modelTypes.indexOf(it) === -1,
  // )
  //
  // if (missingActionReturnTypes.length) {
  //   throw Errors.appMissingModelType("actions", missingActionReturnTypes)
  // }

  // ------------------------------------------------------
  // Check if queries input types are defined in 'input'
  // ------------------------------------------------------

  // const inputTypes = result.inputs
  //   .filter((it) => it.typeName)
  //   .map((it) => it.typeName!)
  //
  // const queryInputTypes = result.queries
  //   .filter((it) => it.args.length && it.args[0].typeName)
  //   .map((it) => it.args[0].typeName!)
  //   .filter(onlyUnique)
  //
  // const missingQueryInputTypes = queryInputTypes.filter(
  //   (it) => inputTypes.indexOf(it) === -1,
  // )
  //
  // if (missingQueryInputTypes.length) {
  //   throw Errors.appMissingInputType("queries", missingQueryInputTypes)
  // }

  // ------------------------------------------------------
  // Check if mutations input types are defined in 'input'
  // ------------------------------------------------------
  //
  // const mutationInputTypes = result.mutations
  //   .filter((it) => it.args.length && it.args[0].typeName)
  //   .map((it) => it.args[0].typeName!)
  //   .filter(onlyUnique)
  //
  // const missingMutationInputTypes = mutationInputTypes.filter(
  //   (it) => inputTypes.indexOf(it) === -1,
  // )
  //
  // if (missingMutationInputTypes.length) {
  //   throw Errors.appMissingInputType("mutations", missingMutationInputTypes)
  // }

  // ---------------------------------------------------------
  // Check if subscriptions input types are defined in 'app.inputs'
  // ---------------------------------------------------------

  // const subscriptionInputTypes = result.subscriptions
  //   .filter(
  //     (subscription) =>
  //       subscription.args.length && subscription.args[0].typeName,
  //   )
  //   .map((subscription) => subscription.args[0].typeName!)
  //   .filter(onlyUnique)
  //
  // const missingSubscriptionInputTypes = subscriptionInputTypes.filter(
  //   (subscriptionInputType) => inputTypes.indexOf(subscriptionInputType) === -1,
  // )
  //
  // if (missingSubscriptionInputTypes.length) {
  //   throw Errors.appMissingInputType(
  //     "subscriptions",
  //     missingSubscriptionInputTypes,
  //   )
  // }

  // console.log(JSON.stringify(result, undefined, 2))
  return result
}

function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index
}
