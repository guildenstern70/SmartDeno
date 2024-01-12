/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Router, Status } from "oak";
import { DyeLog } from "dyelog";
import { DenoKV } from '../db/denokv.ts';
import { User } from "../model/types.ts";


export default class RestRouter extends Router
{

    private readonly logger: DyeLog;

    constructor(logger: DyeLog)
    {
        super();
        this.logger = logger;
        this.setupRoutes();
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
                .delete("/api/v1/user/:username", await this.deleteUser)
            ;

        }
        catch (err: any)
        {
            this.logger.error("ERROR");
            this.logger.error(err);
        }
    }

    private getUsers = async (ctx: any) =>
    {
        const denokv: DenoKV = await DenoKV.Create(this.logger);
        this.logger.info("/api/v1/user");
        const users: User[]|null = await denokv.getAllUsers();
        if (users != null) {
            ctx.response.status = Status.OK;
            ctx.response.type = "json";
            ctx.response.body = users;
        } else {
            ctx.response.status = Status.NotFound;
        }

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
        const denokv: DenoKV = await DenoKV.Create(this.logger);
        const user = await denokv.getSingleUser(username);
        if (user)
        {
            ctx.response.status = 200;
            ctx.response.body = user;
        }
        else
        {
            ctx.response.status = 404;
            ctx.response.body = {message: `User with username=${username} not found.`};
        }
    };

    private addUser = async (ctx: any) =>
    {
        const denokv: DenoKV = await DenoKV.Create(this.logger);
        const {username, password} = await ctx.request.body().value;
        const newUser = {username, password};
        this.logger.info("Received " + JSON.stringify(newUser));
        if (newUser.username && newUser.password)
        {
            await denokv.createUser(username, password);
            ctx.response.body = { message: "OK - User inserted with username = " + username };
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
        const username = ctx.params.username;
        if (typeof username === "undefined")
        {
            ctx.response.status = 404;
            ctx.response.body = {message: "Missing user name."};
            return;
        }
        const denokv: DenoKV = await DenoKV.Create(this.logger);
        await denokv.deleteUser(username);
        ctx.response.body = {message: "OK - Deleted user " + username};
        ctx.response.status = 200;
    };

}


