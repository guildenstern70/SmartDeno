// deno-lint-ignore-file no-explicit-any
/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

// Routes
import User from "../service/user.ts";
import UsersDb from "../service/userdb.ts";
import { Features } from "../view/features.ts";
import { IUser } from "../service/dto.ts";
import { Index } from "../view/index.ts";
import { Login } from "../view/login.ts";
import { render } from "../deps.ts";
import { DyeLog, Router } from "../deps.ts";


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
                .get("/logout", this.getLogout);

        } catch (err) {
            this.logger.error("ERROR");
            this.logger.error(err);
        }
    }

    private getHome = async (ctx: any) => {
        this.logger.info("GET /home");

        const sessionUser = "";
        let welcomeMessage = "🦕 A simple template site written in Deno 🦕";
        if (sessionUser) {
            welcomeMessage = `🦕 Welcome to SmartDeno, ${sessionUser} 🦕`;
        }

        ctx.response.headers.set("Content-Type", "text/html");
        const indexEta = new Index().get();
        ctx.response.body = await render(indexEta, {
            appname: "SmartDeno",
            appdescription: welcomeMessage,
            sessionUser
        });
    }

    private getFeatures = async (ctx: any) => {
        this.logger.info("GET /features");

        ctx.response.headers.set("Content-Type", "text/html");
        const featuresEta = new Features().get();
        ctx.response.body = await render(featuresEta, {
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

    private getLogin = async (ctx: any) => {
        this.logger.info("GET /login");
        const qParams = ctx.request.url.searchParams;
        const error = qParams.get("error");
        this.logger.warn("Error == " + error);
        let loginErrors = false;
        if (error) {
            loginErrors = true;
        }
        this.logger.warn("loginErrors == " + loginErrors);

        ctx.response.headers.set("Content-Type", "text/html");
        const loginEta = new Login().get();
        ctx.response.body = await render(loginEta, {
            appname: "SmartDeno",
            title: "Contact",
            description: "🦕 SmartDeno has been made by Alessio Saltarin <alessiosaltarin@gmail.com> 🦕"
        });

    }

    private getLogout = (ctx: any) => {
        this.logger.info("GET /logout");
        ctx.state.loggedUser = null;
        ctx.response.redirect("/");
    }

    private postLogin = async (ctx: any) => {
        this.logger.info("POST /login");
        if (ctx.request.hasBody) {
            const value: URLSearchParams = await ctx.request.body().value;
            if (typeof value === "undefined") {
                this.logger.info("Unknown form parameters");
                ctx.response.redirect("/login?error=notfound");
            }
            const posteduser: IUser = {
                username: value.get("username")!,
                password: value.get("password")!,
            };
            if (this.checkLogin(posteduser)) {
                this.logger.info("Ok, user logged in.");
                ctx.state.loggedUser = posteduser.username;
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

    private checkLogin(postedUser: IUser): boolean {
        this.logger.info("Got login request with User=" + postedUser.username
            + " and password=" + postedUser.password);
        const user: User | undefined = this.usersDb.getByUsername(postedUser.username);
        return (typeof user !== "undefined") &&
            (user.password === postedUser.password);

    }
}



