/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 *
 */

import type { DyeLog } from "@littlelite/dyelog";
import type { RouterContext } from "@oak/oak";
import { Eta } from "eta";
import { VERSION } from "../version.ts";

export abstract class Page
{
    protected ctx: RouterContext<any>;
    protected logger: DyeLog;
    protected version: string;
    protected template!: string;
    protected sessionUser!: string | null;

    protected abstract render(): void;

    protected constructor(logger: DyeLog, ctx: RouterContext<any>)
    {
        this.logger = logger;
        this.ctx = ctx;
        this.version = VERSION;

        ctx.response.headers.set("Content-Type", "text/html");
    }

    protected async initializeSession()
    {
        this.sessionUser = await this.ctx.state.session.get("logged-user");
        this.logger.info(`Logged user > ${this.sessionUser}`);
    }

    protected eta(pageData: object): string
    {
        const eta = new Eta({ views: './static/templates' });
        return eta.render(this.template, pageData);
    }

}
