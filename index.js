const form = document.getElementById('form');

let text = "" ;

let quiz = []

let numberOfQuestions = 0 ;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    numberOfQuestions = data["number-of-questions"];
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
    // Get numberOfQuestions random questions from quiz
    quiz = quiz.sort(() => Math.random() - 0.5);

    const quizContainer = document.getElementById('quiz-container');
    quizContainer.innerHTML = "";
    if (numberOfQuestions > quiz.length) {
        numberOfQuestions = quiz.length;
    }
    for(let i = 0; i < numberOfQuestions; i++){
        let question = quiz[i]["question"];
        let correct_answer = quiz[i]["correct_answer"];
        let answer1 = quiz[i]["answer1"];
        let answer2 = quiz[i]["answer2"];
        let answer3 = quiz[i]["answer3"];
        let answer4 = quiz[i]["answer4"];
        quizContainer.innerHTML += `
    <div class="question" data-number="${i}">
        <h3>${question}</h3>
        <label for="answer1${i}"><input id="answer1${i}" type="radio" name="answer${i}" value="1">${answer1}</label><br>
        <label for="answer2${i}"><input id="answer2${i}" type="radio" name="answer${i}" value="2">${answer2}</label><br>
        <label for="answer3${i}"><input id="answer3${i}" type="radio" name="answer${i}" value="3">${answer3}</label><br>
        <label for="answer4${i}"><input id="answer4${i}" type="radio" name="answer${i}" value="4">${answer4}</label><br>
    </div>
`
    }
}

function checkAnswers() {
    let score = 0;
    for(let i = 0; i < numberOfQuestions; i++){
        let correct_answer = quiz[i]["correct_answer"];

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
    alert(`Tu puntuación es de ${score}/${numberOfQuestions}`);
}

let checkButton = document.getElementById('check-button');
checkButton.addEventListener('click', checkAnswers);