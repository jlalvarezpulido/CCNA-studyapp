
let jsondata
let answer
let notes

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
            document.getElementById("Text").textContent = jsondata[rand].question;
	setAnswer(jsondata[rand].answer, jsondata[rand].notes);
        }

function setAnswer(chalAnswer,chalNotes){
	answer = chalAnswer;
	notes = chalNotes
	console.log(answer);
}

function answerQuestion(){
	userAnswer = document.getElementById("Answer").value;
	if(userAnswer.toUpperCase() === answer.toUpperCase()){
		document.getElementById("Result").textContent = "Correct";
	}
	else{
		document.getElementById("Result").textContent = "Incorrect";
		document.getElementById("Notes").textContent = notes;
	}
	
}
