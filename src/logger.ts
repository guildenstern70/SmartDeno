/**
 * Smart Deno
 * A template project for DENO
 *
 * Copyright (c) 2020 Alessio Saltarin
 * MIT License
 */

import { sprintf } from "./deps.ts";
import { cyan, gray, red, yellow } from "./deps.ts";

type LogLevel = 0 | 1 | 2 | 3;

interface LoggerOptions {
    level: LogLevel;
    format?: string;
}

const initialOptions = {level: 0, format: "%s"};

export class Logger {

    private _level: LogLevel;
    private _format: string;

    constructor(options: LoggerOptions = initialOptions as LoggerOptions) {
        const {level, format} = {...initialOptions, ...options};
        this._level = level;
        this._format = format;
    }

    get level(): LogLevel {
        return this._level;
    }

    set level(_l: LogLevel) {
        this._level = _l;
    }

    get format(): string {
        return this._format;
    }

    set format(_f: string) {
        this._format = _f;
    }

    log(...messages: unknown[]) {
        console.log(Logger._getDateTime() + gray(sprintf(this.format, ...messages)));
    }

    info(...messages: unknown[]) {
        console.log(Logger._getDateTime() + cyan(sprintf(this.format, ...messages)));
    }

    warn(...messages: unknown[]) {
        console.log(Logger._getDateTime() + yellow(sprintf(this.format, ...messages)));
    }

    error(...messages: unknown[]) {
        console.log(Logger._getDateTime() + red(sprintf(this.format, ...messages)));
    }

    private static _getDateTime(): string {
        const dateOb = new Date();
        const date = ("0" + dateOb.getDate()).slice(-2);
        const month = ("0" + (dateOb.getMonth() + 1)).slice(-2);
        const year = dateOb.getFullYear();
        const hours = dateOb.getHours();
        const minutes = dateOb.getMinutes();
        const seconds = dateOb.getSeconds();
        const msecs = ("00" + dateOb.getMilliseconds()).slice(-3);
        const dtString = (year + "-" + month + "-" + date + " " + hours + ":" + minutes
            + ":" + seconds + "." + msecs + " > ");
        return gray(dtString);
    }

}



