// Календарь и часы

export function updateDateTime() {
    const now = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const dateStr = now.toLocaleDateString('ru-RU', options);
    const timeStr = now.toLocaleTimeString('ru-RU');
    const datetimeElement = document.getElementById('datetime');
    if (datetimeElement) {
        datetimeElement.textContent = `${dateStr}, ${timeStr}`;
    }
}

// Кнопка увеличения шрифта

export function initHeaderEvents() {
    const btn = document.getElementById('increase-font');
    if (btn) {
        btn.addEventListener('click', () => {
            const html = document.documentElement;
            const style = window.getComputedStyle(html);
            const fontSize = parseFloat(style.fontSize);
            html.style.fontSize = (fontSize + 1) + 'px';
        });
    }
}
