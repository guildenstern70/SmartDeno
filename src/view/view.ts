/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Layoutview } from "./layout/layoutview.ts";

export abstract class View
{
    protected etaTemplatePath = "";  // Override this to read ETA template files

    async get(): Promise<string>
    {
        const layout = new Layoutview();
        const html =  await Deno.readTextFile(this.etaTemplatePath);
        return layout.get().replace("<%~ it.body %>", html);
    }
}
