// deno-lint-ignore-file no-explicit-any
/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

// Routes
import { Home } from "../page/home.ts";
import { Login } from "../page/login.ts";
import { DyeLog, Router } from "../deps.ts";
import { Features } from '../page/features.ts';

export default class WebRouter extends Router {

    private readonly logger: DyeLog;

    constructor(logger: DyeLog) {
        super();
        this.logger = logger;
        this.setupRoutes();
    }


    private async setupRoutes() {
        this.logger.info("Setting up web routes...");
        try {
            this
                .get("/", this.getHome)
                .get("/features", this.getFeatures)
                .get("/login", this.getLogin)
                .post("/login", this.postLogin)
                .get("/logout", this.getLogout);

        } catch (err) {
            this.logger.error("ERROR");
            this.logger.error(err);
        }
    }

    private getHome = async (ctx: any) => {
        await new Home(this.logger, ctx).render();
    }

    private getFeatures = async (ctx: any) => {
        await new Features(this.logger, ctx).render();
    }

    private getLogin = async (ctx: any) => {
        await new Login(this.logger, ctx).render();
    }

    private getLogout = async (ctx: any) => {
        this.logger.info("GET /logout");
        await ctx.state.session.set("logged-user", undefined);
        ctx.response.redirect("/");
    }

    private postLogin = async (ctx: any) => {
        await new Login(this.logger, ctx).post();
    }

}



