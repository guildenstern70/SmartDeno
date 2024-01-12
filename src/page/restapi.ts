/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import { DyeLog } from "dyelog";
import { View } from "../view/view.ts";

export class Restapi extends Page
{
    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
    }

    async render()
    {
        this.logger.info("GET /restapi");
        this.ctx.response.body = await View.render("./static/templates/restapi.eta", {
            appname: "SmartDeno",
            appversion: this.version
        });
    }

}
