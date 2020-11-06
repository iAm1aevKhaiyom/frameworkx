import { createApp, ModelWithArgs } from "@microframework/core"

export const App = createApp<{
  models: {
    PostModel: PostModel
  }
  inputs: {
    PostInputInterface: PostInputInterface
  }
}>()

/**
 * Simple model for testing purposes.
 */
type PostModel = ModelWithArgs<PostType, any>

/**
 * Type for a PostModel.
 */
type PostType = {
  id: number
  name: string
}

/**
 * This way we are testing interface support.
 */
interface PostInputInterface {
  id: number
  name: string
}