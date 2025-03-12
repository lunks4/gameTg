let score = 0;
let clickPower = 1;

// Элементы интерфейса
const scoreElement = document.getElementById('score');
const clickButton = document.getElementById('clickButton');
const upgrade1Button = document.getElementById('upgrade1');
const upgrade2Button = document.getElementById('upgrade2');

// Обработчик клика
clickButton.addEventListener('click', () => {
    score += clickPower;
    updateScore();
});

// Улучшение 1
upgrade1Button.addEventListener('click', () => {
    if (score >= 10) {
        score -= 10;
        clickPower += 1;
        updateScore();
        upgrade1Button.disabled = true;
    }
});

// Улучшение 2
upgrade2Button.addEventListener('click', () => {
    if (score >= 50) {
        score -= 50;
        clickPower += 5;
        updateScore();
        upgrade2Button.disabled = true;
    }
});

// Обновление счета
function updateScore() {
    scoreElement.textContent = score;
}