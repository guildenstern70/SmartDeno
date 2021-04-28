// deno-lint-ignore-file no-explicit-any
/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

import { DyeLog, Router, RouterContext, Status } from '../deps.ts';
import User from '../service/user.ts';
import UsersDb from '../service/usersdb.ts';


export default class RestRouter extends Router
{
    private readonly usersDb: UsersDb;
    private readonly logger: DyeLog;

    constructor(usersDb: UsersDb,
                logger: DyeLog) {
        super();
        this.logger = logger;
        this.usersDb = usersDb;
        this.setupRoutes();
    }

    private setupRoutes() {
        this.logger.info("Setting up routes...");
        try
        {
            this
                .get   ('/api/v1/user', this.getUsers)
                .get   ('/api/v1/user/:id', this.getUser)
                .post  ('/api/v1/user', this.addUser)
                .delete('/api/v1/user/:id', this.deleteUser);

        } catch (err: any) {
            this.logger.error("ERROR");
            this.logger.error(err);
        }
    }

    private getUsers = (ctx: RouterContext) => {
        ctx.response.status = Status.OK;
        ctx.response.type = 'json';
        ctx.response.body = this.usersDb.getAll();
    }

    private getUser = (ctx: RouterContext)=> {
        ctx.response.type = 'json';
        const userId = ctx.params.id;
        if (userId == undefined) {
            ctx.response.status = 404;
            ctx.response.body = {message: `User not found.`}
            return;
        }
        const user: User | undefined = this.usersDb.get(userId);
        if (user) {
            ctx.response.status = 200;
            ctx.response.body = user;
        } else {
            ctx.response.status = 404;
            ctx.response.body = {message: `User with ID=${userId} not found.`}
        }
    }

    private addUser = async (ctx: RouterContext) => {
        const { username, password } = await ctx.request.body().value;
        const newUser = { "username": username, "password":password };
        this.logger.info("Received " + JSON.stringify(newUser));
        if (!Object.prototype.hasOwnProperty.call(newUser, username)) {
            ctx.response.body = { message: 'KO - Cannot insert user unknown' }
            ctx.response.status = 400;
        }
        else {
            this.usersDb.add(newUser);
            ctx.response.body = {message: 'OK - User inserted'}
            ctx.response.status = 201;
        }
    }

    private deleteUser = (ctx: RouterContext) => {
        ctx.response.type = 'json';
        const userId = ctx.params.id;
        if (userId == undefined) {
            ctx.response.status = 404;
            ctx.response.body = {message: `User not found.`}
            return;
        }
        const deleted = this.usersDb.delete(userId);
        if (deleted) {
            ctx.response.body = {message: 'OK - Deleted'};
            ctx.response.status = 200;
        } else {
            ctx.response.body = {message: `User with ID=${userId} was not found.`}
            ctx.response.status = 404;
        }
    }

}


