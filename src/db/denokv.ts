/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import { DyeLog } from "@littlelite/dyelog";
import { User } from "../model/types.ts";


export class DenoKV
{
    private readonly logger: DyeLog;
    private kv: Deno.Kv | undefined;

    public static Create = async (logger: DyeLog): Promise<DenoKV> => {
        return new DenoKV(logger);
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
        this.logger.info("Looking for user " + username + " in Deno KV...");
        const user: Deno.KvEntryMaybe<User> = await this.kv.get(["users", username]);
        this.logger.info("Retrieved user " + JSON.stringify(user.value));
        return user.value;
    }

    async getAllUsers(): Promise<User[]|null>
    {
        this.logger.info("Looking for all users in Deno KV...");
        if (this.kv == null) this.kv = await Deno.openKv();
        const entries: Deno.KvListIterator<User> = this.kv.list({ prefix: ["users"] });
        if (entries.next == null) return null;
        const users: User[] = [];
        for await (const entry of entries) {
            users.push(entry.value as User);
        }
        this.logger.info("Retrieved " + users.length + " users.");
        return users;
    }

    async deleteUser(username: string)
    {
        this.logger.info("Deleting user " + username + " from Deno KV...");
        if (this.kv == null) this.kv = await Deno.openKv();
        await this.kv.delete(["users", username]);
    }

    async createUser(username: string, password: string)
    {
        this.logger.info("Creating user " + username + " in Deno KV...");
        if (this.kv == null) this.kv = await Deno.openKv();
        await this.kv.set(["users", username], { username , password });
    }

    async createDefaultUsers()
    {
        this.logger.info("Creating default users in Deno KV...");
        if (this.kv == null) this.kv = await Deno.openKv();
        await this.kv.set(["users", "alessio"], { username: "alessio", password: "doctor" });
        await this.kv.set(["users", "guest"], { username: "guest", password: "guest" });
    }
}
