#!/usr/bin/env -S deno run --allow-read
/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

/*global Deno */
import WebRouter from "./controller/web.ts";
import { Application } from "oak";
import { Session } from "oak_sessions";
import { DyeLog, LogLevel } from "dyelog";
import { FaunaDb } from "./db/fauna.ts";
import User from "./model/user.ts";
import { UserDump } from "./model/types.ts";
import RestRouter from "./controller/rest.ts";

type AppState = {
    session: Session
}

const app = new Application<AppState>();

// Logger
const logger = new DyeLog({
    timestamp: true,
    printlevel: true,
    level: LogLevel.TRACE
});

// Timing (Logger and Response Header)
app.use(async (ctx, next) =>
{
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    logger.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
app.use(async (ctx, next) =>
{
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Fauna DB
const faunaDb = new FaunaDb(logger);
faunaDb.getAllUsers().then((users: User[]|null) =>
{
    if (users === null || users.length === 0)
    {
        const defaultUsers: User[] = [
            new User({username: "admin", password: "admin", name:"Alec", surname:"Jumpreen", group: "admins"}),
            new User({username: "guest", password: "guest", name:"John", surname:"Doe", group: "users"})
        ];
        defaultUsers.forEach( user => {
            logger.info("Creating user " + user.toString())
            faunaDb.createUser(user).then((data: UserDump) =>
            {
                if (data.error)
                {
                    logger.error("FaunaDB cannot create user " + user.username);
                }
                else
                {
                    logger.info("- Created user:  " + user.username);
                }
            });
        })
    }
    else
    {
        const userLen = users.length;
        let userDescription = "user";
        if (userLen > 1)
            userDescription = "users";
        logger.info("Found " + userLen + " " + userDescription + " in FaunaDB.");
    }
});

// Routes
// @ts-ignore: usersdb object is just fine
const webRouter = new WebRouter(logger);
const restRouter = new RestRouter(logger);

app.use(Session.initMiddleware());
app.use(webRouter.routes());
app.use(webRouter.allowedMethods());
app.use(restRouter.routes());
app.use(restRouter.allowedMethods());

// Static Files
app.use(async (context, next) =>
{
    const root = `${Deno.cwd()}/static`;
    try
    {
        await context.send({root});
    }
    catch
    {
        await next();
    }
});


logger.info("Running in: " + Deno.cwd());
app.addEventListener(
    "listen",
    (_e) => logger.warn("🦕 Deno server running at http://localhost:8000/ 🦕"),
);

await app.listen({port: 8000});






