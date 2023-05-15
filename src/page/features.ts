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
            title: "Features",
            description: "🦕 SmartDeno has been made with the following building blocks: 🦕",
            features: {
                "Deno": "https://deno.land",
                "Bootstrap": "https://getbootstrap.com/",
                "Fauna DB": "https://fauna.com/",
                "Oak": "https://deno.land/x/oak",
                "Oak Sessions": "https://github.com/jcs224/oak_sessions",
                "Eta": "https://eta.js.org/",
                "DyeLog": "https://deno.land/x/dyelog"
            }
        });

    }

}
