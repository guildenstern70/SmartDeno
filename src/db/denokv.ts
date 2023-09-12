/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import { DyeLog } from "dyelog";
import { User } from "../model/types.ts";


export class DenoKV
{
    private readonly logger: DyeLog;

    constructor(logger: DyeLog)
    {
        this.logger = logger;
    }

    async getSingleUser(username: string): Promise<User|null>
    {
        const kv = await Deno.openKv();
        console.log("Looking for user " + username + " in Deno KV...");
        const user: Deno.KvEntryMaybe<User> = await kv.get(["users", username]);
        console.log("Retrieved user " + JSON.stringify(user.value));
        return user.value;
    }

    async getAllUsers(): Promise<User[]|null>
    {
        return null;
    }

    async deleteUser(username: string): Promise<string|null>
    {
        return null;
    }

    async createUser(user: User)
    {
        return null;
    }
}
