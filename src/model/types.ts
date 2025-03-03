/*
 *
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-25 Alessio Saltarin
 * MIT License
 *
 */


export interface User
{
    username: string;
    password: string;
}

export interface AllUsers
{
    data: User[];
}

export interface KVRecord {
    key: string[]
    value: User
    versionstamp: string
}





