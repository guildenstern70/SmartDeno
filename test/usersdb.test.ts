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
import UsersDb from '../src/usersdb.ts';


Deno.test("UsersDB User Add", () => {
    const usersdb = new UsersDb();
    usersdb.add("user1", "zzz");
    usersdb.add("user2", "zzz");
    usersdb.add("user3", "zzz");
    assertEquals(usersdb.size(), 3);
});

Deno.test("UsersDB User Get", () => {
    const usersdb = new UsersDb();
    usersdb.add("user1", "zzz");
    usersdb.add("user2", "yyy");
    usersdb.add("user3", "zzz");
    const user = usersdb.getByUsername("user2");
    assertEquals(user!.password, "yyy")
});

Deno.test("UsersDB User Remove", () => {
    const usersdb = new UsersDb();
    usersdb.add("user1", "zzz");
    usersdb.add("user2", "zzz");
    usersdb.add("user3", "zzz");
    const user = usersdb.getByUsername("user2");
    usersdb.delete(user!.id);
    assertEquals(usersdb.size(), 2)
});


