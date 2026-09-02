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

Deno.test("Login and Authentication Flow", async (t) => {
  const initialKv = await snapshotKv();
  await ensureDefaultUsers();
  const app = getTestApp();

  await t.step("GET /login displays login form", async () => {
    const res = await testFetch(app, "/login");
    assertEquals(res.status, 200);
    const html = await res.text();
    assertStringIncludes(html, "Sign In");
    assertStringIncludes(html, 'name="username"');
    assertStringIncludes(html, 'name="password"');
  });

  await t.step(
    "POST /login succeeds with valid guest credentials",
    async () => {
      const res = await testFetch(app, "/login", {
        method: "POST",
        body: new URLSearchParams({ username: "guest", password: "guest" }),
      });

      // Expect redirect to home
      assertEquals(res.status, 302);
      assertEquals(res.headers.get("location"), "/");

      // Expect session cookie to be set
      const cookie = extractSessionCookie(res);
      assertEquals(typeof cookie, "string");
      assertStringIncludes(cookie!, "session=");
    },
  );

  await t.step(
    "POST /login succeeds with valid alessio credentials",
    async () => {
      const res = await testFetch(app, "/login", {
        method: "POST",
        body: new URLSearchParams({ username: "alessio", password: "doctor" }),
      });

      assertEquals(res.status, 302);
      assertEquals(res.headers.get("location"), "/");
      const cookie = extractSessionCookie(res);
      assertEquals(typeof cookie, "string");
    },
  );

  await t.step("POST /login fails with incorrect password", async () => {
    const res = await testFetch(app, "/login", {
      method: "POST",
      body: new URLSearchParams({
        username: "guest",
        password: "wrongpassword",
      }),
    });

    // Expect redirect to /login with error query param
    assertEquals(res.status, 302);
    assertEquals(res.headers.get("location"), "/login?error=notfound");
  });

  await t.step("POST /login fails with nonexistent user", async () => {
    const res = await testFetch(app, "/login", {
      method: "POST",
      body: new URLSearchParams({ username: "unknown_user", password: "foo" }),
    });

    assertEquals(res.status, 302);
    assertEquals(res.headers.get("location"), "/login?error=notfound");
  });

  await t.step(
    "GET /login?error=notfound displays sign-in error alert",
    async () => {
      const res = await testFetch(app, "/login?error=notfound");
      assertEquals(res.status, 200);
      const html = await res.text();

      assertStringIncludes(html, "Sign-in failed.");
      assertStringIncludes(html, "Please check your username and password.");
    },
  );

  await t.step("POST /login fails with empty body", async () => {
    const res = await testFetch(app, "/login", {
      method: "POST",
    });

    assertEquals(res.status, 302);
    assertEquals(res.headers.get("location"), "/login?error=notfound");
  });

  await t.step("GET /logout clears user session", async () => {
    // 1. Log in
    const loginRes = await testFetch(app, "/login", {
      method: "POST",
      body: new URLSearchParams({ username: "guest", password: "guest" }),
    });
    const sessionCookie = extractSessionCookie(loginRes);

    // 2. Access home while logged in
    const homeBeforeLogout = await testFetch(app, "/", {
      cookie: sessionCookie!,
    });
    const htmlBefore = await homeBeforeLogout.text();
    assertStringIncludes(
      htmlBefore,
      'You are logged in as <b class="text-dark">guest</b>.',
    );

    // 3. Logout
    const logoutRes = await testFetch(app, "/logout", {
      cookie: sessionCookie!,
    });
    assertEquals(logoutRes.status, 302);
    assertEquals(logoutRes.headers.get("location"), "/");

    // 4. Access home again with session: logged-user was unset
    const homeAfterLogout = await testFetch(app, "/", {
      cookie: sessionCookie!,
    });
    const htmlAfter = await homeAfterLogout.text();
    assertStringIncludes(
      htmlAfter,
      "A starter template for Deno Deploy solutions.",
    );
  });

  // Restore KV state
  await restoreKv(initialKv);
});
