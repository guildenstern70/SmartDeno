#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read
/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-24 Alessio Saltarin
 * MIT License
 *
 */

/*global Deno */
import { Session } from "oak_sessions";
import { Application } from "@oak/oak";
import { DyeLog, LogLevel } from "@littlelite/dyelog";
import RestRouter from "./controller/rest.ts";
import WebRouter from "./controller/web.ts";
import { DenoKV } from "./db/denokv.ts";
import { VERSION } from "./version.ts";

type AppState = {
  session: Session;
};

const app = new Application<AppState>();

// Logger
const logger = new DyeLog({
  timestamp: true,
  printlevel: true,
  level: LogLevel.TRACE,
});

logger.info("Welcome to SmartDeno v." + VERSION);

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

// Deno KV (Users DB)
const kv = await DenoKV.Create(logger);
if (!(await kv.isReady())) {
  logger.info("Deno KV Users DB not found... Creating...");
  await kv.createUser("guest", "guest");
  await kv.createUser("alessio", "doctor");
  logger.info("Deno KV DB has been initialized.");
}

// Routes
// @ts-ignore: usersdb object is just fine
const webRouter = new WebRouter(logger);
const restRouter = new RestRouter(logger);

// @ts-ignore: initMiddleware is OK
app.use(Session.initMiddleware());
app.use(webRouter.routes());
app.use(webRouter.allowedMethods());
app.use(restRouter.routes());
app.use(restRouter.allowedMethods());

// Static Files
app.use(async (context, next) => {
  const root = `${Deno.cwd()}/static`;
  try {
    await context.send({ root });
  } catch {
    await next();
  }
});

logger.info("Running in: " + Deno.cwd());
app.addEventListener("listen", (_e) =>
  logger.warn("🦕 SmartDeno running at http://localhost:8000/ 🦕"),
);

await app.listen({ port: 8000 });
