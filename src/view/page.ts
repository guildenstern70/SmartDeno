/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import {View} from "./view.ts";
import {Base} from "./base.ts";

export class Page implements View {

    private page = `
        <div class="cover-container d-flex w-100 h-100 p-3 mx-auto flex-column">
            <header class="mb-auto">
                <div>
                    <h3 class="float-md-start mb-0 xtitle"><%= it.appname %></h3>
                    <nav class="nav nav-masthead justify-content-center float-md-end mr-4">
                        <a id="menuitem0" class="nav-link active" aria-current="page" href="/">Home</a>
                        <a id="menuitem1" class="nav-link" href="/features">Features</a>
                        <% if (it.sessionUser) { %>
                            <a id="menuitem2" class="nav-link" href="/logout">Logout</a>
                        <% } else { %>
                            <a id="menuitem2" class="nav-link" href="/login">Login</a>
                        <% } %>
                    </nav>
                </div>
            </header>
            <main class="px-3">
                <%~ it.body %>
            </main>
            <footer class="mt-auto text-white-50">
                <div class="text-end">
                    <% if (it.sessionUser) { %>
                        You are logged as <b><%= it.sessionUser %></b>. <a href="/logout">Logout</a>.
                    <% } else { %>
                            <%= it.appname %> Powered by 
                            <a href="https://deno.land/" target="_blank" class="text-white">Deno</a>.
                    <% } %>
                </div>
            </footer>
        </div>
        `;

    public get(): string {
        const base = new Base();
        return base.get().replace("<%~ it.body %>", this.page);
    }
}