/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import { Layoutview } from "./layout/layoutview.ts";

export abstract class View
{
    protected html = "";  // Override this to implement HTML views using ETA

    get(): string
    {
        const page = new Layoutview();
        return page.get().replace("<%~ it.body %>", this.html);
    }
}
