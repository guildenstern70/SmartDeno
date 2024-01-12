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
    private kv: Deno.Kv | undefined;

    public static Create = async (logger: DyeLog): Promise<DenoKV> => {
        const me = new DenoKV(logger);
        me.kv = await Deno.openKv();
        return me;
    };

    private constructor(logger: DyeLog)
    {
        this.logger = logger;
    }

    async isReady(): Promise<boolean>
    {
        if (this.kv == null) this.kv = await Deno.openKv();
        return this.kv != null;
    }

    async getSingleUser(username: string): Promise<User|null>
    {
        if (this.kv == null) this.kv = await Deno.openKv();
        console.log("Looking for user " + username + " in Deno KV...");
        const user: Deno.KvEntryMaybe<User> = await this.kv.get(["users", username]);
        console.log("Retrieved user " + JSON.stringify(user.value));
        return user.value;
    }

    async getAllUsers(): Promise<User[]|null>
    {
        if (this.kv == null) this.kv = await Deno.openKv();
        const entries: Deno.KvListIterator<User> = this.kv.list({ prefix: ["users"] });
        if (entries.next == null) return null;
        const users: User[] = [];
        for await (const entry of entries) {
            users.push(entry.value as User);
        }
        return users;
    }

    async deleteUser(username: string)
    {
        if (this.kv == null) this.kv = await Deno.openKv();
        await this.kv.delete(["users", username]);
    }

    async createUser(username: string, password: string)
    {
        if (this.kv == null) this.kv = await Deno.openKv();
        await this.kv.set(["users", username], { username , password });
    }
}
