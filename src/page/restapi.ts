/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import { DyeLog, render } from "../deps.ts";
import { RestApiView } from "../view/restApiView.ts";

export class Restapi extends Page
{

    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
    }

    async render()
    {
        this.logger.info("GET /restapi");
        this.ctx.response.body = await render(new RestApiView().get(), {
            appname: "SmartDeno"
        });
    }

}
