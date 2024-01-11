const form = document.getElementById('form');

let text = "" ;

let quiz = [] ;
let quizCopy = [] ;

let random = false ;

let initialQuestion = 0 ;
let lastQuestion = 0 ;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    if(data["random-check"] == "on") {
        random = true ;
    }else {
        random = false ;
    }

    initialQuestion = data["initial-question"];
    lastQuestion = data["last-question"];
    // text = data["input-text"];
    // Get text from local file questions.txt
    let response = await fetch('questions.txt') ;
    text = await response.text() ;
    
    questions = text.split("\r\n");

    questions = questions.filter(function (el) {
        return el != "";
    })
    
    for(let i = 0; i < questions.length; i+=5){
        let testQuestionAndAnswers = {} ;
        let question = questions[i].substring(3);
        testQuestionAndAnswers["question"] = question ;
        for(let j=1 ; j<5 ; j++) {
            let answer = questions[i+j] ;
            if (answer[0] == "*") {
                testQuestionAndAnswers["correct_answer"] = j;
                answer = answer.substring(4);
            }else {
                answer = answer.substring(3);
            }
            testQuestionAndAnswers["answer"+j] = answer ;
        }
        quiz.push(testQuestionAndAnswers);
    }
    console.log(quiz) ;
    insertQuiz() ;
});

function insertQuiz() {
    quizCopy = quiz.slice() ;
    // Get numberOfQuestions random questions from quiz
    if (random){
        quizCopy = quizCopy.sort(() => Math.random() - 0.5);
    }

    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = "";
    if (lastQuestion > quiz.length) {
        lastQuestion = quiz.length;
    }
    for(let i = initialQuestion-1; i < lastQuestion; i++){
        let question = quizCopy[i]["question"];
        let correct_answer = quizCopy[i]["correct_answer"];
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
    for(let i = initialQuestion-1; i < lastQuestion; i++){
        let correct_answer = quizCopy[i]["correct_answer"];

        let answer = document.querySelector(`input[name="answer${i}"]:checked`);
        let answerValue = answer.value;
        let answerLabel = document.querySelector(`div.question[data-number="${i}"] label[for="answer${answerValue}${i}"]`);
        if(answerValue == correct_answer){
            answerLabel.style.backgroundColor = "green";
            score += 1;
        }else{
            let correctAnswerLabel = document.querySelector(`div.question[data-number="${i}"] label[for="answer${correct_answer}${i}"]`);
            correctAnswerLabel.style.backgroundColor = "green";
            answerLabel.style.backgroundColor = "red";
        }
    }
    alert(`Tu puntuación es de ${score}/${lastQuestion-initialQuestion+1}`);
}

let checkButton = document.getElementById('check-button');
checkButton.addEventListener('click', checkAnswers);