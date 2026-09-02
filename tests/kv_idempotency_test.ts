/*
 * Smart Deno - Unit Tests: KV Database Idempotency
 * Explicitly verifies that test operations leave the KV database in the exact state it was found.
 */

import { assertEquals } from "@std/assert";
import {
  ensureDefaultUsers,
  getTestApp,
  restoreKv,
  snapshotKv,
  testFetch,
} from "./helpers/test_helper.ts";

Deno.test("KV Database Idempotency", async (t) => {
  // Capture initial status of the KV database
  const baselineKv = await snapshotKv();
  await ensureDefaultUsers();
  const readyKv = await snapshotKv();

  const app = getTestApp();

  await t.step(
    "database returns to initial status after write operations",
    async () => {
      // 1. Create a user via REST API
      const postRes = await testFetch(app, "/api/v1/user", {
        method: "POST",
        body: JSON.stringify({
          username: "temp_idempotency_user",
          password: "temp_password_999",
        }),
      });
      assertEquals(postRes.status, 201);

      // Verify user was indeed added to KV
      const duringKv = await snapshotKv();
      assertEquals(duringKv.length, readyKv.length + 1);

      // 2. Perform restore to verify idempotent cleanup
      await restoreKv(readyKv);

      // 3. Verify database status matches pre-write snapshot exactly
      const afterKv = await snapshotKv();
      assertEquals(afterKv.length, readyKv.length);

      // Check every key-value entry matches
      assertEquals(
        JSON.stringify(
          afterKv.sort((a, b) =>
            JSON.stringify(a.key).localeCompare(JSON.stringify(b.key))
          ),
        ),
        JSON.stringify(
          readyKv.sort((a, b) =>
            JSON.stringify(a.key).localeCompare(JSON.stringify(b.key))
          ),
        ),
      );
    },
  );

  // Finally restore to the exact state before this test file was executed
  await restoreKv(baselineKv);
});
