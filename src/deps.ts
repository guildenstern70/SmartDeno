/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */


export { Application, Router, Status, send } from "https://deno.land/x/oak@v10.6.0/mod.ts";
export { cyan, gray, red, yellow } from "https://deno.land/std@0.148.0/fmt/colors.ts";
export { sprintf } from "https://deno.land/std@0.148.0/fmt/printf.ts";
export { DyeLog, LogLevel } from "https://deno.land/x/dyelog@v0.1.3/mod.ts";
export { render } from "https://deno.land/x/eta@v1.12.3/mod.ts";

export type { RouterContext } from "https://deno.land/x/oak@v10.6.0/mod.ts";
