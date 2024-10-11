/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { Eta } from "eta";

export class View
{
    static render(templateName: string, data: object)
    {
        const eta = new Eta({ views: './static/templates' });
        return eta.render(templateName, data);
    }
}
