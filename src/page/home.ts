/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import { DyeLog, render } from '../deps.ts';
import { HomeView } from '../view/homeView.ts';
import { Page } from './page.ts';

export class Home extends Page {

    constructor(logger: DyeLog, ctx: any) {
        super(logger, ctx);
    }
    
    async render() {
        this.logger.info("GET /home");
        const sessionUser = await this.ctx.state.session.get("logged-user");
        let welcomeMessage = "A simple template site written in Deno";
        if (sessionUser) {
            this.logger.info(`Logged user > ${sessionUser}`);
            welcomeMessage = `Welcome to SmartDeno, ${sessionUser}`;
        }
        else
        {
            this.logger.info("Anonymous user");
        }

        this.ctx.response.body = await render(new HomeView().get(), {
            appname: "SmartDeno",
            appdescription: welcomeMessage,
            sessionUser
        });

    }

}
