const nameInputContainer = document.querySelector(".user-names-container");
const chooseCategoryContainer = document.querySelector(".choose-category-container");
const quizDataContainer = document.querySelector(".quiz-data-container");
const quizEndContainer = document.querySelector(".quiz-end-container");
const finalResultContainer = document.querySelector(".final-result-container");

chooseCategoryContainer.classList.add("hide-data");
quizDataContainer.classList.add("hide-data");
quizEndContainer.classList.add("hide-data");
finalResultContainer.classList.add("hide-data");

const startGameBtn = document.getElementById("start-game-btn");
const startQuizBtn = document.getElementById("start-quiz-btn");
const nextQuestionBtn = document.getElementById("next-question-btn");
const endGameBtn = document.getElementById("end-game-btn");
const anotherCategoryBtn = document.getElementById("another-category-btn");
const playAgainBtn = document.getElementById("play-again-btn");

let user1Name;
let user2Name;

startGameBtn.addEventListener("click", () => {
    user1Name = document.getElementById("user1-name").value;
    user2Name = document.getElementById("user2-name").value;

    console.log(user1Name);
    console.log(user2Name);

    nameInputContainer.classList.add("hide-data");
    chooseCategoryContainer.classList.remove("hide-data");
})

let choosedCategoryArr = [];

startQuizBtn.addEventListener("click", () => {
    const selectedCategory = document.getElementById("category").value;

    // console.log(selectedCategory);

    choosedCategoryArr.push(selectedCategory);

    choosedCategoryArr = [... new Set(choosedCategoryArr)];

    console.log(choosedCategoryArr);

    chooseCategoryContainer.classList.add("hide-data");
    quizDataContainer.classList.remove("hide-data");

    getDataFromApi(selectedCategory);

})

let user1Score = 0;
let user2Score = 0;


nextQuestionBtn.addEventListener("click", () => {
    if (currentQuestionIndex < finalQuizArray.length) {

        if (userChoosedAnswer === finalQuizArray[currentQuestionIndex].correctAnswer) {
            alert("Correct Answer");
            if (currentQuestionIndex == 0) {
                user1Score += 10;
            }else if (currentQuestionIndex == 1) {
                user2Score += 10;
            }else if (currentQuestionIndex == 2) {
                user1Score += 15;
            }else if (currentQuestionIndex == 3) {
                user2Score += 15;
            }else if (currentQuestionIndex == 4) {
                user1Score += 25;
            }else if (currentQuestionIndex == 5) {
                user2Score += 25;
            }
        } else {
            alert("Incorrect Answer");
        }

        currentQuestionIndex++;

        renderCurrentQuestionData();
    } 

})

const finalResult = document.querySelector(".final-result");
const user1NameResult = document.querySelector(".user1-name");
const user1ScoreResult = document.querySelector(".user1-score");
const user2NameResult = document.querySelector(".user2-name");
const user2ScoreResult = document.querySelector(".user2-score");

endGameBtn.addEventListener("click", () => {

    quizEndContainer.classList.add("hide-data");
    finalResultContainer.classList.remove("hide-data");

    if (user1Score > user2Score) {
        finalResult.innerHTML = `Congratulations! ${user1Name} Wins`;
    } else if (user2Score > user1Score) {
        finalResult.innerHTML = `Congratulations! ${user2Name} Wins`;
    }else {
        finalResult.innerHTML = "Match Draw";
    }

    user1NameResult.innerHTML = `Player 1 = ${user1Name}`;
    user1ScoreResult.innerHTML = `Player 1 Score = ${user1Score}`;
    user2NameResult.innerHTML = `Player 2 = ${user2Name}`;
    user2ScoreResult.innerHTML = `Player 2 Score = ${user2Score}`;

})

playAgainBtn.addEventListener("click", () => {
    location.reload();
})

const allCategoryOptions = Array.from(document.querySelectorAll(".category-option"));

// console.log(allCategoryOptions);


anotherCategoryBtn.addEventListener("click", () => {

    allCategoryOptions.forEach((option) => {
        if(choosedCategoryArr.includes(option.value)) {
            option.remove();
        }
    })

    quizEndContainer.classList.add("hide-data");
    chooseCategoryContainer.classList.remove("hide-data");

    currentQuestionIndex = 0;
    finalQuizArray = [];
})

async function getDataFromApi(category) {

    let url = `https://the-trivia-api.com/v2/questions/?limit=50&difficulties=easy,medium,hard&categories=${category}`;

    const response = await fetch(url);

    const data = await response.json();

    // console.log(data);

    filterFinalArrayData(data);

}

let finalQuizArray = [];

function filterFinalArrayData(apiData) {

    const easyQuestions = apiData.filter((question) => question.difficulty === "easy");

    const mediumQuestions = apiData.filter((question) => question.difficulty === "medium");

    const hardQuestions = apiData.filter((question) => question.difficulty === "hard");

    // console.log(easyQuestions);
    // console.log(mediumQuestions);
    // console.log(hardQuestions);

    finalQuizArray.push(easyQuestions[0], easyQuestions[1]);
    finalQuizArray.push(mediumQuestions[0], mediumQuestions[1]);
    finalQuizArray.push(hardQuestions[0], hardQuestions[1]);

    console.log(finalQuizArray);

    renderCurrentQuestionData();

}

let currentQuestionIndex = 0;
let userChoosedAnswer;

const userTurnContainer = document.querySelector(".user-turn-container");
const questionDifficultyLevelContainer = document.querySelector(".question-difficulty-level-container");
const quizQuestionContainer = document.querySelector(".quiz-question-container");

const questionOptions = document.querySelectorAll(".quesion-option")

const quizOptionsContainer1 = document.querySelector(".option-container-1");
const quizOptionsContainer2 = document.querySelector(".option-container-2");
const quizOptionsContainer3 = document.querySelector(".option-container-3");
const quizOptionsContainer4 = document.querySelector(".option-container-4");

function renderCurrentQuestionData() {

    if (currentQuestionIndex == 0 || currentQuestionIndex == 2 || currentQuestionIndex == 4) {
        userTurnContainer.textContent = `Player 1 ${user1Name}'s Turn`;
    } else if (currentQuestionIndex == 1 || currentQuestionIndex == 3 || currentQuestionIndex == 5) {
        userTurnContainer.textContent = `Player 2 ${user2Name}'s Turn`;
    } else {
        console.log("Game Over");
        console.log("user1Score", user1Score);
        console.log("user2Score", user2Score);

        quizDataContainer.classList.add("hide-data");
        quizEndContainer.classList.remove("hide-data");

        return
    }

    questionDifficultyLevelContainer.textContent = `Difficulty Level = ${finalQuizArray[currentQuestionIndex].difficulty.toUpperCase()}`;

    quizQuestionContainer.textContent = `Q. ${finalQuizArray[currentQuestionIndex].question.text}`;

    let correctAnswer = finalQuizArray[currentQuestionIndex].correctAnswer;

    let incorrectAnswers = finalQuizArray[currentQuestionIndex].incorrectAnswers;

    console.log(correctAnswer);
    console.log(incorrectAnswers);

    let allOptions = [correctAnswer, ...incorrectAnswers];

    // console.log(allOptions);

    let allOptionsAfterShuffle = shuffleArray(allOptions);

    // console.log(allOptionsAfterShuffle);

    quizOptionsContainer1.textContent = `${allOptionsAfterShuffle[0]}`;
    quizOptionsContainer2.textContent = `${allOptionsAfterShuffle[1]}`;
    quizOptionsContainer3.textContent = `${allOptionsAfterShuffle[2]}`;
    quizOptionsContainer4.textContent = `${allOptionsAfterShuffle[3]}`;

    questionOptions.forEach((option) => {
        option.addEventListener("click", () => {
            userChoosedAnswer = option.textContent;
            // console.log(userChoosedAnswer);
        })
    })

}


function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

