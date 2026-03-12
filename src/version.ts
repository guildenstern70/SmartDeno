/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

import denoConfig from "../deno.json" with { type: "json" };

const configuredVersion = denoConfig.version;

if (typeof configuredVersion !== "string" || configuredVersion.trim() === "") {
  throw new Error("Missing or invalid 'version' in deno.json");
}

export const VERSION = configuredVersion;
