/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

// Routes
import { Router } from './deps.ts';

export const router = new Router();

router.get("/", (ctx) => {
    ctx.render('views/index.njk', {
        appname: "SmartDeno",
        appdescription: "🦕 A simple template site written in Deno 🦕"
    });
});

router.get("/features", (ctx) => {
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

router.get("/login", (ctx) => {
    ctx.render('views/login.njk', {
        appname: "SmartDeno",
        title: "Contact",
        description: "🦕 SmartDeno has been made by Alessio Saltarin <alessiosaltarin@gmail.com> 🦕"
    });
});
