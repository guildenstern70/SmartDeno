/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-25 Alessio Saltarin
 * MIT License
 *
 */

import { DyeLog } from "@littlelite/dyelog";
import { Context } from "jsr:@oak/oak";
import { Eta } from "eta";
import { VERSION } from "../version.ts";

export abstract class Page
{
    protected ctx: any;
    protected logger: DyeLog;
    protected version: string;
    protected template!: string;

    protected abstract render(): void;

    protected constructor(logger: DyeLog, ctx: Context)
    {
        this.logger = logger;
        this.ctx = ctx;
        this.version = VERSION;
        ctx.response.headers.set("Content-Type", "text/html");
    }

    protected eta(pageData: object): string
    {
        const eta = new Eta({ views: './static/templates' });
        return eta.render(this.template, pageData);
    }

}
