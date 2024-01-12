/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-24 Alessio Saltarin
 * MIT License
 *
 */


export class Layoutview
{
    async get(): Promise<string>
    {
        const htmlBase = await Deno.readTextFile("./static/templates/base.eta");
        const htmlLayout =  await Deno.readTextFile("./static/templates/layout.eta");
        return htmlBase.replace("<%~ it.body %>", htmlLayout);
    }
}
