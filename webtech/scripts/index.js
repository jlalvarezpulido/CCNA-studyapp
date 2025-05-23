let jsondata = [];
let answer, notes;
let sessionNum = 0;

// Thresholds
const HM_THRESHOLD = 1;
const LM_THRESHOLD = 0;

// Mastery percentages
const HM_PERCENT = 0.15;
const LM_PERCENT = 0.10;

// Categorized mastery lists
let lowMastery = [], normalMastery = [], highMastery = [];

// Fetch data and categorize questions
fetch('data/transportLayer_1.json')
    .then(response => response.json())
    .then(data => {
        jsondata = data;

        jsondata.forEach(entry => {
            const value = entry.mastery;
            if (value < LM_THRESHOLD) lowMastery.push(entry);
            else if (value < HM_THRESHOLD) normalMastery.push(entry);
            else highMastery.push(entry);
        });

        console.log("Data loaded and categorized:", { lowMastery, normalMastery, highMastery });
    })
    .catch(error => console.error("Error loading data:", error));

// Mastery level selection strategy
const masteryOptions = [
    [lowMastery, normalMastery, highMastery],
    [highMastery, normalMastery, lowMastery],
    [normalMastery, lowMastery, highMastery]
];

const quizQuestion = document.getElementById("Text");
const quizResult = document.getElementById("Result");
const quizNotes = document.getElementById("Notes");
const quizAnswer = document.getElementById("Answer");

function changeText() {
    if (!jsondata.length) {
        console.error("No data available");
        return;
    }

    let rand = Math.floor(Math.random() * jsondata.length);
    quizQuestion.textContent = jsondata[rand].question;
    setAnswer(jsondata[rand].answer, jsondata[rand].notes);
    quizNotes.textContent = "";
    quizResult.textContent = "";
}

function setAnswer(chalAnswer, chalNotes) {
    answer = chalAnswer;
    notes = chalNotes;
    console.log("Set Answer:", answer);
}

function answerQuestion() {
    let userAnswer = quizAnswer.value.trim();
    console.log("User Answer:", userAnswer);

    if (userAnswer.toUpperCase() === answer.toUpperCase()) {
        quizResult.textContent = "Correct";
        quizNotes.textContent = notes;
    } else {
        quizResult.textContent = "Incorrect";
        quizNotes.textContent = `${answer}\n:${notes}`;
    }
}

function textBox(event) {
    if (event.key === "Enter") {
        sessionNum++;
        if (sessionNum % 2 === 1) {
            quizAnswer.value = "";
            quizAnswer.placeholder = "";
            changeText();
        } else {
            answerQuestion();
        }
    }
}

function selectMasteryLevel() {
    let randomMastery = Math.random();
    let masteryIndex = randomMastery <= LM_PERCENT ? 0 :
        randomMastery <= (LM_PERCENT + HM_PERCENT) ? 1 : 2;

    let selectedMasteryList = masteryOptions[masteryIndex].find(lst => lst.length > 0) || [];

    if (!selectedMasteryList.length) return null;

    let sectionDivider = Math.floor(selectedMasteryList.length / 6);
    let randomSection = Math.floor(Math.random() * 3);

    let questionIndex =
        randomSection === 0 ? 0 :
        randomSection === 1 ? sectionDivider :
        randomSection === 2 ? 3 * sectionDivider :
        5 * sectionDivider;

    return selectedMasteryList[questionIndex] || null;
}

