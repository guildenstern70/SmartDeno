/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */


export default class User {
    id: number;
    username: string;
    password: string;

    constructor(id: number, username: string, password: string) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public toString = () : string => {
        return `#${this.id} - ${this.username}`;
    }
}

