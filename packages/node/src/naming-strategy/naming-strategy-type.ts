import { GraphQLSchemaBuilderNamingStrategy } from "@microframework/graphql"

/**
 * Strategy on how to name a special identifiers.
 */
export type NamingStrategy = {
  /**
   * GraphQL schema generation naming strategy.
   */
  generatedGraphQLTypes: GraphQLSchemaBuilderNamingStrategy

  /**
   * Defines names of the generated entity models.
   */
  generatedEntityDeclarationNames: {
    one(modelName: string): string
    oneNotNull(modelName: string): string
    many(modelName: string): string
    count(modelName: string): string
    save(modelName: string): string
    remove(modelName: string): string
    observeOne(modelName: string): string
    observeMany(modelName: string): string
    observeCount(modelName: string): string
    observeInsert(modelName: string): string
    observeUpdate(modelName: string): string
    observeSave(modelName: string): string
    observeRemove(modelName: string): string
    observeOneTriggerName(modelName: string): string
    observeManyTriggerName(modelName: string): string
    observeCountTriggerName(modelName: string): string
    observeInsertTriggerName(modelName: string): string
    observeUpdateTriggerName(modelName: string): string
    observeSaveTriggerName(modelName: string): string
    observeRemoveTriggerName(modelName: string): string
  }

  /**
   * Defines descriptions of the generated model declarations.
   */
  generatedEntityDeclarationDescriptions: {
    one(modelName: string): string
    oneNotNull(modelName: string): string
    many(modelName: string): string
    count(modelName: string): string
    save(modelName: string): string
    remove(modelName: string): string
    observeOne(modelName: string): string
    observeMany(modelName: string): string
    observeCount(modelName: string): string
    observeInsert(modelName: string): string
    observeUpdate(modelName: string): string
    observeSave(modelName: string): string
    observeRemove(modelName: string): string
  }

  /**
   * Defines names of the "args" of the models.
   */
  generatedEntityDeclarationArgsInputs: {
    where(typeName: string): string
    save(typeName: string): string
    order(typeName: string): string
    whereRelation(typeName: string, relationName: string): string
    saveRelation(typeName: string, relationName: string): string
  }
}
