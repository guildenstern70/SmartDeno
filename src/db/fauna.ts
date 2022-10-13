/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */
// deno-lint-ignore-file no-explicit-any

import { DyeLog } from "../deps.ts";
import User from "../service/user.ts";
import { UserDump, UsersQuery } from "../service/types.ts";

export class FaunaDb
{
    constructor(logger: DyeLog)
    {
        this.logger = logger;
    }

    async getAllUsers(): Promise<User[]> {
        const query = `
                query {
                  allUsers {
                    data {
                      id
                      username
                      password
                    }
                  }
                }`;

        const response: UsersQuery = await this.queryFauna(query, {});
        if (response.error) {
            this.logger.error("Fauna DB error: " + JSON.stringify(response.error));
            return response.error;
        }

        return response.data.allUsers.data;
    }

    async createUser(id: number,
                     username: string,
                     password: string): Promise<UserDump>
    {

        const query = `
            mutation($username: String!, 
                     $password: String!, 
                     $id: Int!) {
                createUser(data: { username: $username, password: $password, id: $id }) {
                    username
                    password
                    id
                }
            }`;

        this.logger.info("Querying Fauna...");
        const {data, error} = await this.queryFauna(query, {username, password, id});
        this.logger.info("Fauna returned => " + JSON.stringify(data));

        if (error)
        {
            this.logger.error("Fauna DB error: " + JSON.stringify(error));
            return {error};
        }

        return data;
    }

    async queryFauna(
        query: string,
        variables: { [key: string]: unknown },
    ): Promise<{
        data?: any;
        error?: any;
    }>
    {
        const token = Deno.env.get("FAUNA_SECRET");
        if (!token)
        {
            this.logger.error("Fauna DB error: environment variable FAUNA_SECRET not set");
            throw new Error("environment variable FAUNA_SECRET not set");
        }

        try
        {
            const res = await fetch("https://graphql.eu.fauna.com/graphql", {
                method: "POST",
                headers: {
                    authorization: `Bearer ${token}`,
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    query,
                    variables,
                }),
            });

            const {data, errors} = await res.json();
            if (errors)
            {
                return {data, error: errors[0]};
            }

            return {data};
        }
        catch (error)
        {
            this.logger.error("Fauna DB error: " + error);
            return {error};
        }
    }
}

