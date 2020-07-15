import {
  AnyValidationRule,
  ListOfType,
  Logger,
  ResolverMetadata,
  Validator,
} from "@microframework/core"
import { CorsOptions } from "cors"
import { OptionsData } from "express-graphql"
import { PubSub } from "graphql-subscriptions"
import { ServerOptions } from "subscriptions-transport-ws"
import { Connection, ConnectionOptions, EntitySchema } from "typeorm"
import { ErrorHandler } from "../error-handler"
import { NamingStrategy } from "../naming-strategy"
import { RateLimitItemOptions, RateLimitOptions } from "../rate-limit"

/**
 * Properties held by ApplicationServer.
 */
export type ApplicationServerProperties = {
  /**
   * App file path.
   * Must point to .d.ts file in the javascript runtime.
   */
  readonly appPath: string

  /**
   * Express server options.
   */
  readonly webserver: {
    /**
     * Custom express server instance.
     * You can create and configure your own instance of express and framework will use it.
     * If not passed, default express server will be used.
     */
    readonly express?: any

    /**
     * Port on which to run express server.
     */
    readonly port: number

    /**
     * Should be set to true to enable cors.
     */
    readonly cors: boolean | CorsOptions

    /**
     * List of static directories to register in the Express server.
     */
    readonly staticDirs: {
      [route: string]: string
    }

    /**
     * List of registered app middlewares.
     */
    readonly middlewares: any[]

    /**
     * List of registered action middlewares.
     * This way you can setup middlewares per specific action.
     */
    readonly actionMiddleware: { [key: string]: any[] }
  }

  /**
   * Options to setup a GraphQL.
   */
  readonly graphql: {
    /**
     * Route on which to register a graphql requests.
     * If not set, default is "/graphql".
     */
    readonly route: string

    /**
     * Indicates if graphiQL should be enabled or not.
     */
    readonly graphiql: boolean

    /**
     * Indicates if playground should be enabled or not.
     */
    readonly playground?: boolean | string

    /**
     * Additional GraphQL options when GraphQL middleware is created.
     */
    readonly options?: Partial<OptionsData>
  }

  /**
   * Can be set to use websockets.
   */
  readonly websocket: {
    /**
     * Websocket host.
     * Defaults to "ws://localhost".
     */
    readonly host: string

    /**
     * Port on which to run websocket server.
     * Required parameter to enable websockets server.
     */
    readonly port?: number

    /**
     * Path on which to register a subscriptions websocket interface.
     * If not set, default is "/subscriptions".
     */
    readonly path: string

    /**
     * Additional websocket server options.
     */
    readonly options: Partial<ServerOptions>

    /**
     * PubSub to be used for subscriptions.
     */
    readonly pubSub?: PubSub

    /**
     * When a connected user doesn't respond in a given amount of time,
     * he will be disconnected from a websocket.
     * Server and client must exchange with "ping"/"pong" messages.
     *
     * @see https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
     */
    readonly disconnectTimeout?: number
  }

  /**
   * ORM data source (connection) used in the application.
   */
  readonly dataSource?:
    | Connection
    | ((options: Partial<ConnectionOptions>) => Promise<Connection>)

  /**
   * List of entities to use in connection.
   * If this property is set, they will be overridden in ORM.
   */
  readonly entities?: ListOfType<Function | string | EntitySchema>

  /**
   * List of registered resolvers.
   */
  readonly resolvers: ResolverMetadata[]

  /**
   * List of validation rules to apply.
   */
  readonly validationRules: AnyValidationRule[]

  /**
   * Strategy for naming special identifiers used in the framework.
   */
  readonly namingStrategy: NamingStrategy

  /**
   * Handling errors logic.
   */
  readonly errorHandler: ErrorHandler

  /**
   * Validation library to be used in the application.
   * If not specified, default validator will be used.
   */
  readonly validator: Validator

  /**
   * Logger to be used in the application.
   * If not specified, default logger will be used.
   */
  readonly logger: Logger

  /**
   * Indicates if framework should automatically generate root queries and mutations for your models.
   */
  readonly generateModelRootQueries: boolean

  /**
   * Maximal deepness for nested conditions of automatically generated queries.
   */
  readonly maxGeneratedConditionsDeepness: number

  /**
   * Rate limiting options.
   */
  readonly rateLimits?: RateLimitOptions<any>

  /**
   * Used to create a rate limiter instance.
   */
  readonly rateLimitConstructor?: (options: RateLimitItemOptions) => any
}