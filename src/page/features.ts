/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Page } from "./page.ts";
import { View } from "../view/view.ts";
import { DyeLog } from "@littlelite/dyelog";

export class Features extends Page
{

    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
    }

    async render()
    {
        this.logger.info("GET /features");
        this.ctx.response.body = await View.render("./static/templates/features.eta", {
            appname: "SmartDeno",
            appversion: this.version,
            title: "Features",
            description: "🦕 SmartDeno has been made with the following building blocks: 🦕",
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
