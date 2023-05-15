/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import { render } from "eta";
import { DyeLog } from "dyelog";
import { Restapiview } from "../view/restapiview.ts";
import { Loginview } from "../view/loginview.ts";

export class Restapi extends Page
{

    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
    }

    async render()
    {
        this.logger.info("GET /restapi");

        const view = new Restapiview();
        const html = await view.get();

        this.ctx.response.body = await render(html, {
            appname: "SmartDeno"
        });
    }

}
