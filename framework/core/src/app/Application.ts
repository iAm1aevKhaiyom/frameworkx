import {Connection} from "typeorm";
import {AggregateHelper, AggregateOptions} from "../aggregate";
import {ApplicationClient} from "../client";
import {ContextResolver} from "../context";
import {ModelEntity} from "../entity";
import {DefaultErrorHandler, ErrorHandler} from "../error-handler";
import {DefaultLogger, Logger} from "../logger";
import {ActionManager, DeclarationManager, InputManager, ModelManager} from "../manager";
import {GraphQLManager} from "../manager/GraphQLManager";
import {SubscriptionManager} from "../manager/SubscriptionManager";
import {Resolver} from "../types";
import {InputValidator, ModelValidator, Validator} from "../validation";
import {AnyApplicationOptions} from "./ApplicationOptions";
import {ApplicationProperties} from "./ApplicationProperties";
import {ApplicationServer} from "./ApplicationServer";
import {ActionMethod, CastedModel, Model} from "./ApplicationTypes";
import {DefaultNamingStrategy} from "./DefaultNamingStrategy";
import {ApplicationMetadata} from "../metadata/types";

/**
 * Represents any application type.
 */
export type AnyApplication = Application<any>

/**
 * Application is a root point of the framework.
 */
export class Application<Options extends AnyApplicationOptions> {

  /**
   * Application properties.
   */
  readonly properties: ApplicationProperties = {
    dataSource: undefined,
    namingStrategy: DefaultNamingStrategy,
    errorHandler: DefaultErrorHandler,
    logger: DefaultLogger,
    context: {},
    entities: [],
    declarationManagers: [],
    subscriptionManagers: [],
    modelManagers: [],
    actionManagers: [],
    inputManagers: [],
    resolvers: [],
    validationRules: [],
    actionMiddlewares: {},
    maxGeneratedConditionsDeepness: 5
  }

  /**
   * Application metadata.
   */
  readonly metadata: ApplicationMetadata = {
    name: "",
    actions: [],
    inputs: [],
    models: [],
    mutations: [],
    queries: [],
    subscriptions: [],
    selections: []
  }

  readonly graphql = new GraphQLManager<Options>(this.properties, this.metadata)

  /**
   * Application options.
   */
  readonly _options!: Options

  /**
   * Sets app metadata.
   */
  setMetadata(metadata: ApplicationMetadata) {
    this.metadata.name = metadata.name
    this.metadata.actions = metadata.actions
    this.metadata.queries = metadata.queries
    this.metadata.mutations = metadata.mutations
    this.metadata.inputs = metadata.inputs
    this.metadata.models = metadata.models
    this.metadata.selections = metadata.selections
  }

  /**
   * Setups a client to be used by client application.
   */
  setClient(client: ApplicationClient) {
    this.properties.client = client
    return this
  }

  /**
   * Sets a data source (orm connection) to be used by application.
   */
  setDataSource(connectionFactory: (entities: any[]) => Promise<Connection>) {
    this.properties.dataSourceFactory = connectionFactory
    return this
  }

  /**
   * Specifies if framework should automatically generate root queries and mutations for your models.
   */
  setGenerateModelRootQueries(enabled: boolean) {
    this.properties.generateModelRootQueries = enabled
    return this
  }

  /**
   * Sets a validator to be used by application for model and input validation.
   */
  setValidator(validator: Validator) {
    this.properties.validator = validator
    return this
  }

  /**
   * Sets resolvers used to resolve queries, mutations, subscriptions, actions and models.
   */
  setResolvers(resolvers: Resolver[] | { [key: string]: Resolver }) {
    if (resolvers instanceof Array) {
      this.properties.resolvers = resolvers
    } else {
      this.properties.resolvers = Object.keys(resolvers).map(key => resolvers[key])
    }
    return this
  }

  /**
   * Sets a database entities.
   */
  setEntities(entities: ModelEntity<any>[] | { [key: string]: ModelEntity<any> }) {
    if (entities instanceof Array) {
      this.properties.entities = entities
    } else {
      this.properties.entities = Object.keys(entities).map(key => entities[key])
    }
    // if (entities instanceof Array) {
    //   this.properties.entities = entities.map(entity => ModelEntity.copy(this.properties, this.metadata, entity))
    // } else {
    //   this.properties.entities = Object.keys(entities).map(key => {
    //     return ModelEntity.copy(this.properties, this.metadata, entities[key])
    //   })
    // }
    return this
  }

  /**
   * Sets validation rules.
   */
  setValidationRules(validationRules: (ModelValidator<any, any> | InputValidator<any, any>)[] | { [key: string]: (ModelValidator<any, any> | InputValidator<any, any>) }) {
    if (validationRules instanceof Array) {
      this.properties.validationRules = validationRules
    } else {
      this.properties.validationRules = Object.keys(validationRules).map(key => validationRules[key])
    }
    return this
  }

  /**
   * Sets a context.
   */
  setContext(context: ContextResolver<Options["context"]>) {
    this.properties.context = context
    return this
  }

  /**
   * Sets a logger to be used by application for logging events.
   */
  setLogger(logger: Logger) {
    this.properties.logger = logger
    return this
  }

  /**
   * Sets an error handler to be used by application for handling errors.
   */
  setErrorHandler(errorHandler: ErrorHandler) {
    this.properties.errorHandler = errorHandler
    return this
  }

  /**
   * Sets middlewares for given actions.
   */
  setActionMiddlewares(middlewares: { [key: string]: () => any[] }) {
    this.properties.actionMiddlewares = middlewares
    return this
  }

  /**
   * Bootstraps a server.
   */
  async bootstrap(serverImpl: ApplicationServer): Promise<void> {
    await serverImpl()
  }

  /**
   * Creates a context object.
   */
  context(context: ContextResolver<Options["context"]>): ContextResolver<Options["context"]> {
    return context
  }

  /**
   * Returns an action manager for a given defined query.
   */
  action<Key extends keyof Options["actions"]>(name: Key): ActionManager<Options["actions"][Key], Options["context"]> {
    // if (!this.options.actions)
    //   throw Errors.noActionsDefined()

    let manager = this.properties.actionManagers.find(manager => manager.name === name)
    if (!manager) {
      manager = new ActionManager(this.properties, this.metadata, name as string)
      this.properties.actionManagers.push(manager)
    }
    return manager
  }

  /**
   * Returns a declaration manager for a given defined query.
   */
  query<Key extends keyof Options["queries"]>(name: Key): DeclarationManager<Options, Options["queries"][Key]> {
    // if (!this.options.queries)
    //   throw Errors.noQueriesDefined()

    let manager = this.properties.declarationManagers.find(manager => {
      return manager.type === "query" && manager.name === name
    })
    if (!manager) {
      manager = new DeclarationManager(this.properties, "query", name as string)
      this.properties.declarationManagers.push(manager)
    }
    return manager
  }

  /**
   * Returns a declaration manager for a given defined mutation.
   */
  mutation<Key extends keyof Options["mutations"]>(name: Key): DeclarationManager<Options, Options["mutations"][Key]> {
    // if (!this.options.mutations)
    //   throw Errors.noMutationsDefined()

    let manager = this.properties.declarationManagers.find(manager => {
      return manager.type === "mutation" && manager.name === name
    })
    if (!manager) {
      manager = new DeclarationManager(this.properties, "mutation", name as string)
      this.properties.declarationManagers.push(manager)
    }
    return manager
  }

  /**
   * Returns a subscription manager for a given defined subscription.
   */
  subscription<Key extends keyof Options["subscriptions"]>(name: Key): SubscriptionManager<Options["subscriptions"][Key], Options["context"]> {
    // if (!this.options.subscriptions)
    //   throw Errors.noSubscriptionsDefined()

    let manager = this.properties.subscriptionManagers.find(manager => {
      return manager.name === name
    })
    if (!manager) {
      manager = new SubscriptionManager(this.properties, name as string)
      this.properties.subscriptionManagers.push(manager)
    }
    return manager
  }

  /**
   * Returns a model manager for a given defined model.
   */
  model<Key extends keyof Options["models"]>(name: Key): ModelManager<CastedModel<Options["models"][Key]>, Options["context"]> {
    // if (!this.options.models)
    //   throw Errors.noModelsDefined()

    // const model = this.options.models[name]
    let manager = this.properties.modelManagers.find(manager => {
      return manager.name === name
    })
    if (!manager) {
      manager = new ModelManager(this.properties, this.metadata, name as string)
      this.properties.modelManagers.push(manager)
    }
    return manager
  }

  /**
   * Returns an input manager for a given defined input.
   */
  input<Key extends keyof Options["inputs"]>(name: Key): InputManager<Options["inputs"][Key], Options["context"]> {
    // if (!this.options.inputs)
    //   throw Errors.noInputsDefined()

    // const input = this.options.inputs[name]
    let manager = this.properties.inputManagers.find(manager => {
      return manager.name === name
    })
    if (!manager) {
      manager = new InputManager(this.properties, name as string)
      this.properties.inputManagers.push(manager)
    }
    return manager
  }

  /**
   * Returns aggregation executor to perform aggregated queries.
   */
  aggregate<T extends AggregateOptions>(aggregateOptions: T): AggregateHelper<T> {
    return new AggregateHelper<T>(this.properties, aggregateOptions)
  }

  /**
   * Returns logger.
   */
  get logger() {
    return this.properties.logger
  }

  /**
   * Returns set of utility functions.
   */
  // get utils() {
  //   return new BlueprintValidator(this)
  // }

}
