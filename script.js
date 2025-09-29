// Data: Questions stored in JSON format (as per your content management plan)
const quizDeck = [
    {
        question: "What does LPU stand for?",
        options: ["Lyceum of the Philippines University", "Label po muna", "Long Poison Unity"],
        answer: "Lyceum of the Philippines University"
    },
    {
        question: "What is sir Joey Full name?",
        options: ["Arsenio Joey Arrelano", "Buhay ni Joey", "Karera ni Joey"],
        answer: "Arsenio Joey Arrelano"
    },
    {
        question: "Favorite Filipino Artist",
        options: ["Parokya ni Joey", "Kamikazee", "inok manok"],
        answer: "inok manok"
    },
    {
        question:"5+5",
        options: ["5", "10", "20"],
        answer: "10"
    },
    {
        question:"sino ka?",
        options: ["student", "professor", "tambay"],
        answer: "tambay"
    },

    // Add more questions here!
];

// Game State Variables
let currentQuestionIndex = 0;
let score = 0;
let isGameActive = false;
const carMovementUnit = 10; // Percentage of track to move per correct answer
const maxCarPosition = 120;  // Stop car before the finish line

// DOM Elements
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const scoreDisplay = document.getElementById('score-display');
const startButton = document.getElementById('start-button');
const carSprite = document.getElementById('car-sprite');
const feedbackMessage = document.getElementById('feedback-message');

// --- Core Functions ---

function startGame() {
    isGameActive = true;
    score = 0;
    currentQuestionIndex = 0;
    scoreDisplay.textContent = score;
    feedbackMessage.textContent = '';
    carSprite.style.left = '0%'; // Reset car position
    startButton.style.display = 'none'; // Hide start button

    // You would put your 3-5 minute review logic here (e.g., show a review slide)
    // For now, we skip directly to the first question
    displayQuestion();
}

function displayQuestion() {
    if (currentQuestionIndex >= quizDeck.length) {
        endGame();
        return;
    }

    const currentQuiz = quizDeck[currentQuestionIndex];
    questionText.textContent = currentQuiz.question;
    optionsContainer.innerHTML = ''; // Clear previous options

    // Create a button for each option
    currentQuiz.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, button));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedOption, button) {
    if (!isGameActive) return;

    const currentQuiz = quizDeck[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuiz.answer;

    // Provide visual feedback
    // Disable all buttons to prevent double-clicking
    Array.from(optionsContainer.children).forEach(btn => btn.disabled = true);
    
    if (isCorrect) {
        score++;
        feedbackMessage.textContent = 'Correct! Go faster!';
        button.classList.add('correct-answer');
        moveCar();
        // **TODO: Add a sound effect here using Howler.js**
    } else {
        feedbackMessage.textContent = `Wrong! The answer was: ${currentQuiz.answer}`;
        button.classList.add('wrong-answer');
        // Highlight the correct answer
        Array.from(optionsContainer.children).find(btn => btn.textContent === currentQuiz.answer).classList.add('correct-answer');
        // **TODO: Add a sound effect here using Howler.js**
    }

    scoreDisplay.textContent = score;

    // Move to the next question after a short delay
    setTimeout(() => {
        currentQuestionIndex++;
        // Clear previous feedback styles
        Array.from(optionsContainer.children).forEach(btn => {
            btn.classList.remove('correct-answer', 'wrong-answer');
        });
        feedbackMessage.textContent = '';
        displayQuestion();
    }, 1500); // 1.5 second delay
}

function moveCar() {
    // Calculate new position based on score and max questions
    const progressPercentage = (score / quizDeck.length) * 100;
    const newPosition = Math.min(progressPercentage, maxCarPosition);
    carSprite.style.left = `${newPosition}%`;

    // Check if the race is won (car reached the finish line)
    if (newPosition >= maxCarPosition) {
        endGame(true);
    }
}

function endGame(won = false) {
    isGameActive = false;
    let finalMessage = `Game Over! You answered ${score} out of ${quizDeck.length} questions.`;
    
    if (won) {
        finalMessage = `CONGRATULATIONS! You crossed the finish line! Final Score: ${score}`;
        // **TODO: Show Achievement/Badge here**
    }
    
    questionText.textContent = finalMessage;
    optionsContainer.innerHTML = ''; // Clear options
    startButton.textContent = 'Play Again';
    startButton.style.display = 'block';
    feedbackMessage.textContent = '';
    
    // **TODO: This is where you would send the score to the MySQL database via PHP**
}


// --- Event Listeners ---
startButton.addEventListener('click', startGame);

// Initialize the game state when the page loads
// We don't start it immediately, we wait for the user to click 'Start Race'
// displayQuestion(); // Do not call this, the start button handles the initial call