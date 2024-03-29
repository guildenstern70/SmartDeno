/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { DyeLog } from "@littlelite/dyelog";
import { VERSION } from "../version.ts";

export abstract class Page
{

    protected ctx: any;
    protected logger: DyeLog;
    protected version: string;

    protected abstract render(): Promise<void>;

    protected constructor(logger: DyeLog, ctx: any)
    {
        this.logger = logger;
        this.ctx = ctx;
        this.version = VERSION;
        ctx.response.headers.set("Content-Type", "text/html");
    }

}
