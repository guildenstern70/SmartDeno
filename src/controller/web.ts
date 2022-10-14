/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import { Home } from "../page/home.ts";
import { Login } from "../page/login.ts";
import { DyeLog, Router } from "../deps.ts";
import { Features } from "../page/features.ts";
import { Restapi } from "../page/restapi.ts";

export default class WebRouter extends Router
{

    private readonly logger: DyeLog;

    constructor(logger: DyeLog)
    {
        super();
        this.logger = logger;
        this.setupRoutes().then(this.logger.info("Web routes set up."));
    }


    private async setupRoutes()
    {
        this.logger.info("Setting up web routes...");
        try
        {
            this
                .get("/", await this.getHome)
                .get("/features", await this.getFeatures)
                .get("/restapi", await this.getRestApi)
                .get("/login", await this.getLogin)
                .post("/login", await this.postLogin)
                .get("/logout", await this.getLogout);

        }
        catch (err)
        {
            this.logger.error("ERROR");
            this.logger.error(err);
        }
    }

    private getHome = async (ctx: any) =>
    {
        await new Home(this.logger, ctx).render();
    };

    private getFeatures = async (ctx: any) =>
    {
        await new Features(this.logger, ctx).render();
    };

    private getLogin = async (ctx: any) =>
    {
        await new Login(this.logger, ctx).render();
    };

    private getRestApi = async (ctx: any) =>
    {
        await new Restapi(this.logger, ctx).render();
    };

    private getLogout = async (ctx: any) =>
    {
        this.logger.info("GET /logout");
        await ctx.state.session.set("logged-user", undefined);
        ctx.response.redirect("/");
    };

    private postLogin = async (ctx: any) =>
    {
        await new Login(this.logger, ctx).post();
    };

}



