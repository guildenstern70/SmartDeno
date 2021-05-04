/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

// Routes
import { DyeLog, Router, RouterContext } from "../deps.ts";
import { IUser } from "../service/dtos.ts";
import User from "../service/user.ts";
import UsersDb from "../service/usersdb.ts";

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
                .get("/", this.getHome)
                .get("/features", this.getFeatures)
                .get("/login", this.getLogin)
                .post("/login", this.postLogin)
                .get("/logout", this.getLogout)

        } catch (err) {
            this.logger.error("ERROR");
            this.logger.error(err);
        }
    }

    private getHome = async (ctx: RouterContext) => {
        const sessionUser = await ctx.state.loggedUser;
        let welcomeMessage = "🦕 A simple template site written in Deno 🦕";
        if (sessionUser) {
            welcomeMessage = `🦕 Welcome to SmartDeno, ${sessionUser} 🦕`;
        }
        ctx.render("views/index.njk", {
            appname: "SmartDeno",
            appdescription: welcomeMessage,
            sessionUser,
        });
    }

    private getFeatures = (ctx: RouterContext) => {
        this.logger.info("GET /features");
        ctx.render("views/features.njk", {
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
        const qParams = ctx.request.url.searchParams;
        const error = qParams.get("error");
        this.logger.warn("Error == " + error);
        let loginErrors = false;
        if (error) loginErrors = true;
        this.logger.warn("loginErrors == " + loginErrors);
        ctx.render("views/login.njk", {
            appname: "SmartDeno",
            title: "Contact",
            loginErrors,
            description: "🦕 SmartDeno has been made by Alessio Saltarin <alessiosaltarin@gmail.com> 🦕"
        });
    }

    private getLogout = (ctx: RouterContext) => {
        this.logger.info("GET /logout");
        ctx.state.loggedUser = null;
        ctx.response.redirect("/");
    }

    private postLogin = async (ctx: RouterContext) => {
        this.logger.info("POST /login");
        if (ctx.request.hasBody) {
            const body = await ctx.request.body();
            const value: URLSearchParams = await body.value;
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
                ctx.state.loggedUser = user.username;
                this.logger.info("POST LOGIN Logged User is " + ctx.state.loggedUser);
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



