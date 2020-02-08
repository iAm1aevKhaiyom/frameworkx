import gql from 'graphql-tag';
import { GraphqlFetcher } from "../util/graphql-fetcher";
import { obtainPort } from "../util/port-generator";
import { App } from "./app";
import { PostClassActionResolver } from "./resolver/PostClassActionResolver";
import { PostContextResolver } from "./resolver/PostContextResolver";
import {
    PostItemFnDeclarationResolver,
    PostsItemFnDeclarationResolver
} from "./resolver/PostDeclarationItemsResolver";
import { PostDeclarationWithContextResolver } from "./resolver/PostDeclarationWithContextResolver";
import { PostDLDecoratorModelResolver } from "./resolver/PostDLDecoratorModelResolver";
import { PostObjectActionDeclarationResolver } from "./resolver/PostObjectActionDeclarationResolver";
import { PostObjectDLModelResolver } from "./resolver/PostObjectDLModelResolver";
import { PostObjectFnDeclarationResolver } from "./resolver/PostObjectFnDeclarationResolver";
import { PostObjectModelResolver } from "./resolver/PostObjectModelResolver";
import { PostObjectRawDeclarationResolver } from "./resolver/PostObjectRawDeclarationResolver";
import { PostSimpleDecoratorDeclarationResolver } from "./resolver/PostSimpleDecoratorDeclarationResolver";
import { PostSimpleDecoratorModelResolver } from "./resolver/PostSimpleDecoratorModelResolver";
import { AppServer } from "./server";

const fetch = require('node-fetch');

describe("resolvers", () => {

    test("simple decorator resolvers for declarations and models", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.bootstrap(AppServer(port, [
            PostSimpleDecoratorModelResolver,
            PostSimpleDecoratorDeclarationResolver,
        ]))

        const query = gql`
            query {
                posts {
                    id
                    title
                    status
                }
            }
        `

        const result = await fetcher.fetch(query)
        expect(result).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                        "status": "draft"
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                        "status": "draft"
                    }
                ]
            }
        })

        await App.stop()
    })

    test("decorator resolvers for declarations and models with data loader applied", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.bootstrap(AppServer(port, [
            PostDLDecoratorModelResolver,
            PostSimpleDecoratorDeclarationResolver,
        ]))

        const query = gql`
            query {
                posts {
                    id
                    title
                    status
                }
            }
        `

        const result = await fetcher.fetch(query)
        expect(result).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                        "status": "draft"
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                        "status": "draft"
                    }
                ]
            }
        })

        await App.stop()
    })

    test("function resolvers for query and mutation declaration items", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.bootstrap(AppServer(port, [
            PostItemFnDeclarationResolver,
            PostsItemFnDeclarationResolver,
        ]))

        const result1 = await fetcher.fetch(gql`
            query {
                posts {
                    id
                    title
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                    }
                ]
            }
        })

        const result2 = await fetcher.fetch(gql`
            query {
                post(id: 777) {
                    id
                    title
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "post": {
                    "id": 777,
                    "title": "Post #777",
                }
            }
        })

        await App.stop()
    })

    test("object resolver using resolver function for declarations", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.bootstrap(AppServer(port, [
            PostObjectFnDeclarationResolver,
        ]))

        const result1 = await fetcher.fetch(gql`
            query {
                posts {
                    id
                    title
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                    }
                ]
            }
        })

        const result2 = await fetcher.fetch(gql`
            query {
                post(id: 777) {
                    id
                    title
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "post": {
                    "id": 777,
                    "title": "Post #777",
                }
            }
        })

        await App.stop()
    })

    test("object resolver without function for declarations", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.bootstrap(AppServer(port, [
            PostObjectModelResolver,
            PostObjectRawDeclarationResolver,
        ]))

        const result1 = await fetcher.fetch(gql`
            query {
                posts {
                    id
                    title
                    status
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                        "status": "draft",
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                        "status": "draft",
                    }
                ]
            }
        })

        const result2 = await fetcher.fetch(gql`
            query {
                post(id: 777) {
                    id
                    title
                    status
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "post": {
                    "id": 777,
                    "title": "Post #777",
                    "status": "draft",
                }
            }
        })

        await App.stop()
    })

    test("object resolver for model with data loader", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.bootstrap(AppServer(port, [
            PostObjectDLModelResolver,
            PostObjectRawDeclarationResolver,
        ]))

        const result1 = await fetcher.fetch(gql`
            query {
                posts {
                    id
                    title
                    status
                }
            }
        `)
        expect(result1).toEqual({
            "data": {
                "posts": [
                    {
                        "id": 1,
                        "title": "Post #1",
                        "status": "draft",
                    },
                    {
                        "id": 2,
                        "title": "Post #2",
                        "status": "draft",
                    }
                ]
            }
        })

        const result2 = await fetcher.fetch(gql`
            query {
                post(id: 777) {
                    id
                    title
                    status
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "post": {
                    "id": 777,
                    "title": "Post #777",
                    "status": "draft",
                }
            }
        })

        await App.stop()
    })

    test("class action resolver", async () => {
        const port = await obtainPort()

        await App.bootstrap(AppServer(port, [
            PostClassActionResolver,
        ]))

        const response1 = await fetch(`http://localhost:${port}/posts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const result1 = await response1.json()

        expect(result1).toEqual([
            {
                "id": 1,
                "title": "Post #1",
                "status": "draft",
            },
            {
                "id": 2,
                "title": "Post #2",
                "status": "draft",
            }
        ])

        const response2 = await fetch(`http://localhost:${port}/post/777`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const result2 = await response2.json()
        expect(result2).toEqual({
            "id": "777",
            "title": "Post #777",
            "status": "draft",
        })

        await App.stop()
    })

    test("object action resolver", async () => {
        const port = await obtainPort()

        await App.bootstrap(AppServer(port, [
            PostObjectActionDeclarationResolver,
        ]))

        const response1 = await fetch(`http://localhost:${port}/posts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const result1 = await response1.json()

        expect(result1).toEqual([
            {
                "id": 1,
                "title": "Post #1",
                "status": "draft",
            },
            {
                "id": 2,
                "title": "Post #2",
                "status": "draft",
            }
        ])

        const response2 = await fetch(`http://localhost:${port}/post/777`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        })
        const result2 = await response2.json()
        expect(result2).toEqual({
            "id": "777", // todo: this should be a number!
            "title": "Post #777",
            "status": "draft",
        })

        await App.stop()
    })

    test("context resolver", async () => {
        const port = await obtainPort()
        const fetcher = new GraphqlFetcher(`http://localhost:${port}/graphql`)

        await App.bootstrap(AppServer(port, [
            PostDeclarationWithContextResolver,
            PostContextResolver,
        ]))

        const result2 = await fetcher.fetch(gql`
            query {
                postFromSession {
                    id
                    title
                    status
                }
            }
        `)
        expect(result2).toEqual({
            "data": {
                "postFromSession": {
                    "id": 0,
                    "title": "I am Session Post resolved by a context",
                    "status": "published" as const
                }
            }
        })


        await App.stop()
    })

})