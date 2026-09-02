/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import type { Application } from "@oak/oak";
import { DyeLog, LogLevel } from "@littlelite/dyelog";
import { type AppState, createApp } from "../../src/main.ts";
import { DenoKV } from "../../src/db/denokv.ts";

export type KvEntrySnapshot = {
  key: Deno.KvKey;
  value: unknown;
};

// Create an error-only logger during tests to keep console test output clean
export const testLogger = new DyeLog({
  timestamp: false,
  printlevel: false,
  level: LogLevel.ERROR,
});

/**
 * Creates an instance of the SmartDeno Oak application configured for testing.
 */
export function getTestApp(): Application<AppState> {
  return createApp(testLogger);
}

/**
 * Takes a snapshot of all entries currently stored in the Deno KV database.
 */
export async function snapshotKv(): Promise<KvEntrySnapshot[]> {
  const kv = await Deno.openKv();
  try {
    const entries = kv.list({ prefix: [] });
    const snapshot: KvEntrySnapshot[] = [];
    for await (const entry of entries) {
      snapshot.push({
        key: entry.key,
        value: entry.value,
      });
    }
    return snapshot;
  } finally {
    kv.close();
  }
}

/**
 * Restores the Deno KV database to the exact state captured in the provided snapshot.
 */
export async function restoreKv(snapshot: KvEntrySnapshot[]): Promise<void> {
  const kv = await Deno.openKv();
  try {
    // 1. Delete all current keys in the KV database
    const currentEntries = kv.list({ prefix: [] });
    for await (const entry of currentEntries) {
      await kv.delete(entry.key);
    }
    // 2. Restore entries from the snapshot
    for (const entry of snapshot) {
      await kv.set(entry.key, entry.value);
    }
  } finally {
    kv.close();
  }
}

/**
 * Ensures default users exist in KV database (seeds them if empty).
 */
export async function ensureDefaultUsers(): Promise<void> {
  const denokv = DenoKV.Create(testLogger);
  const users = await denokv.getAllUsers();
  if (!users || users.length === 0) {
    await denokv.createDefaultUsers();
  }
}

/**
 * Extracts session cookie (name=value) from the Response `Set-Cookie` header.
 */
export function extractSessionCookie(res: Response): string | null {
  const setCookie = res.headers.get("set-cookie");
  if (!setCookie) return null;
  // Extract the first part: "session=..."
  return setCookie.split(";")[0].trim();
}

/**
 * Helper to dispatch an HTTP request to the Oak app.
 */
export async function testFetch(
  app: Application<AppState>,
  path: string,
  options: {
    method?: string;
    headers?: Record<string, string>;
    body?: string | FormData | URLSearchParams;
    cookie?: string;
  } = {},
): Promise<Response> {
  const url = path.startsWith("http") ? path : `http://localhost${path}`;
  const headers = new Headers(options.headers || {});

  if (options.cookie) {
    headers.set("Cookie", options.cookie);
  }

  let body: BodyInit | undefined = undefined;
  if (options.body) {
    if (typeof options.body === "string") {
      body = options.body;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
      }
    } else if (options.body instanceof URLSearchParams) {
      body = options.body.toString();
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/x-www-form-urlencoded");
      }
    } else {
      body = options.body;
    }
  }

  const req = new Request(url, {
    method: options.method ?? "GET",
    headers,
    body,
  });

  const res = await app.handle(req);
  if (!res) {
    throw new Error(
      `No response returned by Oak application for ${
        options.method ?? "GET"
      } ${path}`,
    );
  }
  return res;
}
