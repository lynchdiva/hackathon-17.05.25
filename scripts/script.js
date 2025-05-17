import { updateDateTime, initHeaderEvents } from './header.js';

document.addEventListener('DOMContentLoaded', () => {
    updateDateTime();
    setInterval(updateDateTime, 1000);
    initHeaderEvents();
});


