const num0 = [1,1,1,1,0,1,1,0,1,1,0,1,1,1,1];
const num1 = [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1];
const num2 = [1,1,1,0,0,1,1,1,1,1,0,0,1,1,1];
const num3 = [1,1,1,0,0,1,1,1,1,0,0,1,1,1,1];
const num4 = [1,0,1,1,0,1,1,1,1,0,0,1,0,0,1];
const num5 = [1,1,1,1,0,0,1,1,1,0,0,1,1,1,1];
const num6 = [1,1,1,1,0,0,1,1,1,1,0,1,1,1,1];
const num7 = [1,1,1,0,0,1,0,0,1,0,0,1,0,0,1];
const num8 = [1,1,1,1,0,1,1,1,1,1,0,1,1,1,1];
const num9 = [1,1,1,1,0,1,1,1,1,0,0,1,1,1,1];

const NUMBERS = [num0, num1, num2, num3, num4, num5, num6, num7, num8, num9];

const weights = [];
const WEIGHT_AMOUNT = 15;
for (let i = 0; i < WEIGHT_AMOUNT; i++) {
    weights[i] = 0;
}
const ROOF = 7;
const STEP = 1;
let choosedNumber = 0;

document.addEventListener('DOMContentLoaded', load);
function load() {
    const squares = document.querySelectorAll('.square');
    const btnDecoder = document.querySelector('.btn-decode');
    const btnCleaner = document.querySelector('.btn-clear');
    const numbers = document.querySelectorAll('.num');
    const btnTrain = document.querySelector('.btn-train');

    addToggleClassByClick(squares);
    addSingleToggleClass(numbers);

    btnDecoder.addEventListener('click', () => ask(decodeNumber(squares), choosedNumber));
    btnCleaner.addEventListener('click', () => clearNumber(squares));
    btnTrain.addEventListener('click', () => train(getTrainingAmount(), choosedNumber));
}

function addToggleClassByClick(elems) {
    elems.forEach(function(elem) {
        elem.addEventListener('click', () => elem.classList.toggle('active') );
    });
}

function decodeNumber(elems) {
    const numbers = [];

    elems.forEach(function(elem, i) {
        numbers[i] = elem.classList.contains('active') ? 1 : 0;
    });
    
    return numbers;
}

function clearNumber (elems) {
    elems.forEach(function(elem, i) {
        if (elem.classList.contains('active')) {
            elem.classList.remove('active');
        }
    });
}

function addSingleToggleClass (elems) {
    elems.forEach(function(elem) {
        elem.addEventListener('click', () => {
            elems.forEach( elem => {if (elem.classList.contains('active')) elem.classList.remove('active')} )
            elem.classList.add('active');
            choosedNumber = +elem.textContent;
            console.log(choosedNumber);
        });
    });
}

function getTrainingAmount() {
    console.log(document.querySelector('#train-count').value);
    return document.querySelector('#train-count').value;
}

function getCodedNumber(number) {
    console.log(NUMBERS[number])
    return number >= 0 && number <= 9 ? NUMBERS[number] : 0;
}

//функции управления нейросетью (персептроном)

function proceed(number) {
    let sum = 0;

    for(let i = 0; i < WEIGHT_AMOUNT; i++) {
        sum += +number[i] * +weights[i];
    }

    return sum > ROOF;
}

function increase (number) {
    for (let i = 0; i < WEIGHT_AMOUNT; i++) {
        if (number[i] === 1) {
            weights[i] += STEP;
        }
    }
}

function decrease (number) {
    for (let i = 0; i < WEIGHT_AMOUNT; i++) {
        if (number[i] === 1) {
            weights[i] -= STEP;
        }
    }
}

function train (amount, number) {
    for (let i = 0; i < amount; i++) {
        let option = Math.ceil(Math.random() * 10) - 1;
        if (option === number) {
            if (!proceed(NUMBERS[option])) {
                increase(NUMBERS[number]);
            }
        }
        else {
            if (proceed(NUMBERS[option])) {
                decrease(NUMBERS[option]);
            }
        }
    }
    console.log(weights);
}

function ask (number) {
    console.log(`${number} это ${choosedNumber} ? ${proceed(number) ? 'Да' : 'Нет'}`);
}