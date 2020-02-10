import { AnyValidationRule, ListOfType, Logger, ResolverMetadata, Validator } from "@microframework/core";
import { HandleFunction } from "connect"
import { CorsOptions } from "cors";
import { OptionsResult } from "express-graphql";
import { PubSub } from "graphql-subscriptions";
import { ServerOptions } from "subscriptions-transport-ws";
import { Connection, ConnectionOptions, EntitySchema } from "typeorm";
import { ErrorHandler } from "./error-handler";
import { NamingStrategy } from "./naming-strategy/NamingStrategy";

/**
 * Properties held by ApplicationServer.
 */
export type ApplicationServerProperties = {

    /**
     * App file path.
     */
    appPath: string

    /**
     * Custom express server instance.
     * You can create and configure your own instance of express and framework will use it.
     * If not passed, default express server will be used.
     */
    express?: any

    /**
     * Port on which to run express server.
     */
    port: number

    /**
     * Should be set to true to enable cors.
     */
    cors: boolean | CorsOptions

    /**
     * List of static directories to register in the Express server.
     */
    staticDirs: {
        [route: string]: string
    }

    /**
     * List of registered app middlewares.
     */
    middlewares: HandleFunction[]

    /**
     * List of registered action middlewares.
     * This way you can setup middlewares per specific action.
     */
    actionMiddlewares: { [key: string]: HandleFunction[] }

    /**
     * Options to setup a GraphQL.
     */
    graphql: {

        /**
         * Route on which to register a graphql requests.
         * If not set, default is "/graphql".
         */
        route: string

        /**
         * Indicates if graphiQL should be enabled or not.
         */
        graphiql: boolean

        /**
         * Indicates if playground should be enabled or not.
         */
        playground: boolean

        /**
         * Additional GraphQL options when GraphQL middleware is created.
         */
        options?: OptionsResult
    }

    /**
     * Can be set to use websockets.
     */
    websocket: {

        /**
         * Websocket host.
         * Defaults to "ws://localhost".
         */
        host: string

        /**
         * Port on which to run websocket server.
         * Required parameter to enable websockets server.
         */
        port?: number

        /**
         * Path on which to register a subscriptions websocket interface.
         * If not set, default is "/subscriptions".
         */
        path: string

        /**
         * Additional websocket server options.
         */
        options: Partial<ServerOptions>

        /**
         * PubSub to be used for subscriptions.
         */
        pubSub?: PubSub
    }

    /**
     * Callback that creates ORM data source.
     */
    dataSourceFactory?: (options: Partial<ConnectionOptions>) => Promise<Connection>

    /**
     * List of entities to use in connection.
     * If this property is set, they will be overridden in ORM.
     */
    entities?: ListOfType<Function|string|EntitySchema>

    /**
     * Strategy for naming special identifiers used in the framework.
     */
    namingStrategy: NamingStrategy

    /**
     * Handling errors logic.
     */
    errorHandler: ErrorHandler

    /**
     * List of registered resolvers.
     */
    resolvers: ResolverMetadata[]

    /**
     * List of validation rules to apply.
     */
    validationRules: AnyValidationRule[]

    /**
     * Indicates if framework should automatically generate root queries and mutations for your models.
     */
    generateModelRootQueries: boolean

    /**
     * Maximal deepness for nested conditions of automatically generated queries.
     */
    maxGeneratedConditionsDeepness: number

    /**
     * Validation library to be used in the application.
     * If not specified, default validator will be used.
     */
    validator: Validator

    /**
     * Logger to be used in the application.
     * If not specified, default logger will be used.
     */
    logger: Logger

    /**
     * ORM data source (connection) used in the application.
     */
    dataSource?: Connection

}