const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

// Set initial state
if (localStorage.getItem('theme') === 'light') {
    htmlElement.classList.remove('dark');
    themeIcon.innerText = '☀️';
} else {
    htmlElement.classList.add('dark');
    themeIcon.innerText = '🌙';
}

// Click event
themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    
    if (htmlElement.classList.contains('dark')) {
        themeIcon.innerText = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.innerText = '☀️';
        localStorage.setItem('theme', 'light');
    }
});


/* Destination */

const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const htmlElement = document.documentElement;

// 1. Initial Load: Check Local Storage
if (localStorage.getItem('theme') === 'light') {
    htmlElement.classList.remove('dark');
    themeIcon.innerText = '☀️';
} else {
    htmlElement.classList.add('dark');
    themeIcon.innerText = '🌙';
}

// 2. Toggle Action
themeToggleBtn.addEventListener('click', () => {
    htmlElement.classList.toggle('dark');
    
    if (htmlElement.classList.contains('dark')) {
        themeIcon.innerText = '🌙';
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.innerText = '☀️';
        localStorage.setItem('theme', 'light');
    }
});