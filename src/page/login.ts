/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import { DyeLog, render } from '../deps.ts';
import { Page } from './page.ts';
import { LoginView } from '../view/loginView.ts';
import { IUser } from '../service/dto.ts';
import { Session } from '../service/session.ts';
import User from '../service/user.ts';


export class Login extends Page {

    private readonly usersDb: UsersDb;

    constructor(logger: DyeLog, ctx: any) {
        super(logger, ctx);
        this.usersDb = new UsersDb();
    }

    async post() {
        this.logger.info("POST /login");
        if (this.ctx.request.hasBody) {
            const value: URLSearchParams = await this.ctx.request.body().value;
            if (typeof value === "undefined") {
                this.logger.info("Unknown form parameters");
                this.ctx.response.redirect("/login?error=notfound");
            }
            const posteduser: IUser = {
                username: value.get("username")!,
                password: value.get("password")!,
            };
            if (this.checkLogin(posteduser)) {
                this.logger.info("Ok, user logged in.");
                Session.setItem("logged-user", posteduser.username);
                this.logger.info("POST LOGIN Logged User is " + Session.getItem("logged-user"));
                this.ctx.response.redirect("/");
            } else {
                this.logger.info("User unknown or wrong password");
                this.ctx.response.redirect("/login?error=notfound");
            }
        } else {
            this.logger.error("Empty body");
            this.ctx.response.redirect("/login?error=notfound");
        }
    }

    async render() {

        this.logger.info("GET /login");
        const qParams = this.ctx.request.url.searchParams;
        const error = qParams.get("error");
        if (error) this.logger.warn("Error == " + error);
        let loginErrors = false;
        if (error) {
            loginErrors = true;
        }
        if (loginErrors) this.logger.warn("loginErrors == " + loginErrors);

        const loginEta = new LoginView().get();
        this.ctx.response.body = await render(loginEta, {
            appname: "SmartDeno",
            title: "Contact",
            description: "🦕 SmartDeno has been made by Alessio Saltarin <alessiosaltarin@gmail.com> 🦕"
        });
    }

    private checkLogin(postedUser: IUser): boolean {
        this.logger.info("Got login request with User=" + postedUser.username
            + " and password=" + postedUser.password);
        const user: User | undefined = this.usersDb.getByUsername(postedUser.username);
        return (typeof user !== "undefined") &&
            (user.password === postedUser.password);

    }

}
