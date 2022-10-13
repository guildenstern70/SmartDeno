/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */
// deno-lint-ignore-file no-explicit-any

import { DyeLog } from "../deps.ts";

export abstract class Page
{

    protected ctx: any;
    protected logger: DyeLog;

    protected abstract async render(): void;

    protected constructor(logger: DyeLog, ctx: any)
    {
        this.logger = logger;
        this.ctx = ctx;
        ctx.response.headers.set("Content-Type", "text/html");
    }

}
