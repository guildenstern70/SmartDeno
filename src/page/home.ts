/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */
// deno-lint-ignore-file no-explicit-any

import { DyeLog, render } from "../deps.ts";
import { HomeView } from "../view/homeView.ts";
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
        let welcomeMessage = "A simple template site written in Deno";
        if (sessionUser)
        {
            this.logger.info(`Logged user > ${sessionUser}`);
            welcomeMessage = "Welcome to SmartDeno, ";
        }

        this.ctx.response.body = await render(new HomeView().get(), {
            appname: "SmartDeno",
            appdescription: welcomeMessage,
            sessionUser
        });

    }

}
