const state = {
  topic: "addition",
  difficulty: "easy",
  score: 0,
  streak: 0,
  correct: 0,
  level: 1,
  currentQuestion: null,
};

const rules = {
  addition: {
    label: "Addition",
    tips: [
      { title: "Add tens first", description: "For 28 + 7, first add 20 + 7 = 27, then 27 + 8 = 35." },
      { title: "Use number bonds", description: "Break numbers into easier parts, like 9 + 6 = 10 + 5." },
      { title: "Check with subtraction", description: "If 14 + 7 = 21, then 21 - 7 = 14." },
    ],
  },
  subtraction: {
    label: "Subtraction",
    tips: [
      { title: "Count backward", description: "For 15 - 6, count back from 15: 14, 13, 12, 11, 10, 9." },
      { title: "Use place value", description: "Take away tens and ones separately to stay organized." },
      { title: "Estimate first", description: "A rough estimate helps you know if the answer makes sense." },
    ],
  },
  multiplication: {
    label: "Multiplication",
    tips: [
      { title: "Think in groups", description: "6 x 4 means 6 groups of 4 or 4 + 4 + 4 + 4 + 4 + 4." },
      { title: "Use skip counting", description: "Count by 3s, 5s, or 7s to solve faster." },
      { title: "Know your facts", description: "Memorizing tables helps you become very quick." },
    ],
  },
  division: {
    label: "Division",
    tips: [
      { title: "Think sharing equally", description: "Division is splitting into equal groups or equal amounts." },
      { title: "Use multiplication facts", description: "If 5 x 4 = 20, then 20 ÷ 5 = 4." },
      { title: "Check with inverse", description: "A division answer should multiply back to the original number." },
    ],
  },
};

const scoreValue = document.getElementById("scoreValue");
const streakValue = document.getElementById("streakValue");
const correctValue = document.getElementById("correctValue");
const levelValue = document.getElementById("levelValue");
const questionText = document.getElementById("questionText");
const topicBadge = document.getElementById("topicBadge");
const feedback = document.getElementById("feedback");
const answerInput = document.getElementById("answerInput");
const answerForm = document.getElementById("answerForm");
const skipBtn = document.getElementById("skipBtn");
const resetBtn = document.getElementById("resetBtn");
const tipsBox = document.getElementById("tipsBox");

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getDifficultyRange() {
  switch (state.difficulty) {
    case "easy":
      return { min: 1, max: 10 };
    case "medium":
      return { min: 2, max: 20 };
    case "hard":
      return { min: 5, max: 50 };
    default:
      return { min: 1, max: 10 };
  }
}

function generateQuestion() {
  const range = getDifficultyRange();
  let a;
  let b;
  let result;

  if (state.topic === "addition") {
    a = randomInt(range.min, range.max);
    b = randomInt(range.min, range.max);
    result = a + b;
    return {
      prompt: `${a} + ${b}`,
      answer: result,
      explanation: `${a} + ${b} = ${result}`,
    };
  }

  if (state.topic === "subtraction") {
    a = randomInt(range.min, range.max);
    b = randomInt(range.min, a);
    result = a - b;
    return {
      prompt: `${a} - ${b}`,
      answer: result,
      explanation: `${a} - ${b} = ${result}`,
    };
  }

  if (state.topic === "multiplication") {
    a = randomInt(2, Math.max(2, range.max / 2));
    b = randomInt(2, range.max);
    result = a * b;
    return {
      prompt: `${a} × ${b}`,
      answer: result,
      explanation: `${a} × ${b} = ${result}`,
    };
  }

  a = randomInt(2, range.max);
  b = randomInt(2, Math.min(12, range.max));
  const product = a * b;
  result = product / a;

  return {
    prompt: `${product} ÷ ${a}`,
    answer: result,
    explanation: `${a} × ${result} = ${product}`,
  };
}

function updateStats() {
  scoreValue.textContent = state.score;
  streakValue.textContent = state.streak;
  correctValue.textContent = state.correct;
  levelValue.textContent = state.level;
}

function updateTips() {
  const tips = rules[state.topic].tips;
  tipsBox.innerHTML = tips
    .map(
      (tip) => `
        <article class="tip-card">
          <h3>${tip.title}</h3>
          <p>${tip.description}</p>
        </article>
      `
    )
    .join("");
}

function setFeedback(message, type = "") {
  feedback.textContent = message;
  feedback.className = `feedback ${type}`.trim();
}

function nextQuestion() {
  state.currentQuestion = generateQuestion();
  questionText.textContent = state.currentQuestion.prompt;
  answerInput.value = "";
  answerInput.focus();
  setFeedback("Choose a topic and start learning.");
}

function handleCorrectAnswer() {
  state.score += 10 + state.level * 2;
  state.correct += 1;
  state.streak += 1;
  state.level = Math.max(1, Math.floor(state.correct / 5) + 1);
  updateStats();
  setFeedback(`Correct! ${state.currentQuestion.explanation}. Keep going!`, "success");
  setTimeout(() => {
    nextQuestion();
  }, 900);
}

function handleIncorrectAnswer() {
  state.streak = 0;
  updateStats();
  setFeedback(`Not quite. The right answer is ${state.currentQuestion.answer}.`, "error");
  setTimeout(() => {
    nextQuestion();
  }, 1200);
}

answerForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const userAnswer = Number(answerInput.value);

  if (Number.isNaN(userAnswer)) {
    setFeedback("Please enter a valid number.", "error");
    return;
  }

  if (userAnswer === state.currentQuestion.answer) {
    handleCorrectAnswer();
  } else {
    handleIncorrectAnswer();
  }
});

skipBtn.addEventListener("click", () => {
  state.streak = 0;
  updateStats();
  setFeedback(`Skipped. The answer was ${state.currentQuestion.answer}.`, "error");
  setTimeout(() => {
    nextQuestion();
  }, 900);
});

resetBtn.addEventListener("click", () => {
  state.score = 0;
  state.streak = 0;
  state.correct = 0;
  state.level = 1;
  updateStats();
  nextQuestion();
  setFeedback("Progress reset. Ready for a fresh start!", "success");
});

const topicButtons = document.querySelectorAll(".topic-btn");
const difficultyButtons = document.querySelectorAll(".difficulty-btn");

for (const btn of topicButtons) {
  btn.addEventListener("click", () => {
    const selected = btn.dataset.topic;
    state.topic = selected;
    topicBadge.textContent = rules[selected].label;

    for (const topicBtn of topicButtons) {
      topicBtn.classList.toggle("active", topicBtn === btn);
    }

    updateTips();
    nextQuestion();
  });
}

for (const btn of difficultyButtons) {
  btn.addEventListener("click", () => {
    const selected = btn.dataset.difficulty;
    state.difficulty = selected;

    for (const difficultyBtn of difficultyButtons) {
      difficultyBtn.classList.toggle("active", difficultyBtn === btn);
    }

    nextQuestion();
  });
}

updateStats();
updateTips();
nextQuestion();







































