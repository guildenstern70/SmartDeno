/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020 Alessio Saltarin
 * MIT License
 */

import { Application, send } from "./deps.ts";
import { DyeLog, LogLevel } from "./deps.ts";
import {
    viewEngine,
    engineFactory,
    adapterFactory,
} from "./deps.ts";
import { router } from './routes.ts';

const app = new Application();

const logger = new DyeLog({
    timestamp: true,
    level: LogLevel.TRACE
});

// Templating Engine
const denjucksEngine = engineFactory.getDenjuckEngine();
const oakAdapter = adapterFactory.getOakAdapter();
app.use(viewEngine(oakAdapter, denjucksEngine));

// Logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.headers.get("X-Response-Time");
    logger.info(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// Static Files
app.use(async (ctx, next) => {
    const filePath = ctx.request.url.pathname;
    const allowedRequests = ["/css", "/img"];
    await next();
    for (let request of allowedRequests) {
        if (filePath.startsWith(request)) {
            logger.info("Serving /static" + filePath);
            await send(ctx, filePath, {
                root: `${Deno.cwd()}/static`
            });
        }
    }
});


// Imported Routes
app.use(router.routes());
app.use(router.allowedMethods());

logger.warn("🦕 Deno server running at http://localhost:8000/ 🦕");
await app.listen({port: 8000});






