import { RequestReturnType } from "@microframework/core"
import { App } from "../app/App"

export const PostListRequest = App.request("PostList", {
  myPosts: App.query("posts", {
    input: {
      limit: 1,
      offset: 0,
    },
    select: {
      id: true,
    },
  }),
  firstCategory: App.query("category", {
    input: {
      id: 1,
    },
    select: {
      id: true,
      posts: {
        id: true,
      },
    },
  }),
  currentUser: App.query("currentUser", {
    select: {
      id: true,
    },
  }),
  removePost: App.mutation("postRemove", {
    input: {
      id: 1,
    },
  }),
})

export type PostListType = RequestReturnType<
  typeof PostListRequest,
  "firstCategory"
>
