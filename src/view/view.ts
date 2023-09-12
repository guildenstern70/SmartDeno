/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Layoutview } from "./layout/layoutview.ts";
import { render } from "eta";

export class View
{
    static async render(etaTemplatePath: string, data: Record<string, string>)
    {
        const html = await View.get(etaTemplatePath);
        return render(html, data);
    }

    private static async get(etaTemplatePath: string): Promise<string>
    {
        const layout = new Layoutview();
        const html =  await Deno.readTextFile(etaTemplatePath);
        const layoutHtml = await layout.get();
        return layoutHtml.replace("<%~ it.body %>", html);
    }

}
