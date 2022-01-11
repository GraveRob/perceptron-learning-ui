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
let totalCount = 0;

document.addEventListener('DOMContentLoaded', load);
function load() {
    const squares = document.querySelectorAll('.square');
    const btnDecoder = document.querySelector('.btn-decode');
    const btnCleaner = document.querySelector('.btn-clear');
    const numbers = document.querySelectorAll('.num');
    const btnTrain = document.querySelector('.btn-train');
    const resultSection = document.querySelector('.result');
    const historyBtn = document.querySelector('.resultList');
    const historyPopup = document.querySelector('.historyPopup');
    
    addToggleClassByClick(squares);
    addSingleToggleClass(numbers);
    addCross(historyPopup);

    btnDecoder.addEventListener('click', () => displayAt(resultSection, ask(decodeNumber(squares), choosedNumber)));
    btnCleaner.addEventListener('click', () => clearNumber(squares));
    btnTrain.addEventListener('click', () => train(getTrainingAmount(), choosedNumber));
    historyBtn.addEventListener('click', () => historyPopup.classList.toggle('visible'));
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

function displayAt (section, result) {
    section.innerHTML = `<h2>${result}</h2>`;
}

function addCross (element) {
    const clientRect = element.getBoundingClientRect();
    const div = document.createElement('div');
    const innerHTML = `<div class = "exit" style = "right: 2%; top: 2%;">X</div>`;

    div.innerHTML = innerHTML;

    div.addEventListener('click', () => element.classList.toggle('visible'));

    element.append(div);
}

function paintStep (container, weights, iteration = 0) {
    const element = `
    <section class = "field">
        <h1>Step ${iteration}</h1>
        <section class="squareLine">
            <section class="square${ weights[0] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[1] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[2] > 0 ? ' active' : ''}"></section>
        </section>
        <section class="squareLine">
            <section class="square${ weights[3] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[4] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[5] > 0 ? ' active' : ''}"></section>
        </section>
        <section class="squareLine">
            <section class="square${ weights[6] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[7] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[8] > 0 ? ' active' : ''}"></section>
        </section>
        <section class="squareLine">
            <section class="square${ weights[9] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[10] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[11] > 0 ? ' active' : ''}"></section>
        </section>
        <section class="squareLine">
            <section class="square${ weights[12] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[13] > 0 ? ' active' : ''}"></section>
            <section class="square${ weights[14] > 0 ? ' active' : ''}"></section>
        </section>
    </section>`;

    container.insertAdjacentHTML('beforeend', element);
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
        paintStep(document.querySelector('.historyPopup'), weights, i + 1 + +totalCount);
    }
    totalCount += +amount;
    console.log(weights);
}

function ask (number) {
    return (`It's ${choosedNumber} ? ${proceed(number) ? 'Yes' : 'No'}`);
}