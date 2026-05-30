#!/usr/bin/env node

import readline from 'readline';
import { exec } from 'child_process';

// ANSI Styles
const reset = '\x1b[0m';
const bold = '\x1b[1m';
const dim = '\x1b[2m';
const cyan = '\x1b[36m';
const green = '\x1b[32m';
const yellow = '\x1b[33m';
const gray = '\x1b[90m';
const white = '\x1b[37m';
const red = '\x1b[31m';

const menuItems = [
    'About Me',
    'Skills & Stack',
    'Projects',
    'Connect / Socials',
    'Open Web Portfolio',
    'Exit'
];

let selectedIndex = 0;
let currentView = 'menu'; // 'menu', 'about', 'skills', 'projects', 'contact'

const contactItems = [
    { name: 'GitHub', url: 'https://github.com/JyotirmoyLaha' },
    { name: 'LinkedIn', url: 'https://www.linkedin.com/in/jyotirmoylaha2005/' },
    { name: 'Discord Profile', url: 'https://discord.com/users/1374624129067647039' },
    { name: 'Email Me', url: 'mailto:jyotirmoy713128@gmail.com' },
    { name: '< Back to Main Menu', action: 'back' }
];
let contactSelectedIndex = 0;

function openURL(url) {
    let command;
    switch (process.platform) {
        case 'darwin':
            command = `open "${url}"`;
            break;
        case 'win32':
            // Escape ampersands for Windows shell
            command = `start "" "${url.replace(/&/g, '^&')}"`;
            break;
        default:
            command = `xdg-open "${url}"`;
            break;
    }
    exec(command, (err) => {
        if (err) {
            console.log(`\n  ${red}Failed to open browser automatically. Please visit: ${url}${reset}`);
        }
    });
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let isAnimating = true;

const asciiLogo = [
    `   __                 _   _                                     `,
    `   \\ \\ _   _  ___   | |_(_)_ __ _ __ ___   ___  _   _           `,
    `    \\ \\ | | |/ _ \\  | __| | '__| '_ \` _ \\ / _ \\| | | |          `,
    ` /\\_/ / |_| | (_) | | |_| | |  | | | | | | (_) | |_| |          `,
    ` \\___/ \\__, |\\___/   \\__|_|_|  |_| |_| |_|\\___/ \\__, |          `,
    `       |___/                                    |___/           `
];

function clearScreen() {
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');
}

async function runStartupAnimation() {
    clearScreen();
    const isTTY = process.stdin.isTTY;

    // Line-by-line dripping logo effect
    for (const line of asciiLogo) {
        console.log(`${cyan}${bold}${line}${reset}`);
        if (isTTY) await sleep(50);
    }

    // Smooth flowing laser separator line
    const separatorText = "----------------------------------------------------------------";
    process.stdout.write(`${gray}`);
    if (isTTY) {
        for (let i = 0; i < separatorText.length; i++) {
            process.stdout.write(separatorText[i]);
            await sleep(3);
        }
    } else {
        process.stdout.write(separatorText);
    }
    process.stdout.write(`\n${reset}`);

    // Fade-in metadata card details
    if (isTTY) await sleep(80);
    console.log(`  ${green}${bold}Jyotirmoy Laha${reset} — BCA Student & Full-Stack Developer`);
    if (isTTY) await sleep(80);
    console.log(`  ${dim}Converts ideas into high-performance code${reset}`);
    if (isTTY) await sleep(80);

    // Smooth flowing bottom separator
    process.stdout.write(`${gray}`);
    if (isTTY) {
        for (let i = 0; i < separatorText.length; i++) {
            process.stdout.write(separatorText[i]);
            await sleep(2);
        }
    } else {
        process.stdout.write(separatorText);
    }
    process.stdout.write(`\n${reset}`);

    if (isTTY) await sleep(100);
    isAnimating = false; // Enable menu keys
}

function drawHeader() {
    asciiLogo.forEach(line => {
        console.log(`${cyan}${bold}${line}${reset}`);
    });
    console.log(`${gray}----------------------------------------------------------------${reset}`);
    console.log(`  ${green}${bold}Jyotirmoy Laha${reset} — BCA Student & Full-Stack Developer`);
    console.log(`  ${dim}Converts ideas into high-performance code${reset}`);
    console.log(`${gray}----------------------------------------------------------------${reset}\n`);
}

function render() {
    clearScreen();
    drawHeader();

    if (currentView === 'menu') {
        console.log(`  ${bold}What would you like to explore?${reset} ${gray}(Use Arrow keys or Numbers, then Enter)${reset}\n`);
        menuItems.forEach((item, idx) => {
            if (idx === selectedIndex) {
                console.log(`  ${cyan}❯ ${bold}${item}${reset}`);
            } else {
                console.log(`    ${dim}${item}${reset}`);
            }
        });
        console.log(`\n${gray}Press Ctrl+C at any time to exit.${reset}`);
    } else if (currentView === 'about') {
        console.log(`  ${cyan}${bold}// ABOUT ME${reset}\n`);
        console.log(`  Hey there! I am Jyotirmoy Laha — a dedicated BCA student.`);
        console.log(`  My core strength lies in analytical thinking and problem-solving.`);
        console.log(`  I don't just write syntax; I break down complex problems to design`);
        console.log(`  clean, modular, and optimized solutions.`);
        console.log(`\n  ${gray}Press any key to go back...${reset}`);
    } else if (currentView === 'skills') {
        console.log(`  ${cyan}${bold}// SKILLS & STACK${reset}\n`);
        console.log(`  ${green}Languages:${reset}   JavaScript (ES6+), Python, HTML5, CSS3, SQL`);
        console.log(`  ${green}Frontend:${reset}    React, React Native, Expo, Tailwind CSS, Vite`);
        console.log(`  ${green}Backend & DB:${reset} Node.js, Express, FastAPI, Flask, Firebase, MongoDB, PostgreSQL, SQLAlchemy`);
        console.log(`  ${green}Tools & Ops:${reset} Git & GitHub, Postman, Render, Netlify, REST APIs`);
        console.log(`  ${green}Exploring:${reset}   AI/ML, LangChain, TensorFlow, NLP`);
        console.log(`  ${green}Attributes:${reset}  Analytical Thinking, Performance Tuning, Clean Code, Open Quantum Safe`);
        console.log(`\n  ${gray}Press any key to go back...${reset}`);
    } else if (currentView === 'projects') {
        console.log(`  ${cyan}${bold}// FEATURED PROJECTS${reset}\n`);
        console.log(`  ${green}1. SkyCast (Weather App)${reset}`);
        console.log(`     A clean React weather portal with real-time API integrations.`);
        console.log(`  ${green}2. Resume Analyzer (AI Utility)${reset}`);
        console.log(`     An automated tool parser built to analyze resume layouts.`);
        console.log(`  ${green}3. Mess Manager (Admin Suite)${reset}`);
        console.log(`     A complete dining/mess portal for managing schedules.`);
        console.log(`  ${green}4. StudyVerse (Learning Platform)${reset}`);
        console.log(`     An education hub designed to simplify workspace notes.`);
        console.log(`\n  ${gray}Press any key to go back...${reset}`);
    } else if (currentView === 'contact') {
        console.log(`  ${cyan}${bold}// CONNECT / SOCIALS${reset}\n`);
        contactItems.forEach((item, idx) => {
            if (idx === contactSelectedIndex) {
                console.log(`  ${cyan}❯ ${bold}${item.name}${reset} ${item.url ? `${gray}(${item.url})${reset}` : ''}`);
            } else {
                console.log(`    ${dim}${item.name}${reset}`);
            }
        });
        console.log(`\n  ${gray}Press Ctrl+C to exit.${reset}`);
    }
}

readline.emitKeypressEvents(process.stdin);
if (process.stdin.isTTY) {
    process.stdin.setRawMode(true);
}

process.stdin.on('keypress', (str, key) => {
    // Exit handler
    if (key.ctrl && key.name === 'c') {
        process.exit();
    }

    if (isAnimating) return;

    if (currentView === 'menu') {
        if (key.name === 'up') {
            selectedIndex = (selectedIndex - 1 + menuItems.length) % menuItems.length;
            render();
        } else if (key.name === 'down') {
            selectedIndex = (selectedIndex + 1) % menuItems.length;
            render();
        } else if (key.name === 'return') {
            handleMenuSelection();
        } else if (['1', '2', '3', '4', '5', '6'].includes(key.name)) {
            selectedIndex = parseInt(key.name) - 1;
            handleMenuSelection();
        }
    } else if (currentView === 'contact') {
        if (key.name === 'up') {
            contactSelectedIndex = (contactSelectedIndex - 1 + contactItems.length) % contactItems.length;
            render();
        } else if (key.name === 'down') {
            contactSelectedIndex = (contactSelectedIndex + 1) % contactItems.length;
            render();
        } else if (key.name === 'return') {
            handleContactSelection();
        }
    } else {
        // Any key goes back to main menu
        currentView = 'menu';
        render();
    }
});

function handleMenuSelection() {
    const selected = menuItems[selectedIndex];
    if (selected === 'About Me') {
        currentView = 'about';
        render();
    } else if (selected === 'Skills & Stack') {
        currentView = 'skills';
        render();
    } else if (selected === 'Projects') {
        currentView = 'projects';
        render();
    } else if (selected === 'Connect / Socials') {
        currentView = 'contact';
        contactSelectedIndex = 0;
        render();
    } else if (selected === 'Open Web Portfolio') {
        console.log(`\n  Opening default browser to portfolio website...`);
        openURL('https://jyotirmoy-portfolio.onrender.com/');
        setTimeout(() => {
            render();
        }, 1500);
    } else if (selected === 'Exit') {
        console.clear();
        console.log(`\n  ${green}Thank you for visiting! Let's build something awesome together.${reset}\n`);
        process.exit();
    }
}

function handleContactSelection() {
    const selected = contactItems[contactSelectedIndex];
    if (selected.action === 'back') {
        currentView = 'menu';
        render();
    } else if (selected.url) {
        console.log(`\n  Opening ${selected.name} link in browser...`);
        openURL(selected.url);
        setTimeout(() => {
            render();
        }, 1500);
    }
}

// Initial draw with startup animation
(async () => {
    await runStartupAnimation();
    render();
})();
