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

Deno.test("Home Page Appearance", async (t) => {
  const initialKv = await snapshotKv();
  await ensureDefaultUsers();
  const app = getTestApp();

  await t.step("renders 200 OK and text/html header", async () => {
    const res = await testFetch(app, "/");
    assertEquals(res.status, 200);
    const contentType = res.headers.get("content-type");
    assertStringIncludes(contentType ?? "", "text/html");
  });

  await t.step("displays brand identity and navbar links", async () => {
    const res = await testFetch(app, "/");
    const html = await res.text();

    // Brand and logo
    assertStringIncludes(html, "SmartDeno");
    assertStringIncludes(html, "🦕");

    // Masthead navigation items
    assertStringIncludes(html, 'id="menuitem0"');
    assertStringIncludes(html, 'href="/"');
    assertStringIncludes(html, 'id="menuitem1"');
    assertStringIncludes(html, 'href="/features"');
    assertStringIncludes(html, 'id="menuitem2"');
    assertStringIncludes(html, 'href="/restapi"');
    assertStringIncludes(html, 'id="menuitem3"');
    assertStringIncludes(html, 'href="/login"');
  });

  await t.step(
    "displays hero section and call-to-action for unauthenticated user",
    async () => {
      const res = await testFetch(app, "/");
      const html = await res.text();

      assertStringIncludes(
        html,
        'The <span class="hero-highlight">smart</span> way to build Deno apps.',
      );
      assertStringIncludes(
        html,
        "A starter template for Deno Deploy solutions.",
      );
      assertStringIncludes(
        html,
        "SmartDeno combines Deno KV, Oak HTTP, Eta templates",
      );

      // Action buttons
      assertStringIncludes(html, 'href="/features"');
      assertStringIncludes(html, "Get Started");
      assertStringIncludes(html, 'href="/login"');
      assertStringIncludes(html, "Sign In");
    },
  );

  await t.step(
    "displays interactive counter demo and showcase cover image",
    async () => {
      const res = await testFetch(app, "/");
      const html = await res.text();

      assertStringIncludes(html, "Interactive Counter");
      assertStringIncludes(html, 'id="btn-decrement"');
      assertStringIncludes(html, 'id="counter-value"');
      assertStringIncludes(html, 'id="btn-increment"');

      // Showcase cover image
      assertStringIncludes(html, "/img/cover_wide.jpeg");
      assertStringIncludes(html, 'alt="Deno cover illustration"');
    },
  );

  await t.step("displays footer with Deno link and copyright", async () => {
    const res = await testFetch(app, "/");
    const html = await res.text();

    assertStringIncludes(html, "powered by");
    assertStringIncludes(html, "https://deno.land/");
    assertStringIncludes(html, "SmartDeno.");
  });

  await t.step(
    "displays authenticated greeting and state when user is logged in",
    async () => {
      // 1. Log in as 'guest' to receive session cookie
      const loginRes = await testFetch(app, "/login", {
        method: "POST",
        body: new URLSearchParams({ username: "guest", password: "guest" }),
      });
      const sessionCookie = extractSessionCookie(loginRes);
      assertEquals(typeof sessionCookie, "string");

      // 2. Fetch home page with session cookie
      const homeRes = await testFetch(app, "/", { cookie: sessionCookie! });
      assertEquals(homeRes.status, 200);
      const html = await homeRes.text();

      // Hero displays welcome message with username
      assertStringIncludes(html, "Welcome to SmartDeno, ");
      assertStringIncludes(html, '<strong class="text-dark">guest</strong>');

      // Action button switched to REST API explorer
      assertStringIncludes(html, 'href="/restapi"');
      assertStringIncludes(html, "Explore REST API");

      // Navbar displays Logout
      assertStringIncludes(html, 'href="/logout"');
      assertStringIncludes(html, "Logout");

      // Footer shows session status
      assertStringIncludes(
        html,
        'You are logged in as <b class="text-dark">guest</b>.',
      );
    },
  );

  // Restore KV state
  await restoreKv(initialKv);
});
