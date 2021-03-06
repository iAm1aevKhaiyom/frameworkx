# Models

Model is a type / interface / class declaration for application domain objects.
Models are used in GraphQL and REST declarations as return types.

* [Define a Model](#define-a-model)
* [Property types](#property-types)
* [Enums](#enums)
* [Unions](#unions)
* [Model registration](#model-registration)
* [Inline models](#inline-models)
* [Documentation](#documentation)
* [Best practices](#best-practices)

## Define a Model

Models can be defined as `type`, `interface` or `class`.

Type example:

```typescript
type Post = {
  id: number
  title: string
  text: string
  isApproved: boolean
  createdAt: Date
}
```

Interface example:

```typescript
interface Post {
  id: number
  title: string
  text: string
  isApproved: boolean
  createdAt: Date
}
```

Class example:

```typescript
class Post {
  id!: number
  title!: string
  text!: string
  isApproved!: boolean
  createdAt!: Date
}
```

In GraphQL this declaration is the same as:

```graphql
type Post {
  id: Int!
  title: String!
  text: String!
  isApproved: Boolean!
  createdAt: Date!
}
```

## Property types

### Primitive types

There are 3 primitive TypeScript types you can use
for your model properties:

* `boolean` is mapped to GraphQL's `Boolean`
* `number` is mapped to GraphQL's `Int`
* `string` is mapped to GraphQL's `String`

### Default scalars

There are 5 default scalars that you can use for your model properties:

* `Float` is mapped to GraphQL's `Float`
* `BigInt` is mapped to GraphQL's `String`
* `Date` is mapped to GraphQL's `String`
* `Time` is mapped to GraphQL's `String`
* `DateTime` is mapped to GraphQL's `String`

### Arrays

It's possible to create an array from any property as simple as defining it as an array type:

```typescript
type Post = {
  categories: Category[]
}
```


### Nullable types

If you want to mark a type as GraphQL's `nullable` you just define 
a property type any of these ways:

```typescript
type Post = {
  property1: User | null
  property2: number | undefined
  property3: string | null | undefined
  property4?: Date
}
```

## Enums

You can define an enum the following way:

```typescript
enum StatusType {
  active = "active", 
  inactive = "inactive", 
  archieved = "archieved",
}
```

It's required to define every enum property a value equal to it's property name.

Framework also defines an enum for a string literal:

```typescript
type StatusType = "active" | "inactive" | "archieved"
```

In GraphQL both these types will be represented as:

```graphql
enum StatusType {
  active
  inactive
  archieved
}
```

## Unions

You can define union the following way:

```typescript
type SearchItem = Post | Photo | User
```

Every type used in the union must be a separately defined model.

Above union will be represented in GraphQL the following way:

```graphql
union StatusType = Post | Photo | User
```

## Model registration

All models you've defined should be registered in the [application declaration](application-declaration.md):

```typescript
import { createApp } from "@microframework/core"
import { Post } from "./model/Post"

export const App = createApp<{
  // ...
  models: {
    Post: Post
  }
  // ...
}>()
```

## Inline models

In most cases you would define a model as a separate type definition, 
but sometimes you may want to define it *inline*:

```typescript
import { createApp } from "@microframework/core"

export const App = createApp<{
  // ...
  models: {
    Post: {
      id: number
      title: string
      text: string
    }
  }
  // ...
}>()
```

This way you still have a GraphQL type generated, 
and you can create a resolver for this model.
However, you are limited in how you can use such type in your code.

What does make sense more is to inline nested models:


```typescript
export type Post = {
  id: number
  title: string
  text: string
  counters: {
    views: number
    likes: number
    dislikes: number
    comments: number
  }
}
```
```typescript
import { createApp } from "@microframework/core"
import { Post } from "./model/Post"

export const App = createApp<{
  // ...
  models: {
    Post: Post
  }
  // ...
}>()
```

From this example a new GraphQL type called `PostCountersModel` 
will be generated by a framework. 

You can also define a model directly in the query / mutation / subscription return type:

```typescript
export const App = createApp<{
  queries: {
    posts(): { id: number, title: string, text: string }[]
  }
}>()
```

## Documentation

Microframework will automatically pickup a JSDoc comments from your code
and put them into the GraphQL schema.

```typescript
/**
 * Post is a website blog post.
 */
export type Post = {
  /**
   * Post unique identifier.
   */
  id: number

  /**
   * Post title.
   */
  title: string

  /**
   * Post content.
   */
  text: string
}
```

You'll be able to see these descriptions in the GraphiQL / Playground,
in the documentation section.

It's also possible to use a `@deprecated` annotation to mark properties as *deprecated*.

```typescript
/**
 * Post is a website blog post.
 */
export type Post = {
  /**
   * Post unique identifier.
   */
  id: number

  /**
   * Post title.
   *
   * @deprecated
   */
  title: string

  /**
   * Post content.
   *
   * @deprecated Don't use it anymore.
   */
  text: string
}
```

## Best practices

### What is the best way to declare a model?  

It's not recommended to use `class` for model declaration, 
since the framework doesn't instantiate class instances 
it might confuse developers. 

It's recommended to use a `type` since it's an `inteface` on steroids - 
it allows to composite a complex types. 
`type` also used to declare unions and enum types, 
thus if you use `type` everywhere - you will have a more consistent code.

### What is the best practice for inline models?

Don't overuse them. Use them when your model is super simple and
declaring a separate type for it seems redundant.
If inline model size increases consider extracting it into a separate `type` definition. 