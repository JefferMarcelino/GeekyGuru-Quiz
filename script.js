// Load the JSON data
fetch('data/quiz/software_engineering.json')
  .then(response => response.json())
  .then(data => startQuiz(data))
  .catch(error => console.error(error));

  
// Start the quiz
function startQuiz(data) {
  // Quiz variables
  let currentQuestion = 0;
  let score = 0;
  let timer;

  const questionElement = document.getElementById('question');
  const optionsElement = document.getElementById('options');
  const explanationElement = document.getElementById('explanation');
  const scoreElement = document.getElementById('score');
  const timerElement = document.getElementById('timer');

  // Randomize the questions array
  const randomizedQuestions = shuffleArray(data.questions);

  // Load the first question
  loadQuestion(randomizedQuestions[currentQuestion]);

  // Attach click event listener to options
  optionsElement.addEventListener('click', handleOptionClick);

  // Timer for 30 seconds per question
  let timeLeft = 30;

  // Countdown timer
  function startTimer() {
    timerElement.textContent = `${timeLeft}`;
    timeLeft--;

    console.log(timeLeft)
    if (timeLeft < 0) {
      clearTimeout(timer);
      handleTimeout();
    } else {
      const width = (timeLeft / 30) * 100;
      timerElement.style.setProperty('--timer-width', `${width}%`);

      timer = setTimeout(startTimer, 1000);
    }
  };

  // Start the timer
  startTimer();

  // Load question and options
  function loadQuestion(question) {
    questionElement.textContent = question.explanation;
    explanationElement.textContent = '';
    scoreElement.textContent = `Score: ${score}`;

    // Randomize the options array
    const randomizedOptions = shuffleArray(question.options);

    // Clear previous options
    optionsElement.innerHTML = '';

    // Create options
    randomizedOptions.forEach(option => {
      const li = document.createElement('li');
      li.textContent = option.answer;
      optionsElement.appendChild(li);
    });
  }

  // Handle option click
  function handleOptionClick(event) {
    if (event.target.tagName === 'LI') {
      const selectedOption = event.target.textContent;
      const currentQuestionData = randomizedQuestions[currentQuestion];
      const isCorrect = currentQuestionData.options.find(
        option => option.answer === selectedOption && option.isCorrect
      );

      if (isCorrect) {
        event.target.classList.add("correct");
        score += 10;     
      } else {
        event.target.classList.add("incorrect");

        if (score > 0) {
          score -= 10;
        }

        if (score <= -10 || score === 0) {
          setTimeout(() => {
            endGame();
            return;
          }, 2000)
        }
      }

      scoreElement.textContent = `Score: ${score}`;
      timer = setTimeout(nextQuestion, 2000);
    }
  }

  // Handle timeout (when time reaches 0 without any answer)
  function handleTimeout() {
    explanationElement.textContent = "Time's up!";
    explanationElement.className = 'incorrect';
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
  
    if (score === 0) {
      // Check if the score reaches 0 for the second time
      endGame();
      return;
    }
  
    setTimeout(nextQuestion, 2000);
  }

  // Load the next question
  function nextQuestion() {
    currentQuestion++;

    if (currentQuestion < randomizedQuestions.length - 1) {
      loadQuestion(randomizedQuestions[currentQuestion]);
      timeLeft = 30;
      timer = setTimeout(startTimer, 1000);
    } else {
      // Quiz ends
      questionElement.textContent = 'Quiz completed!';
      optionsElement.innerHTML = '';
      explanationElement.textContent = '';
      clearTimeout(timer);
    }
  }

  // End the game
  function endGame() {
    questionElement.textContent = 'Game Over!';
    optionsElement.innerHTML = '';
    explanationElement.textContent = '';

    // Create "Start Again" button
    const startAgainButton = document.createElement('button');
    startAgainButton.textContent = 'Start Again';
    startAgainButton.addEventListener('click', startAgain);
    optionsElement.appendChild(startAgainButton);

    clearTimeout(timer);
  }

  // Start the quiz again
  function startAgain() {
    // Reset variables
    currentQuestion = 0;
    score = 0;

    // Remove "Start Again" button
    const startAgainButton = document.querySelector('button');
    if (startAgainButton) {
      startAgainButton.remove();
    }

    // Restart the quiz
    startQuiz(data);
  }

  // Shuffle array randomly
  function shuffleArray(array) {
    const shuffled = array.slice();
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
};