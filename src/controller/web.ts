/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

// Routes
import { DyeLog, Router, RouterContext, Status } from '../deps.ts';
import { IUser } from '../service/dtos.ts';
import User from '../service/user.ts';
import UsersDb from '../service/usersdb.ts';

export default class WebRouter extends Router {
    private readonly logger: DyeLog;
    private readonly usersDb: UsersDb;

    constructor(usersDb: UsersDb,
                logger: DyeLog) {
        super();
        this.logger = logger;
        this.usersDb = usersDb;
        this.setupRoutes();
    }

    private setupRoutes() {
        this.logger.info("Setting up web routes...");
        try {
            this
                .get('/', this.getHome)
                .get('/features', this.getFeatures)
                .get('/login', this.getLogin)
                .post('/login', this.postLogin)

        } catch (err: any) {
            this.logger.error("ERROR");
            this.logger.error(err);
        }
    }

    private getHome = (ctx: RouterContext) => {
        ctx.render('views/index.njk', {
            appname: "SmartDeno",
            appdescription: "🦕 A simple template site written in Deno 🦕"
        });
    }

    private getFeatures = (ctx: RouterContext) => {
        this.logger.info("GET /features");
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
    }

    private getLogin = (ctx: RouterContext) => {
        this.logger.info("GET /login");
        ctx.render('views/login.njk', {
            appname: "SmartDeno",
            title: "Contact",
            description: "🦕 SmartDeno has been made by Alessio Saltarin <alessiosaltarin@gmail.com> 🦕"
        });
    }

    private postLogin = async (ctx: RouterContext) => {
        this.logger.info("POST /login");
        if (ctx.request.hasBody) {
            const body = await ctx.request.body();
            let value: URLSearchParams = await body.value;
            if (value == undefined) {
                this.logger.info("Unknown form parameters");
                ctx.response.redirect("/login?error=notfound");
            }
            const posteduser: IUser = {
                username: value.get("username")!,
                password: value.get("password")!,
            }
            this.logger.info("Got login request with User=" + posteduser.username
                + " and password=" + posteduser.password);
            const user: User | undefined = this.usersDb.getByUsername(posteduser.username);
            if ((user != undefined) && (user.password === posteduser.password)) {
                this.logger.info("Ok, user logged in.");
                ctx.response.redirect("/");
            } else {
                this.logger.info("User unknown or wrong password");
                ctx.response.redirect("/login?error=notfound");
            }
        } else {
            this.logger.error("Empty body");
            ctx.response.redirect("/login?error=notfound");
        }
    }
}



