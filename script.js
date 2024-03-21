// Блоки 
const backgroundElement = document.querySelector(".container");
const pageGame = document.querySelector(".page__game");
const pageAuth = document.querySelector(".page__auth");
const header = document.querySelector(".header");

// Кнопки
const save = document.querySelector(".scale__button");
const play = document.querySelector(".form__button");
const refresh = document.querySelector(".new-game__button");
const newGame = document.querySelector(".auth__button");
const back = document.querySelector(".back__button");

// Инпуты
const input = document.querySelector(".form__input");
const scaleStart = document.querySelector(".scale__input__start");
const scaleEnd = document.querySelector(".scale__input__end");
const authName = document.querySelector(".auth__input");

//Вывод 
const check = document.querySelector(".result__check__output");
const help = document.querySelector(".result__help__output");
const last = document.querySelector(".result__attempt__output");
const attempts = document.querySelector(".result__try__output");
const guessed = document.querySelector(".result__guessed__output");
const bestName = document.querySelector(".best__player__name");
const bestScore = document.querySelector(".best__player__score");

// Глобальные переменные
let usrName; // Введенное имя пользователя
let usrNum; // Число введенное пользователем
let min; // Нижняя граница диапазона
let max; // Верхняя граница диапазона
let rand; // Случайно сгенерированное число
let atts; // Количество осташихся попыток
let guess = 0; // Количество отгаданых подряд

// Список сообщений пользователю
const messages = { 
    bad: "Не угадали",
    lot: "Слишком много",
    few: "Слишком мало",
    done: "Вы угадали",
    empty: "",
    scale: "Введен неверный диапазон",
    lost: "Вы проиграли"
};

// Получить последние данные по лучшему игроку из localstorage
let best = JSON.parse(localStorage.getItem("champion"))
if(best == null){
    localStorage.setItem("champion", JSON.stringify({name:"champ", result:"2"}))
}
bestName.textContent = best.name + ":";
bestScore.textContent = best.result + " подряд";

guessed.textContent = guess;

refresh.addEventListener('click', refreshClickFunction) // Добавить обработчик клика на кнопку "Начать заново"
play.addEventListener('click', playClickFunction); // Добавить обработчик клика на кнопку "Играть"
save.addEventListener('click', saveClickFunction); // Добавить обработчик клика на кнопку "Сохранить диапазон"
newGame.addEventListener('click', newClickFunction); // Добавить обработчик клика на кнопку "Начать игру"
back.addEventListener('click', backClickFunction); // Добавить обработчик клика на кнопку "Вернуться"

input.disabled = true; // Отключить форму ввода числа
play.disabled = true;

// Обработчик клика на "Играть"
function playClickFunction() { 
    atts--;
    attempts.textContent = atts;
    // debugger
    if(atts > 0){ //Проверка на количество оставшихся попыток
        [check.textContent, help.textContent] = checkResult()
        console.log(atts)
    } else { // Завершить игру, если потрачены все попытки
        guess = 0;
        guessed.textContent = guess; 
        endGame()
        check.textContent = messages.lost;
        help.textContent = messages.lost;
        backgroundElement.style.backgroundColor = "#B00000";
    }
}

// Обработчик клика на "Начать заново"
function refreshClickFunction() {
    backgroundElement.style.backgroundColor = "#101357";
    resetData();
    scaleEnd.disabled = false;
    scaleStart.disabled = false;
    save.disabled = false;
    input.disabled = true;
    play.disabled = true;
}

// Обработчик клика на "Сохранить"
function saveClickFunction() {
    min = Number(scaleStart.value) //Получить из формы нижнюю границу диапазона
    max = Number(scaleEnd.value) //Получить из формы верхнюю границу диапазона
    atts = getNumOfAttempts(max-min+1);
    attempts.textContent = atts;
    if( min >= max) { // Проверка на корректность диапазона
        check.textContent = messages.scale; 
        help.textContent = messages.scale;
        input.value = messages.empty; 
    } else {
        attempts.textContent = atts;
        rand = getRandomInRange(min, max)
        console.log(rand)
        input.disabled = false;
        play.disabled = false;
        messages.error = `Введите число в диапазоне от ${min} до ${max}`; // Добавить еще 1 сообщение пользователю в список
    }
}

// Обработчик клика на "Начать игру"
function newClickFunction() {
    usrName = authName.value;
    if(usrName != "") { // Запретить начало игры если не введено имя
        pageAuth.style.display = "none";
        pageGame.style.display = "flex";
        header.style.display = "grid";
        header.style.gridTemplateColumns = "1fr 6fr";
        back.style.display = "inline-block";
    }
}

// Обработчик клика на "Вернуться"
function backClickFunction() {
    backgroundElement.style.backgroundColor = "#101357"; //Задать стандатрный цвет
    guess = 0; // Установить текущее значение отгаданных подряд 0
    guessed.textContent = guess;
    pageGame.style.display = "none";
    pageAuth.style.display = "flex";
    header.style.display = "flex";
    back.style.display = "none";
    resetData(); 
}

//Проверка введенного числа
function checkResult() {
    usrNum = input.value;
    last.textContent = usrNum; 
    if(isNaN(usrNum)) { // Проверка на тип
        return [messages.error, messages.error];
    } 
    if(usrNum < min || usrNum > max) { // Проверка на диапазон
        return [messages.error, messages.error];
    } 
    if (usrNum > rand) { // Проверка выигрыша
        return [messages.bad, messages.lot];
    } 
    if (usrNum < rand) { // Проверка выигрыша
        return [messages.bad, messages.few];
    } 
    if (usrNum == rand){ // Проверка выигрыша
        backgroundElement.style.backgroundColor = "#34C924";
        endGame();
        guess++;
        guessed.textContent = guess;
        checkForBestScore();
        return [messages.done, messages.done];
    }
}

// Обнулить данные в формах и сгенерировать новое случайное число
function resetData() {
    scaleEnd.value = messages.empty;
    scaleStart.value = messages.empty;
    check.textContent = messages.empty;
    help.textContent =  messages.empty;
    input.value =  messages.empty;
    last.textContent = messages.empty;
    attempts.textContent = messages.empty;
}

// Отключить формы при выигрыше или проигрыше
function endGame() {
    input.disabled = true;
    play.disabled = true;
    scaleEnd.disabled = true;
    scaleStart.disabled = true;
    save.disabled = true;
}

// Сгенерировать случайное число включая диапазоны
function getRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Опеределить количество попыток в зависимости от диапазона
function getNumOfAttempts(range) {
    return Math.floor((Math.log(range)) / Math.log(2));
}

// Проверить является ли текущий игрок лучшим
function checkForBestScore() {
    if(guess > best.result) {
        localStorage.setItem("champion", JSON.stringify({name:usrName, result:guess}))
        best = JSON.parse(localStorage.getItem("champion"))
        bestName.textContent = best.name + ":";
        bestScore.textContent = best.result + " подряд";
    }
}