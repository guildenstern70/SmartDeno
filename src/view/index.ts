/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import {View} from "./view.ts";
import {Page} from "./page.ts";

export class Index implements View {

    private index = `
            <div class="container text-center">
                <div class="row">
                    <div class="col">
                        &nbsp;
                    </div>
                    <div class="col-8">
                        <h1 class="xtitle"><%= it.appname %></h1>
                        <p><%= it.appdescription %></p>
                        <img class="img-fluid" src="/img/cover_wide.jpeg" alt="Deno">
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
                        <p class="mt-2 py-2">
                            <a href="/features" class="btn btn-lg btn-secondary fw-bold border-white bg-white">Learn more</a>
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
                </div>
            </div>
            <script src="/js/index.js"></script>
        `;

    public get(): string {
        const page = new Page();
        return page.get().replace("<%~ it.body %>", this.index);
    }
}