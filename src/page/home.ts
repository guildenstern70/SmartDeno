/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import { DyeLog, render } from "../deps.ts";
import { Homeview } from "../view/homeview.ts";
import { Page } from "./page.ts";

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

        this.ctx.response.body = await render(new Homeview().get(), {
            appname: "SmartDeno",
            appdescription: welcomeMessage,
            sessionUser
        });

    }

}
