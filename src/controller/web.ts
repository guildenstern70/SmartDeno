/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-25 Alessio Saltarin
 * MIT License
 *
 */

import { Home } from "../page/home.ts";
import { Login } from "../page/login.ts";
import { Features } from "../page/features.ts";
import { Restapi } from "../page/restapi.ts";
import { Router } from "@oak/oak";
import { DyeLog } from "@littlelite/dyelog";

export default class WebRouter extends Router
{

    private readonly logger: DyeLog;

    constructor(logger: DyeLog)
    {
        super();
        this.logger = logger;
        this.setupRoutes();
    }


    private setupRoutes()
    {
        this.logger.info("Setting up web routes...");
        try
        {
            this
                .get("/", this.getHome)
                .get("/features", this.getFeatures)
                .get("/restapi", this.getRestApi)
                .get("/login", this.getLogin)
                .post("/login", this.postLogin)
                .get("/logout", this.getLogout);

        }
        catch (err: any)
        {
            this.logger.error("ERROR");
            this.logger.error(err.toString());
        }
    }

    private getHome = (ctx: any) =>
    {
        new Home(this.logger, ctx).render();
    };

    private getFeatures = (ctx: any) =>
    {
        new Features(this.logger, ctx).render();
    };

    private getLogin = (ctx: any) =>
    {
        new Login(this.logger, ctx).render();
    };

    private getRestApi = (ctx: any) =>
    {
        new Restapi(this.logger, ctx).render();
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



