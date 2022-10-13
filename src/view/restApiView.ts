/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */



import { View } from "./view.ts";
import { LayoutView } from "./layoutView.ts";


export class RestApiView implements View
{

    private restapi = `
           <div class="container">
           <div style="height: 200px">&nbsp;</div>
            <div class="row">
                <h4 class="mt-6 mb-4">Rest API</h4>
                <p>Get all users - <a href="/api/v1/user">/api/v1/user</a></p>
                <p>Get (existing) single user - <a href="/api/v1/user/guest">/api/v1/user/guest</a></p>
                <p>Get (non existing) single user - <a href="/api/v1/user/pippo">/api/v1/user/pippo</a></p>
            </div>
            <div style="height: 500px">&nbsp;</div>
           </div>
            `;

    get(): string
    {
        const page = new LayoutView();
        return page.get().replace("<%~ it.body %>", this.restapi);
    };
}

