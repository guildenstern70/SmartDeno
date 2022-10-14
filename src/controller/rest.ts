/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import { DyeLog, Router, Status } from "../deps.ts";
import User from "../service/user.ts";
import { FaunaDb } from "../db/fauna.ts";
import { UserDumpResponse } from "../service/types.ts";


export default class RestRouter extends Router
{

    private readonly logger: DyeLog;
    private readonly faunaDb: FaunaDb;

    constructor(logger: DyeLog)
    {
        super();
        this.logger = logger;
        this.faunaDb = new FaunaDb(logger);
        this.setupRoutes().then(this.logger.info("REST routes set up."));
    }

    private async setupRoutes()
    {
        this.logger.info("Setting up REST API routes...");
        try
        {
            this
                .get("/api/v1/user", await this.getUsers)
                .get("/api/v1/user/:username", await this.getUser)
                .post("/api/v1/user", await this.addUser)
                .delete("/api/v1/user/:id", await this.deleteUser);

        }
        catch (err: any)
        {
            this.logger.error("ERROR");
            this.logger.error(err);
        }
    }

    private getUsers = async (ctx: any) =>
    {
        this.logger.info("/api/v1/user");
        const users: User[] = await this.faunaDb.getAllUsers();
        ctx.response.status = Status.OK;
        ctx.response.type = "json";
        ctx.response.body = users;
    };

    private getUser = async (ctx: any) =>
    {
        ctx.response.type = "json";
        const username = ctx.params.username;
        this.logger.info("/api/v1/user/" + username);
        if (typeof username === "undefined")
        {
            ctx.response.status = 404;
            ctx.response.body = {message: "User not found."};
            return;
        }
        const user = await this.faunaDb.getSingleUser(username);
        if (user)
        {
            ctx.response.status = 200;
            ctx.response.body = user[0];
        }
        else
        {
            ctx.response.status = 404;
            ctx.response.body = {message: `User with username=${username} not found.`};
        }
    };

    private addUser = async (ctx: any) =>
    {
        const {username, password} = await ctx.request.body().value;
        const newUser = {username, password};
        this.logger.info("Received " + JSON.stringify(newUser));
        if (newUser.username && newUser.password)
        {
            const createdUser: UserDumpResponse = await this.faunaDb.createUser(username, password);
            if (createdUser.error)
            {
                ctx.response.body = { message: "Error - Cannot create user: " + JSON.stringify(createdUser.error)};
                ctx.response.status = 400;
                return;
            }
            ctx.response.body = { message: "OK - User inserted with ID = " + createdUser.createUser.id };
            ctx.response.status = 201;
        }
        else
        {
            ctx.response.body = { message: "KO - Cannot insert due to bad request"};
            ctx.response.status = 400;
        }
    };

    private deleteUser = async (ctx: any) =>
    {
        ctx.response.type = "json";
        const userId = ctx.params.id;
        if (typeof userId === "undefined")
        {
            ctx.response.status = 404;
            ctx.response.body = {message: "User not found."};
            return;
        }
        const deleted = await this.faunaDb.deleteUser(userId);
        if (deleted)
        {
            ctx.response.body = {message: "OK - Deleted _ID " + deleted};
            ctx.response.status = 200;
        }
        else
        {
            ctx.response.body = {message: `User with ID=${userId} was not found.`};
            ctx.response.status = 404;
        }
    };

}


