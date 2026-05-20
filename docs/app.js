const topics = [
  {
    title: 'Arrays & Strings',
    description: 'Understand indexing, slicing, two-pointer patterns, and common string operations.',
  },
  {
    title: 'Linked Lists',
    description: 'Review node traversal, insertion and deletion, slow/fast pointers, and list reversal.',
  },
  {
    title: 'Stacks & Queues',
    description: 'Practice how these linear structures support LIFO and FIFO workflows efficiently.',
  },
  {
    title: 'Trees & Graphs',
    description: 'Brush up on traversal orders, tree properties, and graph search strategies.',
  },
  {
    title: 'Sorting & Searching',
    description: 'Compare algorithm complexity and choose the right search or sort pattern.',
  },
  {
    title: 'Dynamic Programming',
    description: 'Recall memoization, tabulation, and how to break problems into overlapping subproblems.',
  },
];

const flashcards = [
  {
    question: 'What is the time complexity of binary search on a sorted array?',
    answer: 'O(log n), because each step halves the search range.',
  },
  {
    question: 'When is a linked list a better choice than an array?',
    answer: 'When you need fast insertions or deletions at arbitrary positions and random access is not required.',
  },
  {
    question: 'What is the key difference between a stack and a queue?',
    answer: 'A stack uses last-in, first-out (LIFO); a queue uses first-in, first-out (FIFO).',
  },
  {
    question: 'What do DFS and BFS stand for?',
    answer: 'DFS is Depth-First Search, BFS is Breadth-First Search.',
  },
  {
    question: 'Why is dynamic programming useful?',
    answer: 'It avoids repeated work by storing results for overlapping subproblems.',
  },
];

const quizQuestions = [
  {
    question: 'Which data structure is best for implementing recursion implicitly?',
    choices: ['Queue', 'Heap', 'Stack', 'Linked List'],
    answerIndex: 2,
    explanation: 'Stacks naturally represent the call stack used by recursive functions.',
  },
  {
    question: 'What is the average-case time complexity of quicksort?',
    choices: ['O(n)', 'O(n log n)', 'O(n^2)', 'O(log n)'],
    answerIndex: 1,
    explanation: 'Quicksort sorts in O(n log n) on average by partitioning and recursively sorting subarrays.',
  },
  {
    question: 'Which algorithm is ideal for finding the shortest path on a weighted graph with non-negative edges?',
    choices: ['Dijkstra', 'DFS', 'Kruskal', 'Binary Search'],
    answerIndex: 0,
    explanation: 'Dijkstra’s algorithm finds shortest paths when all weights are non-negative.',
  },
  {
    question: 'What is the space complexity of merge sort for arrays?',
    choices: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
    answerIndex: 2,
    explanation: 'Merge sort requires O(n) extra space to merge sorted subarrays.',
  },
];

const topicCards = document.getElementById('topic-cards');
const flashQuestion = document.getElementById('flash-question');
const flashAnswer = document.getElementById('flash-answer');
const flashCounter = document.getElementById('flash-counter');
const revealButton = document.getElementById('reveal');
const prevCardButton = document.getElementById('prev-card');
const nextCardButton = document.getElementById('next-card');
const quizQuestion = document.getElementById('quiz-question');
const quizOptions = document.getElementById('quiz-options');
const quizFeedback = document.getElementById('quiz-feedback');
const quizNext = document.getElementById('quiz-next');
const quizRestart = document.getElementById('quiz-restart');
const quizScore = document.getElementById('quiz-score');

let flashIndex = 0;
let showAnswer = false;
let quizIndex = 0;
let selectedOption = null;
let score = 0;
let quizSubmitted = false;

function renderTopics() {
  topicCards.innerHTML = topics
    .map(
      (topic) => `
      <article class="topic-card">
        <h3>${topic.title}</h3>
        <p>${topic.description}</p>
      </article>
    `
    )
    .join('');
}

function updateFlashcard() {
  const card = flashcards[flashIndex];
  flashQuestion.textContent = card.question;
  flashAnswer.textContent = card.answer;
  flashAnswer.classList.toggle('hidden', !showAnswer);
  flashCounter.textContent = `${flashIndex + 1} / ${flashcards.length}`;
  revealButton.textContent = showAnswer ? 'Hide answer' : 'Reveal answer';
}

function changeFlashcard(direction) {
  flashIndex = (flashIndex + direction + flashcards.length) % flashcards.length;
  showAnswer = false;
  updateFlashcard();
}

function renderQuiz() {
  const question = quizQuestions[quizIndex];
  quizQuestion.textContent = question.question;
  quizOptions.innerHTML = question.choices
    .map(
      (choice, index) => `
        <button class="quiz-option${selectedOption === index ? ' selected' : ''}" data-index="${index}">
          ${choice}
        </button>
      `
    )
    .join('');
  quizFeedback.textContent = quizSubmitted ? question.explanation : 'Select an answer, then press Next.';
  quizScore.textContent = `Score: ${score} / ${quizQuestions.length}`;
  quizNext.textContent = quizSubmitted ? (quizIndex === quizQuestions.length - 1 ? 'Finish' : 'Next') : 'Submit';
}

function evaluateSelection(index) {
  const question = quizQuestions[quizIndex];
  const optionButtons = [...quizOptions.querySelectorAll('.quiz-option')];
  optionButtons.forEach((button) => {
    const itemIndex = Number(button.dataset.index);
    button.classList.remove('selected', 'correct', 'wrong');
    if (itemIndex === question.answerIndex) {
      button.classList.add('correct');
    }
    if (itemIndex === selectedOption && selectedOption !== question.answerIndex) {
      button.classList.add('wrong');
    }
  });

  if (selectedOption === question.answerIndex) {
    score += 1;
  }
  quizSubmitted = true;
  renderQuiz();
}

function handleQuizNext() {
  if (!quizSubmitted) {
    if (selectedOption === null) {
      quizFeedback.textContent = 'Choose an option before submitting.';
      return;
    }
    evaluateSelection(selectedOption);
    return;
  }

  quizIndex += 1;
  if (quizIndex >= quizQuestions.length) {
    quizFeedback.textContent = `Quiz complete! Your final score is ${score} out of ${quizQuestions.length}.`;
    quizNext.textContent = 'Restart';
    quizSubmitted = true;
    quizIndex = quizQuestions.length - 1;
    return;
  }

  selectedOption = null;
  quizSubmitted = false;
  renderQuiz();
}

function restartQuiz() {
  quizIndex = 0;
  selectedOption = null;
  score = 0;
  quizSubmitted = false;
  renderQuiz();
}

function attachListeners() {
  revealButton.addEventListener('click', () => {
    showAnswer = !showAnswer;
    updateFlashcard();
  });

  prevCardButton.addEventListener('click', () => changeFlashcard(-1));
  nextCardButton.addEventListener('click', () => changeFlashcard(1));

  quizOptions.addEventListener('click', (event) => {
    const button = event.target.closest('.quiz-option');
    if (!button || quizSubmitted) return;
    selectedOption = Number(button.dataset.index);
    renderQuiz();
  });

  quizNext.addEventListener('click', handleQuizNext);
  quizRestart.addEventListener('click', restartQuiz);
}

function initialize() {
  renderTopics();
  updateFlashcard();
  renderQuiz();
  attachListeners();
}

initialize();
