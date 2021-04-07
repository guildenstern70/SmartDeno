/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

import User from './user.ts';

export default class UsersDb {

    private users: User[] = [];

    public add(username: string, password: string) {
        const id = this.users.length;
        const user = new User(id, username, password);
        this.users.push(user);
    }

    public getByUsername(username: string): User|undefined {
        const users = this.users.filter( user => user.username == username )
        if (users.length < 1)
            return undefined;
        return users[0]
    }

    public get(id: number): User|undefined {
        const users = this.users.filter( user => user.id == id )
        if (users.length < 1)
            return undefined;
        return users[0]
    }

    public getAll(): User[]
    {
        return this.users;
    }

    public size(): number
    {
        return this.users.length;
    }

    public delete(id: number): boolean {
        const user = this.get(id);
        if (user == undefined)
            return false;
        this.users = this.users.filter(obj => obj !== user);
        return true;
    }

}
