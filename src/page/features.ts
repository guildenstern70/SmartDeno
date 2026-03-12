/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import { Page } from "./page.ts";
import type { DyeLog } from "@littlelite/dyelog";
import type { RouterContext } from "@oak/oak";
import { DenoKV } from "../db/denokv.ts";

export class Features extends Page {
  constructor(logger: DyeLog, ctx: RouterContext<any>) {
    super(logger, ctx);
    this.template = "./features";
  }

  async render() {
    this.logger.info("GET /features");
    await this.initializeSession();

    let usersCount = 0;
    try {
      const denokv = DenoKV.Create(this.logger);
      const users = await denokv.getAllUsers();
      usersCount = users?.length ?? 0;
    } catch (error) {
      this.logger.warn("Cannot retrieve users count from Deno KV.");
      this.logger.warn(String(error));
    }

    this.ctx.response.body = this.eta({
      title: "Features",
      description:
        "🦕 SmartDeno has been made with the following building blocks: 🦕",
      features: {
        "Deno": "https://deno.land",
        "Bootstrap": "https://getbootstrap.com/",
        "Oak": "https://deno.land/x/oak",
        "Oak Sessions": "https://github.com/jcs224/oak_sessions",
        "Eta": "https://eta.js.org/",
        "DyeLog": "https://deno.land/x/dyelog",
      },
      usersCount,
    });
  }
}
