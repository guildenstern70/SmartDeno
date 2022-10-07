/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import { IUser } from "./dto.ts";
import User from "./user.ts";
import { DyeLog } from '../deps.ts';

export default class UsersDb {

    private readonly USERS = "user";
    private users: User[];
    private logger: DyeLog;

    constructor()
    {
        this.logger = new DyeLog();
        this.users = [];
    }

    add(newUser: IUser) {
        this.getDb();
        const id = this.users.length;
        const user = new User(id, newUser.username, newUser.password);
        this.users.push(user);
        this.saveDb();
    }

    getByUsername(username: string): User | undefined {
        this.getDb();
        const filteredUsers = this.users.filter((user) => user.username === username);
        if (filteredUsers.length < 1) {
            return undefined;
        }
        return filteredUsers[0];
    }

    get(id: string): User | undefined {
        this.getDb();
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

    getAll(): User[] {
        this.getDb();
        return this.users;
    }

    size(): number {
        this.getDb();
        return this.users.length;
    }

    delete(id: string): boolean {
        this.getDb();
        const userId = parseInt(id);
        if (isNaN(userId)) {
            return false;
        }
        const user = this.get(id);
        if (user == undefined) {
            return false;
        }
        this.users = this.users.filter( (obj) => obj !== user);
        this.saveDb();
        return true;
    }

    private saveDb() {

        let count = 0;
        this.users.forEach( (user: User) => {
            localStorage.setItem(`${this.USERS}${count}-name`, user.username);
            localStorage.setItem(`${this.USERS}${count}-pwd`, user.password);
            localStorage.setItem(`${this.USERS}${count}-id`, user.id);
            count++;
        });
        localStorage.setItem("count", count);
        this.logger.info(`Saved ${count} item(s) to UsersDb`);

    }

    private getDb() {

        const count = parseInt(localStorage.getItem("count"));
        this.users = [];
        for (let j=0; j < count; j++) {
            const user = new User();
            user.username = localStorage.getItem(`${this.USERS}${j}-name`);
            user.password = localStorage.getItem(`${this.USERS}${j}-pwd`);
            user.id = parseInt(localStorage.getItem(`${this.USERS}${j}-id`));
            this.users.push(user);
        }
        this.logger.info(`Read ${count} item(s) from UsersDb`);
    }


}
