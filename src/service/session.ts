/**
 * Smart Deno
 * A template project for DENO
 * Copyright (c) 2020-22 Alessio Saltarin
 * MIT License
 */

export class Session {

    static getItem(itemName: string): string {
        return sessionStorage.getItem(itemName);
    }

    static removeItem(itemName: string): void {
        sessionStorage.removeItem(itemName);
    }

    static setItem(itemName: string, itemValue: string): void {
        sessionStorage.setItem(itemName, itemValue);
    }
}
