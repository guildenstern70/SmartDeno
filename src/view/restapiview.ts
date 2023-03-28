/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */



import { View } from "./view.ts";


export class Restapiview extends View
{

    html = `
           <div class="container">
            <div class="row">
                <div style="height: 80px">&nbsp;</div>
                <h4 class="mt-6 mb-4 text-secondary">SmartDeno - Rest API</h4>
                <ul>
                    <li><p>Get all users - <a href="/api/v1/user">HTTP GET: api/v1/user</a></p></li>
                    <li><p>Get (existing) single user - <a href="/api/v1/user/guest">HTTP GET: /api/v1/user/guest</a></p></li>
                    <li><p>Get (non existing) single user - <a href="/api/v1/user/pippo">HTTP GET: /api/v1/user/pippo</a></p></li>
                </ul>
                <p class="mt-4 text-secondary">
                    You can also try (using a REST client, like <a href="https://www.postman.com/" target="_blank">Postman</a>)
                </p>
                <ul>
                <li><p>Create new user - <span class="text-info">HTTP POST <i>/api/v1/user</i></span></p></li>
                </ul>
                <p class="text-secondary">With JSON body</p>
                <code>
                    {
                       "username": "my_new_user",
                       "password": "my_new_password"
                    }
                </code>
                <ul class="mt-4">
                <li><p>Delete existing user - <span class="text-info">HTTP DELETE <i>/api/v1/user/:username</i></span></p></li>
                </ul>
                
                <p class="text-secondary">Where</p>
                <code>
                    :username = existing username
                </code>
            </div>
           </div>
           <script src="/js/restapi.js"></script>
            `;

}

