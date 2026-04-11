const screen = document.getElementById("screen")

// ===== DATA =====

let steps = localStorage.getItem("steps") || 0
let streak = localStorage.getItem("streak") || 1
let hearts = 3

let currentTopic = null
let wordIndex = 0

// ===== SOUND =====

const soundCorrect = new Audio("assets/sounds/correct.mp3")
const soundWrong = new Audio("assets/sounds/wrong.mp3")

// ===== UPDATE UI =====

function updateStats(){

document.getElementById("steps").innerText = steps
document.getElementById("streak").innerText = streak
document.getElementById("hearts").innerText = "❤️".repeat(hearts)

}

// ===== HOME =====

function showHome(){

screen.innerHTML = `

<h2>🐻‍❄️ Chào mừng đến Lexish!</h2>

<p>🚶 Bước học: ${steps}</p>
<p>🔥 Chuỗi ngày: ${streak}</p>

<button onclick="showTopics()">Bắt đầu học ▶</button>

`

updateStats()

}

// ===== TOPIC LIST =====

function showTopics(){

let html = "<h2>📚 Chọn chủ đề</h2>"

topics.forEach(t=>{

html += `<button onclick="startTopic('${t.name}')">${t.name}</button>`

})

screen.innerHTML = html

}

// ===== START TOPIC =====

function startTopic(name){

currentTopic = topics.find(t=>t.name===name)

wordIndex = 0

flashcard()

}

// ===== FLASHCARD =====

function flashcard(){

let w = currentTopic.words[wordIndex]

screen.innerHTML = `

<h2>🐻‍❄️ Thẻ từ</h2>

<div class="card">
${w.word}
</div>

<button onclick="quiz()">Xem nghĩa</button>

`

}

// ===== QUIZ =====

function quiz(){

let w = currentTopic.words[wordIndex]

screen.innerHTML = `

<h2>${w.word} nghĩa là gì?</h2>

<button class="option" onclick="check('${w.meaning}')">${w.meaning}</button>
<button class="option" onclick="check('sai')">sai 1</button>
<button class="option" onclick="check('sai')">sai 2</button>
<button class="option" onclick="check('sai')">sai 3</button>

`

}

// ===== CHECK ANSWER =====

function check(ans){

let w = currentTopic.words[wordIndex]

if(ans === w.meaning){

steps++
localStorage.setItem("steps",steps)

correct()

}else{

hearts--

updateStats()

if(hearts <= 0){

gameOver()

}else{

wrong()

}

}

}

// ===== CORRECT =====

function correct(){

soundCorrect.currentTime = 0
soundCorrect.play()

screen.innerHTML = `

<h2>🐻‍❄️ Tuyệt vời!</h2>

<p>✔ Chính xác</p>

<p>🚶 +1 bước</p>

<button onclick="next()">Tiếp ▶</button>

`

updateStats()

}

// ===== WRONG =====

function wrong(){

soundWrong.currentTime = 0
soundWrong.play()

screen.innerHTML = `

<h2>🐻‍❄️ Sai rồi!</h2>

<p>❤️ còn lại: ${hearts}</p>

<button onclick="next()">Tiếp</button>

`

}

// ===== NEXT WORD =====

function next(){

wordIndex++

if(wordIndex >= currentTopic.words.length){

grammarQuiz()

}else{

flashcard()

}

}

// ===== GRAMMAR QUIZ =====

function grammarQuiz(){

let g = grammar[Math.floor(Math.random()*grammar.length)]

screen.innerHTML = `

<h2>📖 Ngữ pháp</h2>

<p>${g.question}</p>

${g.options.map(o=>`

<button class="option"
onclick="checkGrammar('${o}','${g.answer}')">

${o}

</button>

`).join("")}

`

}

// ===== CHECK GRAMMAR =====

function checkGrammar(choice,answer){

if(choice === answer){

steps++
correct()

}else{

hearts--

updateStats()

if(hearts <= 0){

gameOver()

}else{

wrong()

}

}

}

// ===== GAME OVER =====

function gameOver(){

screen.innerHTML = `

<h2>💔 Hết tim!</h2>

<p>Hãy thử lại nhé!</p>

<button onclick="resetHearts()">Chơi lại</button>

`

}

// ===== RESET HEARTS =====

function resetHearts(){

hearts = 3

showHome()

}

// ===== PROGRESS =====

function showProgress(){

screen.innerHTML = `

<h2>🏆 Tiến độ học</h2>

<p>🚶 Bước học: ${steps}</p>
<p>🔥 Chuỗi ngày: ${streak}</p>

<div class="card">
██████░░░░
</div>

`

}

// ===== SETTINGS =====

function showSettings(){

screen.innerHTML = `

<h2>⚙ Cài đặt</h2>

<button onclick="reset()">Reset tiến độ</button>

`

}

// ===== RESET =====

function reset(){

localStorage.clear()

steps = 0
streak = 1
hearts = 3

showHome()

}

// ===== START APP =====

showHome()
