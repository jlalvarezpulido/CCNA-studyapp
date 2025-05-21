let jsondata;
let answer;
let notes;
let sessionNum = 0;

const quizQuestion = document.getElementById("Text");
const quizResult = document.getElementById("Result");
const quizNotes = document.getElementById("Notes");
const quizAnswer = document.getElementById("Answer");

fetch('data/transportLayer_1.json')
	.then(response => response.json())
	.then(data => {
	jsondata = data;
	console.log(jsondata);
	})
	.catch(error => console.error("Error",error));

function changeText() {
	const min = 0;
	const max = 42;
	let rand = Math.floor(Math.random() * (max - min + 1)) + min;

        quizQuestion.textContent = jsondata[rand].question;
	setAnswer(jsondata[rand].answer, jsondata[rand].notes);
	quizNotes.textContent = "";
	quizResult.textContent = "";
}

function setAnswer(chalAnswer,chalNotes){
	answer = chalAnswer;
	notes = chalNotes
	console.log(answer);
}

function answerQuestion(){
	userAnswer = quizAnswer.value;
	if(userAnswer.toString().toUpperCase() === answer.toString().toUpperCase()){
		quizResult.textContent = "Correct";
		quizNotes.textContent = notes;
	}
	else{
		quizResult.textContent = "Incorrect";
		quizNotes.textContent = notes;
	}
}

function textBox(event){
	if (event.key === "Enter"){
		sessionNum++
		if(sessionNum % 2 === 0){
			quizAnswer.value = "";
			changeText();
		}
		else{
			answerQuestion();

		}
	}
}
