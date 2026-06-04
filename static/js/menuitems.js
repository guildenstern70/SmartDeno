/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 *
 */

const setFeatureActive = (activeIndex) => {
    for (let j = 0; j < 4; j++) {
        const menuitem = document.getElementById("menuitem" + j);
        if (menuitem) {
            menuitem.classList.remove("active");
        }
    }
    const menuitem = document.getElementById("menuitem" + activeIndex);
    if (menuitem) {
        menuitem.classList.add("active");
    }
};
