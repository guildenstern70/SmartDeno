/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import { DyeLog, render } from "../deps.ts";
import { Restapiview } from "../view/restapiview.ts";

export class Restapi extends Page
{

    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
    }

    async render()
    {
        this.logger.info("GET /restapi");
        this.ctx.response.body = await render(new Restapiview().get(), {
            appname: "SmartDeno"
        });
    }

}
