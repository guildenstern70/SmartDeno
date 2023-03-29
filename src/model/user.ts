/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
 * MIT License
 *
 */

import { FaunaUser } from './types.ts';

export default class User
{
    public id: number;
    public username: string;
    public password: string;
    public name: string;
    public surname: string;
    public group: string;

    public constructor(init?:Partial<User>) {
        Object.assign(this, init);
    }

    toFaunaUser = (): FaunaUser => {
        let faunaId = this.id;
        if (this.id == undefined) {
            faunaId = Math.floor(Math.random() * 9000000);
        }
        return {
            username: this.username,
            password: this.password,
            first_name: this.name,
            last_name: this.surname,
            group: this.group,
            id: faunaId,
        };
    };

    toString = (): string =>
    {
        return `#${this.username} - ${this.name} ${this.surname}`;
    };
}

