const symbols = [
    { symbol: 'omena', image: 'omena.png' },
    { symbol: 'päärynä', image: 'päärynä.png' },
    { symbol: 'kirsikka', image: 'kirsikka.png' },
    { symbol: 'meloni', image: 'meloni.png' },
    { symbol: 'seiska', image: '7.png' }
];

const wins = {
    'seiskaseiskaseiskaseiska': 10,
    'omenaomenaomenaomena': 6,
    'melonimelonimelonimeloni': 5,
    'päärynäpäärynäpäärynäpäärynä': 4,
    'kirsikkakirsikkakirsikkakirsikka': 3
};

let money = 50;
let lockedSlots = new Set();
let currentSymbols = ['', '', '', ''];
let canLockSlots = false;
let isSecondSpin = false;

const moneyDisplay = document.getElementById('money');
const betInput = document.getElementById('bet');
const playButton = document.getElementById('playButton');
const slots = document.querySelectorAll('.slot');
const resultDisplay = document.getElementById('result');

function updateMoneyDisplay() {
    moneyDisplay.textContent = `Rahaa: ${money}€`;
}

function checkWin(bet) {
    const symbolsString = currentSymbols.join('');
    let winAmount = 0;
    let winDescription = '';
    
    for (const [pattern, multiplier] of Object.entries(wins)) {
        if (symbolsString === pattern) {
            winAmount = bet * multiplier;
            const symbolName = pattern.substring(0, pattern.length/4);
            winDescription = `Neljä ${symbolName} symbolia!`;
            return { amount: winAmount, description: winDescription };
        }
    }
    
    const sevenCount = currentSymbols.filter(s => s === 'seiska').length;
    if (sevenCount >= 3) {
        winAmount = bet * 5;
        winDescription = 'Kolme seiskaa!';
        return { amount: winAmount, description: winDescription };
    }
    
    return { amount: 0, description: '' };
}

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function updateSlots() {
    slots.forEach((slot, index) => {
        if (!lockedSlots.has(index)) {
            const symbol = getRandomSymbol();
            currentSymbols[index] = symbol.symbol;
            slot.innerHTML = `<img src="${symbol.image}" alt="${symbol.symbol}">`;
        }
    });
}

function toggleLock(index) {
    if (!canLockSlots) return;
    
    if (lockedSlots.has(index)) {
        lockedSlots.delete(index);
        slots[index].classList.remove('locked');
    } else {
        lockedSlots.add(index);
        slots[index].classList.add('locked');
    }
}

function playRound() {
    const bet = parseInt(betInput.value);
    
    if (bet < 1 || bet > 10) {
        resultDisplay.textContent = 'Panos pitää olla 1-10€ välillä!';
        resultDisplay.className = 'lose';
        return;
    }
    
    if (bet > money) {
        resultDisplay.textContent = 'Ei tarpeeksi rahaa!';
        resultDisplay.className = 'lose';
        return;
    }
    
    if (!isSecondSpin) {
        money -= bet;
        updateMoneyDisplay();
    }
    
    updateSlots();
    
    const winResult = checkWin(bet);
    
    if (winResult.amount > 0) {
        money += winResult.amount;
        resultDisplay.textContent = `${winResult.description} Voitit ${winResult.amount}€!`;
        resultDisplay.className = 'win';
        canLockSlots = false;
        isSecondSpin = false;
        lockedSlots.clear();
        slots.forEach(slot => slot.classList.remove('locked'));
    } else {
        if (!isSecondSpin) {
            resultDisplay.textContent = 'Ei voittoa! Voit lukita rullia ja kokeilla uudelleen.';
            resultDisplay.className = 'lose';
            canLockSlots = true;
            isSecondSpin = true;
        } else {
            resultDisplay.textContent = 'Ei voittoa. Uusi kierros alkaa!';
            resultDisplay.className = 'lose';
            canLockSlots = false;
            isSecondSpin = false;
            lockedSlots.clear();
            slots.forEach(slot => slot.classList.remove('locked'));
        }
    }
    
    updateMoneyDisplay();
}

playButton.addEventListener('click', playRound);

slots.forEach((slot, index) => {
    slot.addEventListener('click', () => {
        if (currentSymbols[index] !== '') {
            toggleLock(index);
        }
    });
});

updateMoneyDisplay();
