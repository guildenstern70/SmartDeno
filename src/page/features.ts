/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import { DyeLog, render } from '../deps.ts';
import { Page } from './page.ts';
import { FeaturesView } from '../view/featuresView.ts';


export class Features extends Page {

    constructor(logger: DyeLog, ctx: any) {
        super(logger, ctx);
    }

    async render() {

        this.logger.info("GET /features");
        const featuresEta = new FeaturesView().get();
        this.ctx.response.body = await render(featuresEta, {
            appname: "SmartDeno",
            title: "Features",
            description: "🦕 SmartDeno has been made with the following building blocks: 🦕",
            features: {
                "Deno": "https://deno.land",
                "Bootstrap": "https://getbootstrap.com/",
                "Oak": "https://deno.land/x/oak",
                "Eta": "https://eta.js.org/",
                "DyeLog": "https://deno.land/x/dyelog"
            }
        });

    }

}
