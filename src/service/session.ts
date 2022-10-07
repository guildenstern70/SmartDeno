/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

export class Session {

    static getItem(itemName: string): string {
        return localStorage.getItem(itemName);
    }

    static setItem(itemName: string, itemValue: string): void {
        localStorage.setItem(itemName, itemValue);
    }
}
