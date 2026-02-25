/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import type { DyeLog } from "@littlelite/dyelog";
import type { RouterContext } from "@oak/oak";

export class Features extends Page
{

    constructor(logger: DyeLog, ctx: RouterContext<any>)
    {
        super(logger, ctx);
        this.template = "./features";
    }

    async render()
    {
        this.logger.info("GET /features");
        await this.initializeSession();
        this.ctx.response.body = this.eta({
            appname: "SmartDeno",
            appversion: this.version,
            title: "Features",
            description: "🦕 SmartDeno has been made with the following building blocks: 🦕",
            sessionUser: this.sessionUser,
            features: {
                "Deno": "https://deno.land",
                "Bootstrap": "https://getbootstrap.com/",
                "Deno KV": "https://deno.com/kv",
                "Oak": "https://deno.land/x/oak",
                "Oak Sessions": "https://github.com/jcs224/oak_sessions",
                "Eta": "https://eta.js.org/",
                "DyeLog": "https://deno.land/x/dyelog"
            }
        });

    }

}
