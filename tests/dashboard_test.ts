/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import { assertEquals, assertStringIncludes } from "@std/assert";
import {
  ensureDefaultUsers,
  extractSessionCookie,
  getTestApp,
  restoreKv,
  snapshotKv,
  testFetch,
} from "./helpers/test_helper.ts";

Deno.test("Dashboard Page", async (t) => {
  const initialKv = await snapshotKv();
  await ensureDefaultUsers();
  const app = getTestApp();

  await t.step("redirects unauthenticated user to /login", async () => {
    const res = await testFetch(app, "/dashboard");
    assertEquals(res.status, 302);
    assertEquals(res.headers.get("location"), "/login");
  });

  await t.step("renders dashboard with stats, charts and logout menu for logged in user", async () => {
    const loginRes = await testFetch(app, "/login", {
      method: "POST",
      body: new URLSearchParams({ username: "guest", password: "guest" }),
    });
    const sessionCookie = extractSessionCookie(loginRes);

    const dashRes = await testFetch(app, "/dashboard", { cookie: sessionCookie! });
    assertEquals(dashRes.status, 200);
    const html = await dashRes.text();

    assertStringIncludes(html, "User Dashboard");
    assertStringIncludes(html, '<strong class="text-dark">guest</strong>');
    assertStringIncludes(html, "Total Users");
    assertStringIncludes(html, "API Requests");
    assertStringIncludes(html, "Weekly Traffic Analytics");
    assertStringIncludes(html, "Server Performance");
    assertStringIncludes(html, 'href="/logout"');
    assertStringIncludes(html, "Logout");
  });

  await restoreKv(initialKv);
});
