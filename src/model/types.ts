/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-23 Alessio Saltarin
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

export interface UserDumpResponse
{
    createUser: UserDump
}

export interface AllUsersData
{
    allUsers: AllIds
}

export interface UsersQuery
{
    data: DataResponse,
    error?: string
}

export interface IId
{
    _id: string
    id: number,
}

export interface DataResponse
{
    allUsers: AllUsers;
}

export interface IidResponse
{
    data: AllUsersData;
}

export interface AllUsers
{
    data: User[];
}

export interface AllIds
{
    data: IId[]
}

