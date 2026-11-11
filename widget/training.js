function playGame(playerChoice) {
    const choices = ['antivirus', 'data', 'virus'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    let resultMessage = `You chose ${playerChoice}. Computer chose ${computerChoice}. `;

    if (playerChoice === computerChoice) {
        resultMessage += "It's a tie!";
    } else if (
        (playerChoice === 'antivirus' && computerChoice === 'virus') ||
        (playerChoice === 'data' && computerChoice === 'antivirus') ||
        (playerChoice === 'virus' && computerChoice === 'data')
    ) {
        resultMessage += ("You win!, +2 atk +1 def");
    } else {
        resultMessage += ("You lose!, -1 def");
    }

    const resultEl = document.getElementById('result');
    if (resultEl) resultEl.textContent = resultMessage;
}

// Player Stats
let player = {
    level: 0,
    atk: 10,
    hp: 100
};

// Enemy Stats
let enemy = {
    name: "Training Bot",
    atk: 5,
    hp: 80
};

function setText(id, text) {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
}

function appendLog(text) {
    const el = document.getElementById("log");
    if (el) el.textContent += text;
}

// Display stats
function updateStats() {
    setText("player-stats", `Lvl: ${player.level} | ATK: ${player.atk} | HP: ${player.hp}`);
    setText("enemy-stats", `${enemy.name} | ATK: ${enemy.atk} | HP: ${enemy.hp}`);
}

// Battle logic
function fight(choice) {
    // Player action
    let damage = player.atk + Math.floor(Math.random() * 6);
    enemy.hp -= damage;
    appendLog(`You attack for ${damage} damage.  `);

    if (enemy.hp <= 0) {
        enemy.hp = 0;
        player.level++;
        player.atk += 2;
        player.hp = 100;
        appendLog(`\n${enemy.name} defeated! You leveled up!`);
        resetEnemy();
        updateStats();
        return;
    }

    // Enemy action
    damage = enemy.atk + Math.floor(Math.random() * 6);
    player.hp -= damage;
    appendLog(`\n${enemy.name} attacks for ${damage} damage.  `);

    if (player.hp <= 0) {
        player.hp = 0;
        appendLog(`\nYou were defeated!`);
        resetEnemy();
    }

    updateStats();
}

// Reset enemy
function resetEnemy() {
    const enemies = ["Glitch", "Scavenger Bug", "Firewall Guard"];
    enemy.name = enemies[Math.floor(Math.random() * enemies.length)];
    enemy.atk = 5 + Math.floor(Math.random() * 6);
    enemy.hp = 50 + Math.floor(Math.random() * 40);
}

// Start battle
updateStats();
