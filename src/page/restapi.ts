/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import type { DyeLog } from "@littlelite/dyelog";
import type { RouterContext } from "@oak/oak";

export class Restapi extends Page
{
    constructor(logger: DyeLog, ctx: RouterContext<any>)
    {
        super(logger, ctx);
        this.template = "./restapi";
    }

    async render()
    {
        this.logger.info("GET /restapi");
        await this.initializeSession();
        this.ctx.response.body = this.eta({
            appname: "SmartDeno",
            appversion: this.version,
            sessionUser: this.sessionUser
        });
    }

}
