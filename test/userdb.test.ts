/*global Deno */
/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

import {
    assertEquals,
    assertExists
} from "https://deno.land/std@0.78.0/testing/asserts.ts";
import UsersDb from "../src/service/userdb.ts";


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
    assertEquals(user!.password, "yyy");
});

Deno.test("UsersDB User Remove", () => {
    const usersdb = new UsersDb();
    usersdb.add({username: "user1", password: "zzz"});
    usersdb.add({username: "user2", password: "yyy"});
    usersdb.add({username: "user3", password: "zzz"});
    const user = usersdb.getByUsername("user2");
    assertExists(user);
    usersdb.delete(user!.id.toString());
    assertEquals(usersdb.size(), 2);
});

Deno.test("UsersDB Get Unknown User", () => {
    const usersdb = new UsersDb();
    const user = usersdb.getByUsername("user-xxxxx");
    assertEquals(typeof user, "undefined");
});


