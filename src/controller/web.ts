/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

// Routes
import { Router, RouterContext } from '../deps.ts';

export const webRouter = new Router();

webRouter.get("/", (ctx: RouterContext) => {
    ctx.render('views/index.njk', {
        appname: "SmartDeno",
        appdescription: "🦕 A simple template site written in Deno 🦕"
    });
});

webRouter.get("/features", (ctx: RouterContext) => {
    ctx.render('views/features.njk', {
        appname: "SmartDeno",
        title: "Features",
        description: "🦕 SmartDeno is made with the following building blocks: 🦕",
        features: {
            "Deno": "https://deno.land",
            "Bootstrap": "https://getbootstrap.com/",
            "Denjucks": "https://deno.land/x/denjucks@1.1.1",
            "DyeLog": "https://deno.land/x/dyelog@v0.1.1"
        }
    });
});

webRouter.get("/login", (ctx: RouterContext) => {
    ctx.render('views/login.njk', {
        appname: "SmartDeno",
        title: "Contact",
        description: "🦕 SmartDeno has been made by Alessio Saltarin <alessiosaltarin@gmail.com> 🦕"
    });
});
