/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import { DyeLog, render } from '../deps.ts';
import { HomeView } from '../view/homeView.ts';
import { Page } from './page.ts';
import { Session } from '../service/session.ts';


export class Home extends Page {

    constructor(logger: DyeLog, ctx: any) {
        super(logger, ctx);
    }


    async render() {
        this.logger.info("GET /home");

        const sessionUser = Session.getItem("logged-user");
        let welcomeMessage = "A simple template site written in Deno";
        if (sessionUser) {
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