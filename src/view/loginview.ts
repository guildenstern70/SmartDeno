/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { View } from "./view.ts";

export class Loginview extends View
{
    html = `
            <div class="container">
            <div class="row d-flex justify-content-center">
                <div class="col-md-6">
                    <form class="loginform" action="/login" method="post">
                        <div class="mb-3">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" name="username" id="username"
                                   aria-describedby="usernameHelp">
                            <div id="usernameHelp" class="form-text">Try "guest" with password "guest".</div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">Password</label>
                            <input type="password" class="form-control" name="password" id="password">
                        </div>
                        <div class="mb-3 form-check">
                            <input type="checkbox" class="form-check-input" id="rememberme">
                            <label class="form-check-label" for="rememberme">Remember me</label>
                        </div>
                        <% if (it.loginerrors) { %>
                            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                                <strong>Error</strong> Unknown username or wrong password.
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                            </div>
                        <% } %>
                        <button type="submit" class="btn btn-primary">Login</button>
                    </form>
                </div>
            </div>
            <div class="mb-5">&nbsp;</div>
        </div>
        <script src="/js/login.js"></script>
    `;

}
