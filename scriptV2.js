let lives = 5;
let score = 0;
let currentQuestion = 0;
let currentAttempt = 1;
let hasAnsweredCorrectly = false;
let answeredQuestions = [];

async function getQuizQuestions() {
  const response = await fetch("quiz.json");
  const data = await response.json();
  return data;
}

async function shuffleQuestions() {
  let quizQuestions = await getQuizQuestions();
  if (!quizQuestions) {
    console.error("Error: No se ha podido obtener las preguntas del quiz.");
    return null;
  }
  quizQuestions = quizQuestions.filter(
    (question) => !answeredQuestions.includes(question.question)
  );
  quizQuestions = quizQuestions.sort(() => Math.random() - 0.5);
  return quizQuestions[0];
}

function showScore() {
  alert(`Tienes ${lives} vidas y ${score} puntos`);
}

async function showQuestion() {
  try {
    let question;
    do {
      question = await shuffleQuestions();
    } while (!question);

    const answers = question.answers;
    const correctAnswer = question.correct;
    let userAnswer;

    hasAnsweredCorrectly = false;
    currentAttempt = 1;

    while (!hasAnsweredCorrectly && currentAttempt <= 2 && lives > 0) {
      userAnswer = prompt(`${question.question}\n\n${answers.join("\n")}`);
      if (userAnswer === correctAnswer) {
        hasAnsweredCorrectly = true;
        if (currentAttempt === 1) {
          score += 10;
          alert(`¡Correcto! Ganaste 10 puntos`);
        } else if (currentAttempt === 2) {
          score += 5;
          alert(`¡Correcto! Ganaste 5 puntos`);
        }
        currentQuestion++;
        if (currentQuestion < 10) {
          answeredQuestions.push(question.question);
        }
      } else {
        lives--;
        if (lives >= 1) {
          alert(
            `Respuesta incorrecta. Pierdes una vida. Te quedan ${lives} vidas. Tienes ${
              2 - currentAttempt
            } intentos más para responder.`
          );
          currentAttempt++;
        } else {
          alert(`Juego terminado. Tu puntuación es: ${score}`);
        }
      }
    }

    if (currentQuestion < 10 && lives > 0) {
      await showQuestion();
    } else {
      alert(
        `¡Felicidades! Has respondido todas las preguntas. Tu puntuación es: ${score}`
      );
    }
  } catch (error) {
    console.error(error);
  }
}

(async function () {
  try {
    await showQuestion();
  } catch (error) {
    console.error(error);
  }
})();
