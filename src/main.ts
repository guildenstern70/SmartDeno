/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

import RestRouter from './controller/rest.ts';
import { Application, send } from "./deps.ts";
import { DyeLog, LogLevel } from "./deps.ts";
import {
    viewEngine,
    engineFactory,
    adapterFactory,
} from "./deps.ts";
import { webRouter } from './controller/web.ts';
import UsersDb from './service/usersdb.ts';

const app = new Application();

// In memory DB
const usersdb = new UsersDb();
usersdb.add({ username: "guest", password: "guest" });

// Templating Engine
const denjucksEngine = engineFactory.getDenjuckEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, denjucksEngine));

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

// Exception Handling
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (err) {
        logger.error(err);
    }
})

// Static Files
app.use(async (ctx, next) => {
    const filePath = ctx.request.url.pathname;
    const allowedRequests = ["/css", "/img", "/js"];
    await next();
    for (const request of allowedRequests) {
        if (filePath.startsWith(request)) {
            await send(ctx, filePath, {
                root: `${Deno.cwd()}/static`
            });
        }
    }
});

// Imported Routes
const restRouter = new RestRouter(usersdb, logger);
app.use(restRouter.routes());
app.use(restRouter.allowedMethods());
app.use(webRouter.routes());
app.use(webRouter.allowedMethods());

logger.warn("🦕 Deno server running at http://localhost:8000/ 🦕");
await app.listen({port: 8000});






