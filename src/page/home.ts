/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import { Page } from "./page.ts";
import type { DyeLog } from "@littlelite/dyelog";
import type { RouterContext } from "@oak/oak";

export class Home extends Page {
  constructor(logger: DyeLog, ctx: RouterContext<any>) {
    super(logger, ctx);
    this.template = "./home";
  }

  async render() {
    this.logger.info("GET /home");
    await this.initializeSession();
    let welcomeMessage = "A starter template for Deno Deploy solutions.";
    if (this.sessionUser) {
      welcomeMessage = "Welcome to SmartDeno, ";
    }

    this.ctx.response.body = this.eta({
      appDescription: welcomeMessage,
    });
  }
}
