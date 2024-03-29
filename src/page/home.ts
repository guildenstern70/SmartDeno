/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import { View } from "../view/view.ts";
import { DyeLog } from "@littlelite/dyelog";

export class Home extends Page
{

    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
    }

    async render()
    {
        this.logger.info("GET /home");
        const sessionUser = await this.ctx.state.session.get("logged-user");
        let welcomeMessage = "A simple web template written in Deno";
        if (sessionUser)
        {
            this.logger.info(`Logged user > ${sessionUser}`);
            welcomeMessage = "Welcome to SmartDeno, ";
        }

        this.ctx.response.body = await View.render("./static/templates/home.eta", {
            appname: "SmartDeno",
            appversion: this.version,
            appdescription: welcomeMessage,
            sessionUser
        });

    }

}
