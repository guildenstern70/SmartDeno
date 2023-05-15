/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { render } from "eta";
import { Page } from "./page.ts";
import { Featuresview } from "../view/featuresview.ts";
import { Homeview } from "../view/homeview.ts";


export class Features extends Page
{

    constructor(logger: DyeLog, ctx: any)
    {
        super(logger, ctx);
    }

    async render()
    {
        this.logger.info("GET /features");

        const view = new Featuresview();
        const html = await view.get();

        this.ctx.response.body = await render(html, {
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
