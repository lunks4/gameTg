// Initialize Telegram WebApp
const tgApp = window.Telegram.WebApp;
tgApp.expand();
tgApp.ready();

// Game state
const gameState = {
    resources: {
        potatoes: 0,
        land: 0,
        workers: 0,
        factories: 0
    },
    rates: {
        potatoes: 0,
        land: 0,
        workers: 0,
        factories: 0
    },
    costs: {
        land: 10,
        workers: 50,
        factories: 200
    },
    upgrades: {
        shovels: { level: 1, cost: 100, owned: false },
        farming: { level: 1, cost: 250, owned: false },
        workers: { level: 1, cost: 500, owned: false },
        factories: { level: 1, cost: 1000, owned: false }
    },
    potatoesPerClick: 1
};

// DOM elements
const elements = {
    resources: {
        potatoes: document.getElementById('potatoes'),
        land: document.getElementById('land'),
        workers: document.getElementById('workers'),
        factories: document.getElementById('factories')
    },
    rates: {
        potatoes: document.getElementById('potatoes-rate'),
        land: document.getElementById('land-rate'),
        workers: document.getElementById('workers-rate'),
        factories: document.getElementById('factories-rate')
    },
    costs: {
        land: document.getElementById('land-cost'),
        workers: document.getElementById('worker-cost'),
        factories: document.getElementById('factory-cost')
    },
    buttons: {
        collectPotatoes: document.getElementById('collect-potatoes'),
        buyLand: document.getElementById('buy-land'),
        hireWorker: document.getElementById('hire-worker'),
        buildFactory: document.getElementById('build-factory'),
        upgradeShovels: document.getElementById('upgrade-shovels'),
        upgradeFarming: document.getElementById('upgrade-farming'),
        upgradeWorkers: document.getElementById('upgrade-workers'),
        upgradeFactories: document.getElementById('upgrade-factories')
    },
    potatoesPerClick: document.getElementById('potatoes-per-click'),
    totalProduction: document.getElementById('total-production'),
    tabs: document.querySelectorAll('.tab'),
    tabContents: document.querySelectorAll('.tab-content')
};

// Game logic
function updateDisplay() {
    // Update resource counts
    elements.resources.potatoes.textContent = Math.floor(gameState.resources.potatoes);
    elements.resources.land.textContent = gameState.resources.land;
    elements.resources.workers.textContent = gameState.resources.workers;
    elements.resources.factories.textContent = gameState.resources.factories;

    // Update production rates
    elements.rates.potatoes.textContent = gameState.rates.potatoes.toFixed(1);
    elements.rates.land.textContent = gameState.rates.land.toFixed(1);
    elements.rates.workers.textContent = gameState.rates.workers.toFixed(1);
    elements.rates.factories.textContent = gameState.rates.factories.toFixed(1);

    // Update costs
    elements.costs.land.textContent = gameState.costs.land;
    elements.costs.workers.textContent = gameState.costs.workers;
    elements.costs.factories.textContent = gameState.costs.factories;

    // Update potatoes per click
    elements.potatoesPerClick.textContent = gameState.potatoesPerClick;

    // Update total production
    elements.totalProduction.textContent = gameState.rates.potatoes.toFixed(1);

    // Update button states
    elements.buttons.buyLand.classList.toggle('disabled', gameState.resources.potatoes < gameState.costs.land);
    elements.buttons.hireWorker.classList.toggle('disabled', gameState.resources.potatoes < gameState.costs.workers);
    elements.buttons.buildFactory.classList.toggle('disabled', gameState.resources.potatoes < gameState.costs.factories);
    
    // Update upgrade button states
    elements.buttons.upgradeShovels.classList.toggle('disabled', 
        gameState.resources.potatoes < gameState.upgrades.shovels.cost || gameState.upgrades.shovels.owned);
    elements.buttons.upgradeFarming.classList.toggle('disabled', 
        gameState.resources.potatoes < gameState.upgrades.farming.cost || gameState.upgrades.farming.owned);
    elements.buttons.upgradeWorkers.classList.toggle('disabled', 
        gameState.resources.potatoes < gameState.upgrades.workers.cost || gameState.upgrades.workers.owned);
    elements.buttons.upgradeFactories.classList.toggle('disabled', 
        gameState.resources.potatoes < gameState.upgrades.factories.cost || gameState.upgrades.factories.owned);
}

function calculateRates() {
    // Land produces potatoes
    const landMultiplier = gameState.upgrades.farming.owned ? 2 : 1;
    gameState.rates.potatoes = gameState.resources.land * 0.5 * landMultiplier;
    
    // Workers produce land
    const workerMultiplier = gameState.upgrades.workers.owned ? 2 : 1;
    gameState.rates.land = gameState.resources.workers * 0.1 * workerMultiplier;
    
    // Factories produce workers
    const factoryMultiplier = gameState.upgrades.factories.owned ? 2 : 1;
    gameState.rates.workers = gameState.resources.factories * 0.05 * factoryMultiplier;
}

function updateResources(deltaTime) {
    // Convert deltaTime from ms to seconds
    const seconds = deltaTime / 1000;
    
    // Update resources based on rates
    gameState.resources.potatoes += gameState.rates.potatoes * seconds;
    gameState.resources.land += gameState.rates.land * seconds;
    gameState.resources.workers += gameState.rates.workers * seconds;
    
    // Update display
    updateDisplay();
}

// Event listeners
elements.buttons.collectPotatoes.addEventListener('click', () => {
    gameState.resources.potatoes += gameState.potatoesPerClick;
    updateDisplay();
    
    // Add animation effect
    elements.buttons.collectPotatoes.classList.add('active');
    setTimeout(() => {
        elements.buttons.collectPotatoes.classList.remove('active');
    }, 100);
});

elements.buttons.buyLand.addEventListener('click', () => {
    if (gameState.resources.potatoes >= gameState.costs.land) {
        gameState.resources.potatoes -= gameState.costs.land;
        gameState.resources.land += 1;
        gameState.costs.land = Math.floor(gameState.costs.land * 1.15);
        calculateRates();
        updateDisplay();
    }
});

elements.buttons.hireWorker.addEventListener('click', () => {
    if (gameState.resources.potatoes >= gameState.costs.workers) {
        gameState.resources.potatoes -= gameState.costs.workers;
        gameState.resources.workers += 1;
        gameState.costs.workers = Math.floor(gameState.costs.workers * 1.15);
        calculateRates();
        updateDisplay();
    }
});

elements.buttons.buildFactory.addEventListener('click', () => {
    if (gameState.resources.potatoes >= gameState.costs.factories) {
        gameState.resources.potatoes -= gameState.costs.factories;
        gameState.resources.factories += 1;
        gameState.costs.factories = Math.floor(gameState.costs.factories * 1.15);
        calculateRates();
        updateDisplay();
    }
});

// Upgrade handlers
elements.buttons.upgradeShovels.addEventListener('click', () => {
    if (gameState.resources.potatoes >= gameState.upgrades.shovels.cost && !gameState.upgrades.shovels.owned) {
        gameState.resources.potatoes -= gameState.upgrades.shovels.cost;
        gameState.upgrades.shovels.owned = true;
        gameState.potatoesPerClick *= 2;
        updateDisplay();
        
        // Show success message
        tgApp.showPopup({
            title: 'Upgrade Purchased',
            message: 'You now collect 2x more potatoes per click!',
            buttons: [{type: 'ok'}]
        });
    }
});

elements.buttons.upgradeFarming.addEventListener('click', () => {
    if (gameState.resources.potatoes >= gameState.upgrades.farming.cost && !gameState.upgrades.farming.owned) {
        gameState.resources.potatoes -= gameState.upgrades.farming.cost;
        gameState.upgrades.farming.owned = true;
        calculateRates();
        updateDisplay();
        
        // Show success message
        tgApp.showPopup({
            title: 'Upgrade Purchased',
            message: 'Your land now produces 2x more potatoes!',
            buttons: [{type: 'ok'}]
        });
    }
});

elements.buttons.upgradeWorkers.addEventListener('click', () => {
    if (gameState.resources.potatoes >= gameState.upgrades.workers.cost && !gameState.upgrades.workers.owned) {
        gameState.resources.potatoes -= gameState.upgrades.workers.cost;
        gameState.upgrades.workers.owned = true;
        calculateRates();
        updateDisplay();
        
        // Show success message
        tgApp.showPopup({
            title: 'Upgrade Purchased',
            message: 'Your workers are now 2x more productive!',
            buttons: [{type: 'ok'}]
        });
    }
});

elements.buttons.upgradeFactories.addEventListener('click', () => {
    if (gameState.resources.potatoes >= gameState.upgrades.factories.cost && !gameState.upgrades.factories.owned) {
        gameState.resources.potatoes -= gameState.upgrades.factories.cost;
        gameState.upgrades.factories.owned = true;
        calculateRates();
        updateDisplay();
        
        // Show success message
        tgApp.showPopup({
            title: 'Upgrade Purchased',
            message: 'Your factories now produce 2x more workers!',
            buttons: [{type: 'ok'}]
        });
    }
});

// Tab switching
elements.tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.getAttribute('data-tab');
        
        // Update active tab
        elements.tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        // Update active content
        elements.tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(`${tabName}-tab`).classList.add('active');
    });
});

// Save game state
function saveGame() {
    localStorage.setItem('resourceComradeState', JSON.stringify(gameState));
}

// Load game state
function loadGame() {
    const savedState = localStorage.getItem('resourceComradeState');
    if (savedState) {
        const parsedState = JSON.parse(savedState);
        Object.assign(gameState, parsedState);
        calculateRates();
        updateDisplay();
    }
}

// Auto-save every 30 seconds
setInterval(saveGame, 30000);

// Game loop
let lastTimestamp = Date.now();
function gameLoop() {
    const currentTimestamp = Date.now();
    const deltaTime = currentTimestamp - lastTimestamp;
    lastTimestamp = currentTimestamp;
    
    updateResources(deltaTime);
    requestAnimationFrame(gameLoop);
}

// Initialize game
loadGame();
calculateRates();
updateDisplay();
gameLoop();

// Handle back button
tgApp.onEvent('backButtonClicked', () => {
    saveGame();
    tgApp.close();
});

// Handle app closing
window.addEventListener('beforeunload', saveGame);