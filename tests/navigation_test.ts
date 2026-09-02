/*
 * Smart Deno - Unit Tests: Navigation Between Pages
 * Verifies routing across all main views, active menu items, and redirection.
 */

import { assertEquals, assertStringIncludes } from "@std/assert";
import {
  ensureDefaultUsers,
  getTestApp,
  restoreKv,
  snapshotKv,
  testFetch,
} from "./helpers/test_helper.ts";

Deno.test("Navigation Between Pages", async (t) => {
  const initialKv = await snapshotKv();
  await ensureDefaultUsers();
  const app = getTestApp();

  await t.step("navigates to Home page (/)", async () => {
    const res = await testFetch(app, "/");
    assertEquals(res.status, 200);
    const html = await res.text();
    assertStringIncludes(
      html,
      'The <span class="hero-highlight">smart</span> way to build Deno apps.',
    );
  });

  await t.step("navigates to Features page (/features)", async () => {
    const res = await testFetch(app, "/features");
    assertEquals(res.status, 200);
    const html = await res.text();

    // Verify page header and tech stack cards
    assertStringIncludes(html, "Features");
    assertStringIncludes(html, "Deno");
    assertStringIncludes(html, "Bootstrap");
    assertStringIncludes(html, "Oak");
    assertStringIncludes(html, "Oak Sessions");
    assertStringIncludes(html, "Eta");
    assertStringIncludes(html, "DyeLog");

    // Verify Deno KV stats section
    assertStringIncludes(html, "Deno KV Database");
    assertStringIncludes(html, "Users");
  });

  await t.step("navigates to REST API explorer page (/restapi)", async () => {
    const res = await testFetch(app, "/restapi");
    assertEquals(res.status, 200);
    const html = await res.text();

    // Verify explorer sections and endpoints
    assertStringIncludes(html, "REST API Explorer");
    assertStringIncludes(html, "/api/v1/user");
    assertStringIncludes(html, "/api/v1/user/guest");
    assertStringIncludes(html, "Querying Users");
    assertStringIncludes(html, "Modifying Database");
  });

  await t.step("navigates to Login page (/login)", async () => {
    const res = await testFetch(app, "/login");
    assertEquals(res.status, 200);
    const html = await res.text();

    // Verify sign in card
    assertStringIncludes(html, "Sign In");
    assertStringIncludes(html, 'action="/login"');
    assertStringIncludes(html, 'method="post"');
    assertStringIncludes(html, 'name="username"');
    assertStringIncludes(html, 'name="password"');
  });

  await t.step(
    "navigates to Logout (/logout) and redirects to home",
    async () => {
      const res = await testFetch(app, "/logout");
      // Oak redirect returns 302
      assertEquals(res.status, 302);
      assertEquals(res.headers.get("location"), "/");
    },
  );

  await t.step("serves static CSS stylesheet (/css/styles.css)", async () => {
    const res = await testFetch(app, "/css/styles.css");
    assertEquals(res.status, 200);
    const css = await res.text();
    assertStringIncludes(css, "--smart-yellow");
  });

  // Restore KV state
  await restoreKv(initialKv);
});
