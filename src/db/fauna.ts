/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import { DyeLog } from "../deps.ts";
import User from "../service/user.ts";
import { IId, IidResponse, UserDump, UsersQuery } from "../service/types.ts";

export class FaunaDb
{
    constructor(logger: DyeLog)
    {
        this.logger = logger;
    }

    async getSingleUser(username: string): Promise<User>
    {
        const users: User[] = await this.getAllUsers();
        if (users.length > 0)
        {
            return users.filter( (user: User) => user.username === username)
        }
        return null;
    }

    async getAllUsers(): Promise<User[]>
    {
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
        if (response.error)
        {
            this.logger.error("Fauna DB error: " + JSON.stringify(response.error));
            return response.error;
        }

        return response.data.allUsers.data;
    }

    async deleteUser(id: int): string
    {
        // Find _id of user
        const allIds = `
                query {
                  allUsers {
                    data {
                      _id
                      id
                    }
                  }
                }`;
        const userids: IidResponse = await this.queryFauna(allIds, {});
        const iids: IId[] = userids.data.allUsers.data;
        const _ids: IId[] = iids.filter( (x: IId) => x.id == id);
        if (_ids.length > 0) {
            this.logger.info("_ID of #" + id + " is " + _ids[0]._id);
        } else {
            this.logger.info("User #"+ id + " not found.");
            return null;
        }
        const _idToBeDeleted = _ids[0]._id;
        const deleteQuery = `   
                mutation {
                  deleteUser(id: ${_idToBeDeleted}) {
                    username
                  }
                }
                `;
        await this.queryFauna(deleteQuery, {});
        return _idToBeDeleted;
    }

    async createUser(username: string,
                     password: string): Promise<UserDump>
    {
        const id = Math.floor(Math.random() * 1000000);

        // We store the password in clear text. In production environment passwords should
        // be masked using, for instance, SHA-256 algorithm.
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

