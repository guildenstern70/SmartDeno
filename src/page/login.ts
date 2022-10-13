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
import { Page } from "./page.ts";
import { LoginView } from "../view/loginView.ts";
import { IUser } from "../service/types.ts";
import { FaunaDb } from "../db/fauna.ts";
import User from "../service/user.ts";


export class Login extends Page
{

    private faunaDb: FaunaDb;

    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
        this.faunaDb = new FaunaDb(logger);
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
            const posteduser: IUser = {
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
        const loginEta = new LoginView().get();
        this.ctx.response.body = await render(loginEta, {
            appname: "SmartDeno",
            title: "Contact",
            loginerrors: loginErrors,
            description: "🦕 SmartDeno has been made by Alessio Saltarin <alessiosaltarin@gmail.com> 🦕"
        });
    }

    private checkLogin(postedUser: IUser): Promise<boolean>
    {

        this.logger.info("Got login request with User=" + postedUser.username
            + " and password=" + postedUser.password);

        return new Promise((resolve, _reject) =>
        {
            this.faunaDb.getAllUsers().then((users: User[]) =>
            {
                const foundUsers = users.filter((u: User) => u.username === postedUser.username);
                if (foundUsers.length > 0)
                {
                    resolve(foundUsers[0].password === postedUser.password);
                }
                else
                {
                    resolve(false);
                }
            });
        });

    }

}
