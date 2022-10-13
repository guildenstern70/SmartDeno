/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 *
 */

import User from "./user.ts";


export interface IUser
{
    username: string;
    password: string;
}

export interface UserDump
{
    id?: number,
    username?: string,
    password?: string,
    error?: string
}

export interface DataResponse
{
    allUsers: AllUsers;
}

export interface AllUsers
{
    data: User[];
}

export interface UsersQuery
{
    data: DataResponse,
    error?: string
}
