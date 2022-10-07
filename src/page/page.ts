/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import { DyeLog } from '../deps.ts';


export abstract class Page {

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
