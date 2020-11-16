/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020 Alessio Saltarin
 * MIT License
 */

import { Application } from "./deps.ts";
import { Logger } from "./logger.ts";

const app = new Application();
const logger = new Logger();

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

// Hello World!
app.use((ctx) => {
    ctx.response.body = "Hello World!";
});


logger.warn("🦕 Deno server running at http://localhost:8000/ 🦕");
await app.listen({port: 8000});






