/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

// Routes
import { DyeLog, Router } from "../deps.ts";
import { render, renderFile, configure } from "../deps.ts";
import { IUser } from "../service/dto.ts";
import User from "../service/user.ts";
import UsersDb from "../service/userdb.ts";


export default class WebRouter extends Router {
    private readonly logger: DyeLog;
    private readonly usersDb: UsersDb;

    constructor(usersDb: UsersDb,
                logger: DyeLog) {
        super();
        this.logger = logger;
        this.usersDb = usersDb;

        // Eta Views
        configure({
            views: `${Deno.cwd()}/views`
        })

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
        this.logger.info("GET /index");

        const sessionUser = await ctx.state.loggedUser;
        let welcomeMessage = "🦕 A simple template site written in Deno 🦕";
        if (sessionUser) {
            welcomeMessage = `🦕 Welcome to SmartDeno, ${sessionUser} 🦕`;
        }

        ctx.response.headers.set("Content-Type", "text/html");
        ctx.response.body = await renderFile("index.eta", {
            appname: "SmartDeno",
            appdescription: welcomeMessage,
            sessionUser,
        });
    }

    private getFeatures = async (ctx: any) => {
        this.logger.info("GET /features");

        ctx.response.headers.set("Content-Type", "text/html");
        ctx.response.body = await renderFile("features.eta", {
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

    private getLogin = (ctx: any) => {
        this.logger.info("GET /login");
        const qParams = ctx.request.url.searchParams;
        const error = qParams.get("error");
        this.logger.warn("Error == " + error);
        let loginErrors = false;
        if (error) {
            loginErrors = true;
        }
        this.logger.warn("loginErrors == " + loginErrors);
        ctx.render("views/login.eta", {
            appname: "SmartDeno",
            title: "Contact",
            loginErrors,
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



