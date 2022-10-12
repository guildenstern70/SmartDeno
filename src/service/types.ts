import User from './user.ts';

/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

export interface IUser {
    username: string;
    password: string;
}

export interface UserDump {
    id?: Number,
    username?: string,
    password?: string,
    error?: string
}

export interface DataResponse {
    allUsers: AllUsers
}

export interface AllUsers {
    data: User[]
}

export interface UsersQuery {
    data: DataResponse,
    error?: string
}
