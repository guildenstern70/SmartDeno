/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import {View} from "./view.ts";
import {Page} from "./page.ts";

export class Features implements View {

    private features = `
           <div class="container text-center">
            <div class="row">
                <div class="col">
                    &nbsp;
                </div>
                <div class="col-8">
                    <h1 class="xtitle"><%= it.title %></h1>
                    <p><%= it.description %></p>
                </div>
                <div class="col">
                    &nbsp;
                </div>
            </div>
            <div class="row">
                <div class="col">
                    &nbsp;
                </div>
                <div class="col-5">
                    <p class="mt-2 py-3">
                        <ul class="list-group features">
                            <% Object.keys(it.features).forEach((f) => { %>
                                <li class="list-group-item"><a href="<%= f %>" target="_blank"><%= it.features[f]  %></a></li>
                            <% }) %>
                        </ul>
                    </p>
                </div>
                <div class="col">
                    &nbsp;
                </div>
            </div>
            <div class="row">
                <div class="col">
                    &nbsp;
                </div>
                <div class="col-8">
                    &nbsp;
                </div>
                <div class="col">
                    &nbsp;
                </div>
            </div>
            <div class="row featuresfiller">
                <div class="col">
                    &nbsp;
                </div>
            </div>
        </div>
        <script src="/js/features.js"></script>
     `;

    public get(): string {
        const page = new Page();
        return page.get().replace("<%~ it.body %>", this.features);
    }
}