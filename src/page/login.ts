/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import { User } from "../model/types.ts";
import { View } from "../view/view.ts";
import { DyeLog } from "dyelog";
import { DenoKV } from "../db/denokv.ts";


export class Login extends Page
{
    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
    }

    async post()
    {
        this.logger.info("POST /login");
        if (this.ctx.request.hasBody)
        {
            const value: URLSearchParams = await this.ctx.request.body().value;
            if (typeof value === "undefined")
            {
                this.logger.info("Unknown form parameters");
                this.ctx.response.redirect("/login?error=notfound");
            }
            const posteduser: User = {
                username: value.get("username")!,
                password: value.get("password")!,
            };

            const foundUser = await this.checkLogin(posteduser);
            if (foundUser)
            {
                this.logger.info("Ok, user logged in > " + posteduser.username);
                await this.ctx.state.session.set("logged-user", posteduser.username);
                const loggedUser = await this.ctx.state.session.get("logged-user");
                this.logger.info("POST LOGIN Logged User is " + loggedUser);
                this.ctx.response.redirect("/");
            }
            else
            {
                this.logger.info("User unknown or wrong password");
                this.ctx.response.redirect("/login?error=notfound");
            }

        }
        else
        {
            this.logger.error("Empty body");
            this.ctx.response.redirect("/login?error=notfound");
        }
    }

    async render()
    {

        this.logger.info("GET /login");
        const qParams = this.ctx.request.url.searchParams;
        const error = qParams.get("error");
        let loginErrors = false;
        if (error)
        {
            this.logger.warn("Error == " + error);
            loginErrors = true;
        }

        this.ctx.response.body = await View.render("./static/templates/login.eta", {
            appname: "SmartDeno",
            appversion: this.version,
            title: "Contact",
            loginerrors: loginErrors,
            description: "🦕 SmartDeno has been made by Alessio Saltarin <alessiosaltarin@gmail.com> 🦕"
        });
    }

    private async checkLogin(postedUser: User): Promise<boolean>
    {

        this.logger.info("Got login request with User=" + postedUser.username
            + " and password=" + postedUser.password);

        const denokv = await DenoKV.Create(this.logger);
        const user = await denokv.getSingleUser(postedUser.username);
        if (user)
        {
            this.logger.info("User found: " + JSON.stringify(user));
            return user.password === postedUser.password;
        }
        else
        {
            this.logger.info("User not found");
            return false;
        }
    }

}
