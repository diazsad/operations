const buttonsContainer = document.getElementById('buttons');
let correctAnswer;
let correctCount = 0;
let errorCount = 0;
let timerInterval;
let gameInProgress = false;
let level = 1;
let totalScore = 1000;

const soundWinPoint = new Audio("./assets/sound/win_point.wav");
const soundLosePoint = new Audio("./assets/sound/lose_point.wav");
const soundWinGame = new Audio("./assets/sound/win_game.wav");
const soundLevelUp = new Audio("./assets/sound/level_up.wav");
const soundLoseGame = new Audio("./assets/sound/lose_game.wav");

function generateOperation() {
    let operand1, operand2, operand3, result;
    let answerOptions = [];
    let operationType = Math.random() > 0.5 ? 'addition' : 'subtraction';
    let operationType2 = Math.random() > 0.5 ? 'addition' : 'subtraction';

    if (level === 1) {
        operand1 = Math.floor(Math.random() * 100) + 1;
        result = Math.floor(Math.random() * 100) + 1;
        operand2 = result - operand1;
        if (operand2 < 0) {
            operand2 = operand1;
            result = operand1 + operand2;
        }
        correctAnswer = operand2;
        document.getElementById('question').textContent = `${operand1} + ? = ${result}`;
        answerOptions = [operand2];
        while (answerOptions.length < 21) {
            let randomAnswer = Math.floor(Math.random() * 200) + 1;
            if (!answerOptions.includes(randomAnswer)) {
                answerOptions.push(randomAnswer);
            }
        }
    } else if (level === 2) {
        operand1 = Math.floor(Math.random() * 200) + 1;
        operand2 = Math.floor(Math.random() * 200) + 1;
        if (operationType === 'addition') {
            result = operand1 + operand2;
            correctAnswer = operand2;
            document.getElementById('question').textContent = `${operand1} + ? = ${result}`;
        } else {
            result = operand1 - operand2;
            if (result < 0) {
                operand2 = operand1;
                result = operand1 - operand2;
            }
            correctAnswer = operand2;
            document.getElementById('question').textContent = `${operand1} - ? = ${result}`;
        }
        answerOptions = [operand2];
        while (answerOptions.length < 28) {
            let randomAnswer = Math.floor(Math.random() * 400) + 1;
            if (!answerOptions.includes(randomAnswer)) {
                answerOptions.push(randomAnswer);
            }
        }
    } else if (level === 3) {
        operand1 = Math.floor(Math.random() * 200) + 1;
        operand2 = Math.floor(Math.random() * 200) + 1;
        operand3 = Math.floor(Math.random() * 200) + 1;
        if (operationType === 'addition' && operationType2 === 'addition') {
            result = operand1 + operand2 + operand3;
            document.getElementById('question').textContent = `${operand1} + ? + ${operand3} = ${result}`;
        } else if (operationType === 'addition' && operationType2 === 'subtraction') {
            result = operand1 + operand2 - operand3;
            if (result < 0) {
                operand2 = operand1 + operand3;
                result = operand1 + operand2 - operand3;
            }
            document.getElementById('question').textContent = `${operand1} + ? - ${operand3} = ${result}`;
        } else if (operationType === 'subtraction' && operationType2 === 'addition') {
            result = operand1 - operand2 + operand3;
            if (result < 0) {
                operand2 = operand1 + operand3;
                result = operand1 - operand2 + operand3;
            }
            document.getElementById('question').textContent = `${operand1} - ? + ${operand3} = ${result}`;
        } else {
            result = operand1 - operand2 - operand3;
            if (result < 0) {
                operand2 = operand1 - operand3;
                result = operand1 - operand2 - operand3;
            }
            document.getElementById('question').textContent = `${operand1} - ? - ${operand3} = ${result}`;
        }
        correctAnswer = operand2;
        answerOptions = [operand2];
        while (answerOptions.length < 35) {
            let randomAnswer = Math.floor(Math.random() * 400) + 1;
            if (!answerOptions.includes(randomAnswer)) {
                answerOptions.push(randomAnswer);
            }
        }
    }

    buttonsContainer.innerHTML = '';
    answerOptions.sort(() => Math.random() - 0.5).forEach(option => {
        let button = document.createElement('button');
        button.textContent = option;
        button.className = 'button';
        buttonsContainer.appendChild(button);
    });
}

function checkAnswer(answer) {
    if (gameInProgress) {
        if (answer === correctAnswer) {
            soundWinPoint.play();
            correctCount++;
            document.getElementById('correctCount').textContent = correctCount;
            totalScore += 30;
            document.getElementById('totalscore').textContent = totalScore;
            if (correctCount === 5 && level === 1) {
                level = 2;
                soundLevelUp.play();
                Swal.fire({
                    title: '¡Nivel 2!',
                    text: '¡Has avanzado al nivel 2!',
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    generateOperation();
                });
            } else if (correctCount === 10 && level === 2) {
                level = 3;
                soundLevelUp.play();
                Swal.fire({
                    title: '¡Nivel 3!',
                    text: '¡Has avanzado al nivel 3!',
                    icon: 'success',
                    confirmButtonText: 'Continuar'
                }).then(() => {
                    generateOperation();
                });111
            } else if (correctCount === 15 && level === 3) {
                stopTimer();
                soundWinGame.play();
                let finaltime = document.getElementById('timer').textContent;
                let scoreGrade = calculateScoreGrade(totalScore);
                Swal.fire({
                    title: '¡Felicidades! Ah ganado el juego',
                    text: `Su nota es: ${scoreGrade}`,
                    footer: `Tiempo total: ${finaltime}, Puntaje total: ${totalScore}`,
                    icon: 'success',
                    confirmButtonText: 'Jugar de nuevo'
                }).then((result) => {
                    if (result.isConfirmed) {
                        document.getElementById("player-info").style.display = "block";
                        document.getElementById("main").style.display = "none";
                        document.getElementById("playerForm").addEventListener("submit", function (event) {
                            event.preventDefault();
                            document.getElementById("player-info").style.display = "none";
                            document.getElementById("main").style.display = "block";
                            stopTimer();
                            resetGame();
                        });
                    }
                });
            } else {
                generateOperation();
            }
        } else {
            errorCount++;
            document.getElementById('errorCount').textContent = errorCount;
            soundLosePoint.play();
            totalScore -= 5;
            document.getElementById('totalscore').textContent = totalScore;
            document.querySelectorAll('.button').forEach(button => {
                if (parseInt(button.textContent) === answer) {
                    button.classList.add('shake');
                    setTimeout(() => {
                        button.classList.remove('shake');
                    }, 500);
                }
            });
        }
    }
}

function startTimer() {
    let totalSeconds = 0;
    timerInterval = setInterval(function () {
        totalSeconds++;
        let minutes = Math.floor(totalSeconds / 60);
        let seconds = totalSeconds % 60;
        let formattedTime = pad(minutes) + ":" + pad(seconds);
        document.getElementById('timer').textContent = formattedTime;
        totalScore -= 1;
        document.getElementById('totalscore').textContent = totalScore;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('timer').textContent = "00:00";
}

function calculateScoreGrade(totalScore) {
    let scoreGrade = (totalScore * 5) / 1300;
    scoreGrade = Math.min(scoreGrade, 5);
    scoreGrade = Math.round(scoreGrade * 100) / 100;
    return scoreGrade;
}

function pad(val) {
    return val < 10 ? "0" + val : val;
}

function resetGame() {
    clearInterval(timerInterval);
    stopTimer();
    resetTimer();
    totalScore = 1000;
    correctCount = 0;
    errorCount = 0;
    document.getElementById('correctCount').textContent = correctCount;
    document.getElementById('errorCount').textContent = errorCount;
    document.getElementById('totalscore').textContent = totalScore;
    level = 1;
    gameInProgress = false;
    generateOperation();
}

generateOperation();

buttonsContainer.addEventListener('click', function (event) {
    if (event.target.matches('button')) {
        checkAnswer(parseInt(event.target.textContent));
    }
});

document.getElementById('startTimerButton').addEventListener('click', function () {
    if (!gameInProgress) {
        startTimer();
        gameInProgress = true;
        generateOperation();
    }
});

document.getElementById('backTimerButton').addEventListener('click', function () {
    resetGame();
});

document.getElementById("playerForm").addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const grade = document.getElementById("grade").value;
    const school = document.getElementById("school").value;
    const gameData = {
        name: name,
        age: age,
        grade: grade,
        school: school,
        score: totalScore,
        time: gameData.time,
      };
    
      axios.post('http://localhost:3000/api/game/createGame', gameData)
        .then(response => {
          console.log('Respuesta de la API:', response.data);
        })
        .catch(error => {
          console.error('Error al crear el juego:', error);
        });


    

    console.log("Colegio:", school);
    console.log("Nombre:", name);
    console.log("Edad:", age);
    console.log("Grado:", grade);
    console.log("Aciertos:", correctCount);
    console.log("Errores:", errorCount);
    console.log("Puntuacion:", totalScore);
    console.log("Tiempo:", gameData.time);
    console.log("Nota:", calculateScoreGrade(totalScore));
});
