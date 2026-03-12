/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import { Home } from "../page/home.ts";
import { Login } from "../page/login.ts";
import { Features } from "../page/features.ts";
import { Restapi } from "../page/restapi.ts";
import { Router, type RouterContext } from "@oak/oak";
import type { DyeLog } from "@littlelite/dyelog";

export default class WebRouter extends Router {
  private readonly logger: DyeLog;

  constructor(logger: DyeLog) {
    super();
    this.logger = logger;
    this.setupRoutes();
  }

  private setupRoutes() {
    this.logger.info("Setting up web routes...");
    try {
      this
        .get("/", this.getHome)
        .get("/features", this.getFeatures)
        .get("/restapi", this.getRestApi)
        .get("/login", this.getLogin)
        .post("/login", this.postLogin)
        .get("/logout", this.getLogout);
    } catch (err: any) {
      this.logger.error("ERROR");
      this.logger.error(err.toString());
    }
  }

  private getHome = async (ctx: RouterContext<any>) => {
    await new Home(this.logger, ctx).render();
  };

  private getFeatures = async (ctx: RouterContext<any>) => {
    await new Features(this.logger, ctx).render();
  };

  private getLogin = async (ctx: RouterContext<any>) => {
    await new Login(this.logger, ctx).render();
  };

  private getRestApi = async (ctx: RouterContext<any>) => {
    await new Restapi(this.logger, ctx).render();
  };

  private getLogout = async (ctx: RouterContext<any>) => {
    this.logger.info("GET /logout");
    await ctx.state.session.set("logged-user", undefined);
    ctx.response.redirect("/");
  };

  private postLogin = async (ctx: RouterContext<any>) => {
    await new Login(this.logger, ctx).post();
  };
}
