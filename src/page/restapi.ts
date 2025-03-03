/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-25 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import { DyeLog } from "@littlelite/dyelog";
import { Context } from "jsr:@oak/oak";

export class Restapi extends Page
{
    constructor(logger: DyeLog, ctx: Context)
    {
        super(logger, ctx);
        this.template = "./restapi";
    }

    render()
    {
        this.logger.info("GET /restapi");
        this.ctx.response.body = this.eta({
            appname: "SmartDeno",
            appversion: this.version
        });
    }

}
