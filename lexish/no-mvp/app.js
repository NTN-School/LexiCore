const screen=document.getElementById("screen")

let steps=localStorage.getItem("steps")||0
let streak=localStorage.getItem("streak")||1
let hearts=3

function updateStats(){

document.getElementById("steps").innerText=steps
document.getElementById("streak").innerText=streak
document.getElementById("hearts").innerText="❤️".repeat(hearts)

}

function showHome(){

screen.innerHTML=`

<h2>🐻‍❄️ Chào mừng!</h2>

<p>🚶 Bước học: ${steps}</p>
<p>🔥 Chuỗi ngày: ${streak}</p>

<button onclick="showTopics()">Bắt đầu học ▶</button>

`

updateStats()

}

function showTopics(){

let html="<h2>📚 Chọn chủ đề</h2>"

topics.forEach(t=>{
html+=`<button onclick="startTopic('${t.name}')">${t.name}</button>`
})

screen.innerHTML=html

}

function startTopic(name){

currentTopic=topics.find(t=>t.name===name)
wordIndex=0
flashcard()

}

function flashcard(){

let w=currentTopic.words[wordIndex]

screen.innerHTML=`

<h2>🐻‍❄️ Thẻ từ</h2>

<div class="card">${w.word}</div>

<button onclick="quiz()">Xem nghĩa</button>

`

}

function quiz(){

let w=currentTopic.words[wordIndex]

screen.innerHTML=`

<h2>${w.word} nghĩa là gì?</h2>

<button class="option" onclick="check('${w.meaning}')">${w.meaning}</button>
<button class="option" onclick="check('sai')">sai 1</button>
<button class="option" onclick="check('sai')">sai 2</button>
<button class="option" onclick="check('sai')">sai 3</button>

`

}

function check(ans){

let w=currentTopic.words[wordIndex]

if(ans===w.meaning){

steps++
correct()

}else{

hearts--
updateStats()

if(hearts<=0){

gameOver()

}else{

wrong()

}

}

}

function correct(){

screen.innerHTML=`

<h2>🐻‍❄️ Tuyệt vời!</h2>

🚶 +1 bước

<button onclick="next()">Tiếp</button>

`

updateStats()

}

function wrong(){

screen.innerHTML=`

<h2>🐻‍❄️ Sai rồi!</h2>

❤️ còn lại: ${hearts}

<button onclick="next()">Tiếp</button>

`

}

function next(){

wordIndex++

if(wordIndex>=currentTopic.words.length){

grammarQuiz()

}else{

flashcard()

}

}

function grammarQuiz(){

let g=grammar[Math.floor(Math.random()*grammar.length)]

screen.innerHTML=`

<h2>📚 Ngữ pháp</h2>

<p>${g.question}</p>

${g.options.map(o=>`<button class="option" onclick="checkGrammar('${o}','${g.answer}')">${o}</button>`).join("")}

`

}

function checkGrammar(c,a){

if(c===a){

steps++
correct()

}else{

hearts--
updateStats()

if(hearts<=0){
gameOver()
}else{
wrong()
}

}

}

function gameOver(){

screen.innerHTML=`

<h2>💔 Hết tim!</h2>

<button onclick="resetHearts()">Chơi lại</button>

`

}

function resetHearts(){

hearts=3
showHome()

}

function showProgress(){

screen.innerHTML=`

<h2>🏆 Tiến độ</h2>

🚶 ${steps} bước

`

}

function showSettings(){

screen.innerHTML=`

<h2>⚙ Cài đặt</h2>

<button onclick="reset()">Reset tiến độ</button>

`

}

function reset(){

localStorage.clear()
steps=0
streak=1
showHome()

}

showHome()