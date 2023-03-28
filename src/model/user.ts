/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

export default class User
{
    id: number;
    username: string;
    password: string;

    constructor(id: number, username: string, password: string)
    {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    toString = (): string =>
    {
        return `#${this.id} - ${this.username}`;
    };
}

