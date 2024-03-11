const form = document.getElementById('form');

let text = "";

let quiz = [];
let quizCopy = [];

let random = false;

let initialQuestion = 0;
let lastQuestion = 0;

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	quiz = [];
	const formData = new FormData(form);
	const data = Object.fromEntries(formData);
	console.log(data);

	if (data["random-check"] == "on") {
		random = true;
	} else {
		random = false;
	}

	initialQuestion = data["initial-question"];
	lastQuestion = data["last-question"];
	// text = data["input-text"];
	// Get text from local file questions.txt
	let response;
	switch (data["trimestre"]) {
		case "primero":
			response = await fetch('questions.txt');
			break;
		case "segundo":
			response = await fetch('Preguntas epi.txt');
			break;
		default:
			response = await fetch('questions.txt');
			break;
	}
	text = await response.text();

	let questions = text.split("\n");

	questions = questions.filter(function(el) {
		return el.trim() != "" && el != "\t";
	})
	console.log(questions);

	for (let i = 0; i < questions.length; i += 5) {
		let testQuestionAndAnswers = {};
		let question = questions[i].split(".")[1];
		testQuestionAndAnswers["question"] = question;
		for (let j = 1; j < 5; j++) {
			let answer = questions[i + j];
			// console.log(answer)
			if (answer.charAt(0) == "*") {
				testQuestionAndAnswers["correct_answer"] = j;
				answer = answer.split(")")[1].trim();
			} else {
				answer = answer.split(")")[1].trim();
			}
			testQuestionAndAnswers["answer" + j] = answer;
		}
		quiz.push(testQuestionAndAnswers);
	}
	// console.log(quiz);
	insertQuiz();
});

function insertQuiz() {
	quizCopy = quiz.slice();
	// Get numberOfQuestions random questions from quiz
	if (random) {
		quizCopy = quizCopy.sort(() => Math.random() - 0.5);
	}

	const quizContainer = document.getElementById('quiz-container');
	quizContainer.innerHTML = "";
	if (lastQuestion > quiz.length) {
		lastQuestion = quiz.length;
	}
	for (let i = initialQuestion - 1; i < lastQuestion; i++) {
		let question = quizCopy[i]["question"];
		// let correct_answer = quizCopy[i]["correct_answer"];
		let answer1 = quizCopy[i]["answer1"];
		let answer2 = quizCopy[i]["answer2"];
		let answer3 = quizCopy[i]["answer3"];
		let answer4 = quizCopy[i]["answer4"];
		quizContainer.innerHTML += `
    <div class="question" data-number="${i}">
        <h3>${question}</h3>
        <label for="answer1${i}"><input id="answer1${i}" type="radio" name="answer${i}" value="1">${answer1}</label>
        <label for="answer2${i}"><input id="answer2${i}" type="radio" name="answer${i}" value="2">${answer2}</label>
        <label for="answer3${i}"><input id="answer3${i}" type="radio" name="answer${i}" value="3">${answer3}</label>
        <label for="answer4${i}"><input id="answer4${i}" type="radio" name="answer${i}" value="4">${answer4}</label>
    </div>
`
	}
}

function checkAnswers() {
	let score = 0;
	for (let i = initialQuestion - 1; i < lastQuestion; i++) {
		let correct_answer = quizCopy[i]["correct_answer"];
		console.log(`Checking question ${i + 1} with correct answer ${correct_answer}`)

		let answer = document.querySelector(`input[name="answer${i}"]:checked`);
		let answerValue = answer?.value;
		let answerLabel = document.querySelector(`div.question[data-number="${i}"] label[for="answer${answerValue}${i}"]`);

		if (!answer) {
			document.querySelector(`div.question[data-number="${i}"] label[for="answer${correct_answer}${i}"]`).style.backgroundColor = "green";
		}
		else if (answerValue == correct_answer) {
			answerLabel.style.backgroundColor = "green";
			score += answer ? 1 : 0;
		} else {
			let correctAnswerLabel = document.querySelector(`div.question[data-number="${i}"] label[for="answer${correct_answer}${i}"]`);
			correctAnswerLabel.style.backgroundColor = "green";
			answerLabel.style.backgroundColor = "red";
		}

		// Disable the radio buttons for this question
		let radioButtons = document.querySelectorAll(`input[name="answer${i}"]`);
		radioButtons.forEach(radioButton => {
			radioButton.disabled = true;
		});
	}
	alert(`Tu puntuación es de ${score}/${lastQuestion - initialQuestion + 1}`);
}

let checkButton = document.getElementById('check-button');
checkButton.addEventListener('click', checkAnswers);
