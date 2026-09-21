/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import { Page } from "./page.ts";
import type { DyeLog } from "@littlelite/dyelog";
import type { RouterContext } from "@oak/oak";

export class Dashboard extends Page {
  constructor(logger: DyeLog, ctx: RouterContext<any>) {
    super(logger, ctx);
    this.template = "./dashboard";
  }

  async render() {
    this.logger.info("GET /dashboard");
    await this.initializeSession();

    if (!this.sessionUser) {
      this.logger.info("Unauthenticated user accessing /dashboard, redirecting to /login");
      this.ctx.response.redirect("/login");
      return;
    }

    const dashboardStats = [
      { title: "Total Users", value: "1,284", change: "+12%", icon: "👥" },
      { title: "API Requests", value: "48.2k", change: "+8%", icon: "⚡" },
      { title: "Server Uptime", value: "99.98%", change: "Optimal", icon: "🟢" },
      { title: "KV Storage Usage", value: "24.5 MB", change: "2.4% of cap", icon: "🗄️" },
    ];

    const recentActivity = [
      { time: "2 mins ago", event: "User login", detail: `${this.sessionUser} authenticated successfully`, status: "Success" },
      { time: "15 mins ago", event: "KV Store Sync", detail: "Database backup completed", status: "Success" },
      { time: "1 hour ago", event: "API Request", detail: "GET /api/v1/user", status: "200 OK" },
      { time: "3 hours ago", event: "System Health Check", detail: "All services operational", status: "Success" },
    ];

    this.ctx.response.body = this.eta({
      dashboardStats,
      recentActivity,
    });
  }
}
