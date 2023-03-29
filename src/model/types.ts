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

export interface AllUsers
{
    data: User[];
}

export interface UserDump
{
    id?: number,
    username?: string,
    password?: string,
    first_name?: string,
    last_name?: string,
    group?: string,
    error?: string
}

export interface FaunaUser
{
    username: string,
    password: string,
    first_name?: string,
    last_name?: string,
    group?: string,
    id?: number
}

export interface IId
{
    _id: string
    id: number,
}

export interface AllIds
{
    data: IId[]
}

export interface AllUsersData
{
    allUsers: AllIds
}

export interface DataResponse
{
    allUsers: AllUsers;
}

export interface UsersQuery
{
    data: DataResponse,
    error?: string
}

export interface IidResponse
{
    data: AllUsersData;
}



