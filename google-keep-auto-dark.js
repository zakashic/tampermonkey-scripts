// ==UserScript==
// @name         Google Keep Auto Dark
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically switch Google Keep theme based on system theme and listen for changes
// @author       Andy L
// @match        https://keep.google.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // Detect system theme
    const getSystemTheme = () =>
        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Detect page theme
    const getPageTheme = () => {
        const bodyStyle = window.getComputedStyle(document.body);
        const backgroundColor = bodyStyle.backgroundColor;

        if (backgroundColor === 'rgb(32, 33, 36)') return 'dark';
        if (backgroundColor === 'rgb(255, 255, 255)' || backgroundColor === '#fff') return 'light';
        return null;
    };

    // Simulate full mouse events
    const simulateFullMouseEvent = (element) => {
        if (!element) return;

        element.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window }));
        setTimeout(() => {
            element.dispatchEvent(new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window }));
            element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));
        }, 100);
    };

    // Toggle theme
    const toggleTheme = (systemTheme) => {
        const enableDarkThemeItem = document.querySelector('#\\:16'); // Enable dark theme
        const disableDarkThemeItem = document.querySelector('#\\:17'); // Disable dark theme

        if (systemTheme === 'dark' && enableDarkThemeItem) {
            console.log('System theme is dark, clicking Enable dark theme');
            simulateFullMouseEvent(enableDarkThemeItem);
        } else if (systemTheme === 'light' && disableDarkThemeItem) {
            console.log('System theme is light, clicking Disable dark theme');
            simulateFullMouseEvent(disableDarkThemeItem);
        } else {
            console.error('Matching theme toggle option not found');
        }
    };

    // Main logic: Check theme consistency and switch if needed
    const handleThemeSwitch = () => {
        const systemTheme = getSystemTheme();
        const pageTheme = getPageTheme();

        console.log(`System theme: ${systemTheme}, Page theme: ${pageTheme}`);

        if (systemTheme === pageTheme) {
            console.log('System theme matches page theme, no action needed');
            return;
        }

        const settingsButton = document.querySelector('div[aria-label="Settings"]');
        if (!settingsButton) {
            console.error('Settings button not found');
            return;
        }

        // Open the menu
        simulateFullMouseEvent(settingsButton);

        // Toggle theme after a short delay
        setTimeout(() => {
            toggleTheme(systemTheme);

            // Close the menu
            simulateFullMouseEvent(settingsButton);
        }, 100); // Adjust delay if necessary

    };

    // Initialization
    const init = () => {
        handleThemeSwitch();
    };

    // Listen for system theme changes
    const observeThemeChanges = () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        mediaQuery.addEventListener('change', () => {
            console.log('System theme changed, adjusting page theme...');
            handleThemeSwitch();
        });
    };

    init();
    observeThemeChanges();
})();