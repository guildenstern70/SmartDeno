/*global Deno */
/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import WebRouter from "./controller/web.ts";
import UsersDb from "./service/userdb.ts";
import {
    Application,
    DyeLog,
    LogLevel
} from './deps.ts';

const app = new Application<{ loggedUser?: string }>({state: {}});


// Logger
const logger = new DyeLog({
    timestamp: true,
    printlevel: true,
    level: LogLevel.TRACE
});

// Timing (Logger and Response Header)
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    logger.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// In memory DB
const usersdb = new UsersDb();
usersdb.add({username: "guest", password: "guest"});

// Routes
// @ts-ignore: usersdb object is just fine
const webRouter = new WebRouter(usersdb, logger);
app.use(webRouter.routes());
app.use(webRouter.allowedMethods());

// Static Files
app.use(async (context, next) => {
    const root = `${Deno.cwd()}/static`
    try {
        await context.send({ root })
    } catch {
        await next()
    }
})

logger.info("Running in: " + Deno.cwd());
app.addEventListener(
    "listen",
    (_e) => logger.warn("🦕 Deno server running at http://localhost:8000/ 🦕"),
);

await app.listen({port: 8000});






