/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { DyeLog } from "dyelog";

export abstract class Page
{

    protected ctx: any;
    protected logger: DyeLog;

    protected abstract async render(): Promise<void>;

    protected constructor(logger: DyeLog, ctx: any)
    {
        this.logger = logger;
        this.ctx = ctx;
        ctx.response.headers.set("Content-Type", "text/html");
    }

}
