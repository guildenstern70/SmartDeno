/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import { assertEquals, assertNotEquals } from "@std/assert";
import type { User } from "../src/model/types.ts";
import {
  ensureDefaultUsers,
  getTestApp,
  restoreKv,
  snapshotKv,
  testFetch,
} from "./helpers/test_helper.ts";

Deno.test("REST API - View and Create Users", async (t) => {
  const initialKv = await snapshotKv();
  await ensureDefaultUsers();
  const app = getTestApp();

  await t.step("GET /api/v1/user returns all registered users", async () => {
    const res = await testFetch(app, "/api/v1/user");
    assertEquals(res.status, 200);
    const users = (await res.json()) as User[];
    assertEquals(Array.isArray(users), true);

    const usernames = users.map((u) => u.username);
    assertEquals(usernames.includes("alessio"), true);
    assertEquals(usernames.includes("guest"), true);

    // Verify passwords stored are hashed, not plain text
    const guestUser = users.find((u) => u.username === "guest");
    assertNotEquals(guestUser?.password, "guest");
  });

  await t.step(
    "GET /api/v1/user/:username returns single existing user",
    async () => {
      const res = await testFetch(app, "/api/v1/user/alessio");
      assertEquals(res.status, 200);
      const user = (await res.json()) as User;
      assertEquals(user.username, "alessio");
      assertNotEquals(user.password, "doctor");
    },
  );

  await t.step(
    "GET /api/v1/user/:username returns 404 for nonexistent user",
    async () => {
      const res = await testFetch(app, "/api/v1/user/nonexistent_user_xyz");
      assertEquals(res.status, 404);
      const body = (await res.json()) as { message: string };
      assertEquals(
        body.message,
        "User with username=nonexistent_user_xyz not found.",
      );
    },
  );

  await t.step(
    "POST /api/v1/user creates a new user successfully",
    async () => {
      const newUserData = {
        username: "test_new_user",
        password: "secret_password_123",
      };

      const postRes = await testFetch(app, "/api/v1/user", {
        method: "POST",
        body: JSON.stringify(newUserData),
      });

      assertEquals(postRes.status, 201);
      const postBody = (await postRes.json()) as { message: string };
      assertEquals(
        postBody.message,
        "OK - User inserted with username = test_new_user",
      );

      // Verify user can now be retrieved
      const getRes = await testFetch(app, "/api/v1/user/test_new_user");
      assertEquals(getRes.status, 200);
      const createdUser = (await getRes.json()) as User;
      assertEquals(createdUser.username, "test_new_user");
      assertNotEquals(createdUser.password, "secret_password_123");

      // Clean up created user
      const delRes = await testFetch(app, "/api/v1/user/test_new_user", {
        method: "DELETE",
      });
      assertEquals(delRes.status, 200);
    },
  );

  await t.step(
    "POST /api/v1/user returns 400 when missing username or password",
    async () => {
      // Missing password
      const resMissingPass = await testFetch(app, "/api/v1/user", {
        method: "POST",
        body: JSON.stringify({ username: "user_without_pass" }),
      });
      assertEquals(resMissingPass.status, 400);

      // Missing username
      const resMissingUser = await testFetch(app, "/api/v1/user", {
        method: "POST",
        body: JSON.stringify({ password: "pass_without_user" }),
      });
      assertEquals(resMissingUser.status, 400);
    },
  );

  await t.step(
    "DELETE /api/v1/user/guest is rejected (protected user)",
    async () => {
      const res = await testFetch(app, "/api/v1/user/guest", {
        method: "DELETE",
      });
      assertEquals(res.status, 400);
      const body = (await res.json()) as { message: string };
      assertEquals(body.message, "KO - Cannot delete protected user 'guest'");
    },
  );

  // Restore KV state
  await restoreKv(initialKv);
});
