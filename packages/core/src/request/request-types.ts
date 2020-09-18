import {
  Action,
  AnyApplication,
  GraphQLDeclarationItem,
  GraphQLDeclarationList,
  ReturnTypeOptional,
} from "../application"

/**
 * Helper type for RequestSelectionSchema type.
 */
export declare type RequestSelectionSchemaMapItem<T> = NonNullable<
  T
> extends Array<infer U>
  ? NonNullable<U> extends string
    ? boolean
    : NonNullable<U> extends number
    ? boolean
    : NonNullable<U> extends boolean
    ? boolean
    : RequestSelectionSchemaMap<U>
  : NonNullable<T> extends Object
  ? RequestSelectionSchemaMap<T>
  : boolean

/**
 * Helper type for RequestSelectionSchema type.
 */
export declare type RequestSelectionSchemaMap<T> = {
  [P in keyof T]?: NonNullable<T[P]> extends string
    ? boolean
    : NonNullable<T[P]> extends number
    ? boolean
    : NonNullable<T[P]> extends boolean
    ? boolean
    : NonNullable<T[P]> extends Array<infer U>
    ? NonNullable<U> extends string
      ? boolean
      : NonNullable<U> extends number
      ? boolean
      : NonNullable<U> extends boolean
      ? boolean
      : RequestSelectionSchemaMapItem<U>
    : NonNullable<T[P]> extends Object
    ? RequestSelectionSchemaMapItem<T[P]>
    : boolean
}

/**
 * Request selection schema itself.
 * Selection schema defines what properties of a declaration item model will be selected.
 */
export type RequestSelectionSchema<
  Declaration extends GraphQLDeclarationItem
> = NonNullable<ReturnType<Declaration>> extends Array<infer U>
  ? RequestSelectionSchemaMap<U>
  : NonNullable<ReturnType<Declaration>> extends Object
  ? RequestSelectionSchemaMap<ReturnType<Declaration>>
  : never

/**
 * A particular query / mutation / subscription request properties.
 */
export type RequestGraphQLDeclarationItemOptions<
  Declaration extends GraphQLDeclarationItem,
  Selection extends RequestSelectionSchema<Declaration>
> = Parameters<Declaration> extends []
  ? ReturnType<Declaration> extends object
    ? {
        select: Selection
      }
    : undefined
  : Declaration extends (args: infer Args) => infer Return
  ? Return extends object
    ? {
        input: Args
        select: Selection
      }
    : {
        input: Args
      }
  : never

/**
 * A particular action request properties.
 */
export type RequestActionItemOptions<
  App extends AnyApplication,
  Declaration extends Action
> = {
  query: Action["query"] extends never ? never : Action["query"]
  params: Action["params"] extends never ? never : Action["params"]
  headers: Action["headers"] extends never ? never : Action["headers"]
  cookies: Action["cookies"] extends never ? never : Action["cookies"]
  body: Action["body"] extends never ? never : Action["body"]
}[keyof { query: true; params: true; headers: true; cookies: true; body: true }]

// todo: iterate over properties and exclude never, at the end exclude empty object

/**
 * Request properties for a particular action.
 */
export type RequestAction<
  App extends AnyApplication,
  Key extends keyof App["_options"]["actions"],
  Declaration extends App["_options"]["actions"][Key]
> = {
  selection: Selection
  model: App["_options"]["actions"][Key]["return"]
  type: "action"
  name: Key
  options: RequestActionItemOptions<App, Declaration>
}

/**
 * Helper type to represent request query / mutation / subscription.
 */
export type RequestMapItem<
  Declarations extends GraphQLDeclarationList,
  Key extends keyof Declarations,
  Selection extends RequestSelectionSchema<Declarations[Key]>
> = {
  selection: Selection
  model: ReturnTypeOptional<Declarations[Key]>
  type: "query" | "mutation" | "subscription"
  name: Key
  options: RequestGraphQLDeclarationItemOptions<Declarations[Key], Selection>
}

/**
 * Request map is different for action.
 */
export type RequestMapForAction = RequestAction<any, any, any>

/**
 * List of request items. Each request is a particular query / mutation / subscription.
 */
export type RequestMap = {
  [name: string]: RequestMapItem<any, any, any>
}

/**
 * Core request type.
 * Request is a named object with list of queries / mutations / subscriptions inside.
 */
export type Request<Map extends RequestMap | RequestMapForAction> = {
  typeof: "Request"
  name: string
  type?: "query" | "mutation" | "subscription" | "action"
  map: Map
}

/**
 * Helper type to mark non-selected properties as "never".
 */
export type RequestSelectionKeys<S> = {
  [P in keyof S]: S[P] extends false ? never : P
}[keyof S]

/**
 * Helper type to pick non-never properties of the selection.
 */
export type RequestSelectionPick<B, S> = Pick<
  B,
  { [P in keyof B]: P extends RequestSelectionKeys<S> ? P : never }[keyof B]
>

/**
 * Returns a subset of a model, new type is based on selection.
 */
export type RequestSelection<Model, Selection> = Model extends Array<infer U>
  ? RequestSelection<U, Selection>[]
  : Model extends object
  ? {
      [P in keyof RequestSelectionPick<
        Model,
        Selection
      >]: Model[P] extends Array<infer U>
        ? RequestSelection<U, Selection[P]>[]
        : Model[P]
    }
  : never

/**
 * Used to determine a ReturnType of a particular request's selection.
 */
export type RequestReturnType<
  T extends Request<any>,
  P extends keyof T["map"]
> = RequestMapItemReturnType<T["map"][P]>

/**
 * Types of the items from the RequestMap.
 */
export type RequestMapReturnType<
  T extends RequestMap | RequestMapForAction
> = T extends RequestMapForAction
  ? T["model"]
  : T extends RequestMap
  ? {
      [P in keyof T]: RequestMapItemReturnType<T[P]>
    }
  : never

/**
 * Type of the RequestMapItem.
 */
export type RequestMapItemReturnType<
  T extends RequestMapItem<any, any, any>
> = T["model"] extends Array<infer U>
  ? T["model"] extends null
    ? U extends number
      ? U[] | null
      : U extends string
      ? U[] | null
      : U extends boolean
      ? U[] | null
      : RequestSelection<U, T["selection"]>[] | null
    : U extends number
    ? U[]
    : U extends string
    ? U[]
    : U extends boolean
    ? U[]
    : RequestSelection<U, T["selection"]>[]
  : NonNullable<T["model"]> extends number
  ? T["model"]
  : NonNullable<T["model"]> extends string
  ? T["model"]
  : NonNullable<T["model"]> extends boolean
  ? T["model"]
  : T["model"] extends object | null
  ? RequestSelection<NonNullable<T["model"]>, T["selection"]> | null
  : RequestSelection<NonNullable<T["model"]>, T["selection"]>
