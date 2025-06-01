// stored app state
let jsondata = [];
let INDICES;
let sessionNum = 0;
// Categorized mastery lists
let lowMastery = [], normalMastery = [], highMastery = [];

// Thresholds
const HM_THRESHOLD = 1;
const LM_THRESHOLD = 0;

// Mastery percentages
const HM_PERCENT = 0.15;
const LM_PERCENT = 0.10;


// Fetch data and categorize questions
fetch('data/section1.json')
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
const scoreElement = document.getElementById("Normal");
const saveButton = document.getElementById("saveButton");

function changeText() {
    if (!jsondata.length) {
        console.error("No data available");
        return;
    }
    let scoreCard = `Low: ${lowMastery.length.toString()} Current: ${normalMastery.length.toString()} High: ${highMastery.length.toString()}`;
    let indices = qEngine();
    console.log(indices);
    let currentQuestion = masteryOptions[indices[0]][indices[1]][indices[2]];
    quizQuestion.textContent = currentQuestion.question.toString();
    scoreElement.textContent = scoreCard;
    setAnswer(indices);
    quizNotes.textContent = "";
    quizResult.textContent = "";
}

function setAnswer(indices) {
    INDICES = indices;
}

// handles the user input and redistributes the question to the appropriate mastery level
function answerQuestion() {
    //create local scope variable for current question.
    let currentQuestion = masteryOptions[INDICES[0]][INDICES[1]][INDICES[2]];
    let userAnswer = quizAnswer.value.trim();
    console.log("User Answer:", userAnswer);
    //remove it from its array
    masteryOptions[INDICES[0]][INDICES[1]].splice(INDICES[2],1);
    //update the current quesions mastery and HTML elements based on response
    if (userAnswer.toString().toUpperCase() === currentQuestion.answer.toString().toUpperCase()) {
        quizResult.textContent = "Correct";
        quizNotes.textContent = currentQuestion.notes;
        currentQuestion.mastery++
    } else {
        quizResult.textContent = "Incorrect";
        quizNotes.textContent = `${currentQuestion.answer}\n:${currentQuestion.notes}`;
        currentQuestion.mastery--
    }
    //redistribute the current question to the appropriate mastery array.
    if (currentQuestion.mastery < LM_THRESHOLD) lowMastery.push(currentQuestion);
    else if (currentQuestion.mastery < HM_THRESHOLD) normalMastery.push(currentQuestion);
    else highMastery.push(currentQuestion);
}

// event handler for text box to behave differently between every other event Enter key
function textBox(event) {
    if (event.key === "Enter") {
        sessionNum++;
        if (sessionNum % 2 === 1) {
            quizAnswer.value = "";
            quizAnswer.placeholder = "Press enter to answer";
            changeText();
        } else {
            answerQuestion();
        }
    }
}

// questionIndices are the indices for the masteryOptions array
// This function is a random number engine
// [masteryIndex][prioIndex][questionIndex]
function qEngine() {
    let randomMastery = Math.random();
    let masteryIndex = randomMastery <= LM_PERCENT ? 0 :
        randomMastery <= (LM_PERCENT + HM_PERCENT) ? 1 : 2;

    let prioIndex = masteryOptions[masteryIndex].findIndex(lst => lst.length > 0);

    if (!masteryOptions[masteryIndex].length) return null;

    let sectionDivider = Math.floor(masteryOptions[masteryIndex][prioIndex].length / 6);
    let randomSection = Math.floor(Math.random() * 3);

    let questionIndex =
        randomSection === 0 ? 0 :
        randomSection === 1 ? sectionDivider :
        randomSection === 2 ? 3 * sectionDivider :
        5 * sectionDivider;
    let questionIndices = [masteryIndex, prioIndex, questionIndex]

    return  questionIndices || null;
}

// Save data using PUT
saveButton.addEventListener('click', async () => {
try {
        const response = await fetch('data/section1.json');
        let jsonData = await response.json();

        // Modify JSON data
	jsonData = [...lowMastery, ...normalMastery, ...highMastery];
	console.log(jsonData);
        // Send updated JSON back to server
        const updateResponse = await fetch('data/section1.json', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(jsonData)
        });

        if (updateResponse.ok) {
            console.log('JSON updated successfully:', await updateResponse.json());
        } else {
            console.error('Error updating JSON:', updateResponse.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
});
