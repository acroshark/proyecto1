"use strict";
const url =
  "https://gist.githubusercontent.com/bertez/2528edb2ab7857dae29c39d1fb669d31/raw/4891dde8eac038aa5719512adee4b4243a8063fd/quiz.json";
const questionEl = document.getElementById("question");
const answerButtonsEl = document.getElementById("answers");
const scoreEl = document.getElementById("score");
const darkModeButton = document.getElementById("dark-mode-button");
darkModeButton.addEventListener("click", toggleDarkMode);
let currentQuestionIndex = 0;
let score = 0;
let questions = [];
let quizCompleted = false;

async function getQuestions() {
  const response = await fetch(url);
  questions = await response.json();
  localStorage.setItem("questions", JSON.stringify(questions));
}
function toggleDarkMode() {
  const body = document.body;
  const elements = document.querySelectorAll("*");
  body.classList.toggle("dark-mode");
  elements.forEach((element) => {
    element.classList.toggle("dark-mode");
  });
}

function showNextQuestion() {
  const currentQuestion = questions[currentQuestionIndex];
  questionEl.innerText = currentQuestion.question;
  answerButtonsEl.innerHTML = "";
  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerText = answer;
    button.classList.add("btn");
    if (answer === currentQuestion.correct) {
      button.dataset.correct = true;
    }
    button.addEventListener("click", selectAnswer);
    answerButtonsEl.appendChild(button);
  });
}
function updateScore() {
  scoreEl.innerText = `Aciertos: ${score} de ${currentQuestionIndex}`;
}
function selectAnswer(e) {
  if (quizCompleted) {
    return;
  }
  const selectedButton = e.target;
  const isCorrect = selectedButton.dataset.correct === "true";
  if (isCorrect) {
    score++;
  }
  currentQuestionIndex++;
  updateScore();
  if (currentQuestionIndex < questions.length) {
    showNextQuestion();
  } else {
    scoreEl.innerText = `${score} aciertos de ${questions.length} preguntas`;
    quizCompleted = true;
  }
}
if (!localStorage.getItem("questions")) {
  getQuestions().then(() => {
    showNextQuestion();
  });
} else {
  questions = JSON.parse(localStorage.getItem("questions"));
  showNextQuestion();
}

const modeButton = document.createElement("button");
modeButton.innerHTML = "Modo oscuro/claro";
modeButton.classList.add("button"); // Agregar la clase "button"
