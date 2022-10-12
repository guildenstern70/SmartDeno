/*global Deno */
/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import WebRouter from "./controller/web.ts";

import {
    Application,
    DyeLog,
    LogLevel,
    Session
} from './deps.ts';
import { FaunaDb } from './db/fauna.ts';

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

// Fauna DB
const faunaDb = new FaunaDb(logger);
faunaDb.getAllUsers().then(users => {
    if (users === undefined || users.length == 0) {
        faunaDb.createUser(0,"guest", "guest").then( data => {
            if (data.error) {
                logger.error("FaunaDB cannot create first user: " + JSON.stringify(data.error));
            }
            else {
                logger.info("Created guest user. ");
            }
        })}
    else {
        users.forEach(user => { logger.info("Found user in FaunaDB: " + JSON.stringify(user)) } );
    }
});

// Routes
// @ts-ignore: usersdb object is just fine
const webRouter = new WebRouter(logger);
// Session
app.use(Session.initMiddleware())

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






