/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

import { IUser } from "./dto.ts";
import User from "./user.ts";

export default class UsersDb {

    private users: User[] = [];

    public add(newUser: IUser) {
        const id = this.users.length;
        const user = new User(id, newUser.username, newUser.password);
        this.users.push(user);
    }

    public getByUsername(username: string): User | undefined {
        const users = this.users.filter((user) => user.username === username);
        if (users.length < 1) {
            return undefined;
        }
        return users[0];
    }

    public get(id: string): User | undefined {
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return undefined;
        }
        const users = this.users.filter((user) => user.id === userId);
        if (users.length < 1) {
            return undefined;
        }
        return users[0];
    }

    public getAll(): User[] {
        return this.users;
    }

    public size(): number {
        return this.users.length;
    }

    public delete(id: string): boolean {
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return false;
        }
        const user = this.get(id);
        if (user == undefined) {
            return false;
        }
        this.users = this.users.filter( (obj) => obj !== user);
        return true;
    }

}
