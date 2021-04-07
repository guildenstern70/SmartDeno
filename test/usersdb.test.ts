/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020-21 Alessio Saltarin
 * MIT License
 */

import {
    assertEquals,
} from "https://deno.land/std@0.78.0/testing/asserts.ts";
import UsersDb from '../src/service/usersdb.ts';


Deno.test("UsersDB User Add", () => {
    const usersdb = new UsersDb();
    usersdb.add({ username: "user1", password: "zzz"});
    usersdb.add({ username: "user2", password: "zzz"});
    usersdb.add({ username: "user3", password: "zzz"});
    assertEquals(usersdb.size(), 3);
});

Deno.test("UsersDB User Get", () => {
    const usersdb = new UsersDb();
    usersdb.add({ username: "user1", password: "zzz"});
    usersdb.add({ username: "user2", password: "yyy"});
    usersdb.add({ username: "user3", password: "zzz"});
    const user = usersdb.getByUsername("user2");
    assertEquals(user!.password, "yyy")
});

Deno.test("UsersDB User Remove", () => {
    const usersdb = new UsersDb();
    usersdb.add({ username: "user1", password: "zzz"});
    usersdb.add({ username: "user2", password: "yyy"});
    usersdb.add({ username: "user3", password: "zzz"});
    const user = usersdb.getByUsername("user2");
    usersdb.delete(user!.id.toString());
    assertEquals(usersdb.size(), 2)
});


