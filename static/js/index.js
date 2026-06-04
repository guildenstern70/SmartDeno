/*
 * Smart Deno
 * A web template project for Deno
 * Copyright (c) 2020-26 Alessio Saltarin
 * MIT License
 *
 */

/*global setFeatureActive */
(function () {
    setFeatureActive(0);

    const btnDecrement = document.getElementById("btn-decrement");
    const btnIncrement = document.getElementById("btn-increment");
    const counterVal = document.getElementById("counter-value");

    if (btnDecrement && btnIncrement && counterVal) {
        let val = parseInt(counterVal.textContent || "3", 10);
        btnDecrement.addEventListener("click", () => {
            val--;
            counterVal.textContent = val.toString();
        });
        btnIncrement.addEventListener("click", () => {
            val++;
            counterVal.textContent = val.toString();
        });
    }
})();

