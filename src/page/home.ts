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

export class Home extends Page
{

    constructor(logger: DyeLog, ctx: Context)
    {
        super(logger, ctx);
        this.template = "./home";
    }

    async render()
    {
        this.logger.info("GET /home");
        await this.initializeSession();
        let welcomeMessage = "A simple web template written in Deno";
        if (this.sessionUser)
        {
            welcomeMessage = "Welcome to SmartDeno, ";
        }

        this.ctx.response.body = this.eta({
            appname: "SmartDeno",
            appversion: this.version,
            appdescription: welcomeMessage,
            sessionUser: this.sessionUser
        });

    }

}
