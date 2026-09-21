/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 */

window.addEventListener("load", () => {
    console.log("SmartDeno Dashboard Loaded");
    if (typeof setFeatureActive === "function") {
        setFeatureActive(0);
    }
});
