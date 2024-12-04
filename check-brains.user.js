// ==UserScript==
// @name         检测不长脑子的
// @namespace    http://tampermonkey.net/
// @version      2024-12-04
// @description  try to take over the world!
// @author       Luomuyu
// @match        *://*/tasks/*/jobs/*
// @icon         https://fastly.jsdelivr.net/gh/cvat-ai/cvat@develop/site/static/favicons/favicon.ico
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    let alertTriggered = false;
    function checkForErrors(observer) {
        if (alertTriggered) return;
        const elements = document.getElementsByClassName("cvat-objects-sidebar-state-item-object-type-text");
        const targetValues = ["RECTANGLE SHAPE", "POLYGON TRACK", "POLYLINE SHAPE", "POLYLINE TRACK"];

        for (let i = 0; i < elements.length; i++) {
            if (targetValues.includes(elements[i].innerHTML)) {
                alertTriggered = true;
                alert("标注框错误,当前标注为：" + elements[i].innerHTML);
                observer.disconnect();
                return;
            }
        }
    }
    const observer = new MutationObserver((mutationsList, observerInstance) => {
        for (const mutation of mutationsList) {
            if (mutation.type === "childList" || mutation.type === "subtree") {
                checkForErrors(observerInstance);
            }
        }
    });
    const config = { childList: true, subtree: true };
    const targetNode = document.querySelector("#root");
    if (targetNode) {
        observer.observe(targetNode, config);
    }
    document.addEventListener("DOMContentLoaded", () => {
        checkForErrors(observer);
    });
})();
