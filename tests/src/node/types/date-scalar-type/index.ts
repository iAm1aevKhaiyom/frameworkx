import { ApplicationServer } from "@microframework/node"
import gql from "graphql-tag"
import { obtainPort } from "../../../util/test-common"
import { TestFetcher } from "../../../util/test-fetcher"
import { AppServer } from "./server"

describe("node > types > dates", () => {
  let server: ApplicationServer<any> | undefined = undefined
  let fetcher: TestFetcher | undefined = undefined

  beforeEach(async () => {
    const port = await obtainPort()
    fetcher = new TestFetcher(`http://localhost:${port}/graphql`)
    server = await AppServer(port).start()
  })

  afterEach(async () => {
    if (server) {
      await server.stop()
    }
  })

  test("date types in returned values", async () => {
    const result1 = await fetcher!.graphql(gql`
      query {
        post(id: 1) {
          id
          title
          lastDate
          lastTime
          createdAt
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        post: {
          id: 1,
          title: "Hello",
          lastDate: "2020-07-01",
          lastTime: "03:00:00.000Z",
          createdAt: "2020-07-01T03:00:00.000Z",
        },
      },
    })
  })

  test("date types in inputs", async () => {
    const result1 = await fetcher!.graphql(gql`
      mutation {
        postCreate(
          title: "Hello World"
          lastDate: "2020-07-01"
          lastTime: "03:00:00.000Z"
          createdAt: "2020-07-01T03:00:00.000Z"
        ) {
          id
          title
          lastDate
          lastTime
          createdAt
        }
      }
    `)
    expect(result1).toEqual({
      data: {
        postCreate: {
          id: 1,
          title: "Hello World",
          lastDate: "2020-07-01",
          lastTime: "03:00:00.000Z",
          createdAt: "2020-07-01T03:00:00.000Z",
        },
      },
    })
  })
})