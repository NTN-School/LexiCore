const screen = document.getElementById("screen")

let steps = 0
let streak = 1
let hearts = 3

let topics = []
let grammar = []

let currentTopic = null
let wordIndex = 0

// ===== SOUND =====

const soundCorrect = new Audio("assets/sounds/correct.mp3")
const soundWrong = new Audio("assets/sounds/wrong.mp3")

// ================= LOGIN/REGISTER =================

function showLogin(){
  screen.innerHTML = `
    <h2>🔐 Đăng nhập</h2>
    <input id="user" placeholder="Username"><br>
    <input id="pass" type="password" placeholder="Password"><br>
    <button onclick="login()">Đăng nhập</button>
    <button onclick="showRegister()">Đăng ký</button>
  `
}

function showRegister(){
  screen.innerHTML = `
    <h2>📝 Đăng ký</h2>
    <input id="user" placeholder="Username"><br>
    <input id="pass" type="password" placeholder="Password"><br>
    <button onclick="register()">Tạo tài khoản</button>
  `
}

function register(){
  let username = document.getElementById("user").value
  let password = document.getElementById("pass").value

  fetch("http://127.0.0.1:5000/api/register", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  })
  .then(res => res.json())
  .then(data=>{
    alert(data.msg || "Đăng ký thành công")
    showLogin()
  })
}

function login(){
  let username = document.getElementById("user").value
  let password = document.getElementById("pass").value

  fetch("http://127.0.0.1:5000/api/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({username, password})
  })
  .then(res => res.json())
  .then(data=>{
    if(data.status === "ok"){
      currentUser = data.user

      steps = currentUser.steps
      streak = currentUser.streak
      hearts = currentUser.hearts

      loadAll()
    } else {
      alert("Sai tài khoản!")
    }
  })
}

// ================= LOAD DATA =================

function loadAll() {
  Promise.all([
    fetch("http://127.0.0.1:5000/api/user?username=" + currentUser.username),
    fetch("http://127.0.0.1:5000/api/topics"),
    fetch("http://127.0.0.1:5000/api/grammar")
  ])
  .then(async ([u, t, g]) => {

    console.log("STATUS:", u.status, t.status, g.status)

    const user = await u.json()
    const topicsData = await t.json()
    const grammarData = await g.json()

    console.log("USER:", user)
    console.log("TOPICS:", topicsData)
    console.log("GRAMMAR:", grammarData)

    steps = user.steps
    streak = user.streak
    hearts = user.hearts

    topics = topicsData
    grammar = grammarData

    updateStats()

    showHome()
  })
  .catch(err => {
    console.error("LỖI FETCH:", err)
    alert("Có lỗi API! Nhấn F12 để xem chi tiết")
  })
}

// ================= SAVE DATA =================

function saveData() {
  fetch("http://127.0.0.1:5000/api/user", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      steps,
      streak,
      hearts
    })
  })
}

// ================= UI =================

function updateStats(){
  document.getElementById("steps").innerText = steps
  document.getElementById("streak").innerText = streak
  document.getElementById("hearts").innerText = "❤️".repeat(hearts)
}

function showHome(){
  screen.innerHTML = `
    <h2>🐻‍❄️ Chào mừng!</h2>
    <p>🚶 Bước học: ${steps}</p>
    <p>🔥 Chuỗi ngày: ${streak}</p>
    <button onclick="showTopics()">Bắt đầu học ▶</button>
  `
  updateStats()
}

function showTopics(){

  if (!topics || topics.length === 0) {
    screen.innerHTML = "<h3>⚠️ Chưa load được dữ liệu!</h3>"
    return
  }

  let html = "<h2>📚 Chọn chủ đề</h2>"

  topics.forEach(t=>{
    html += `<button onclick="startTopic('${t.name}')">${t.name}</button>`
  })

  screen.innerHTML = html
}

function startTopic(name){
  currentTopic = topics.find(t => t.name === name)
  wordIndex = 0
  flashcard()
}

function flashcard(){
  let w = currentTopic.words[wordIndex]

  screen.innerHTML = `
    <h2>🐻‍❄️ Thẻ từ</h2>
    <div class="card">${w.word}</div>
    <button onclick="quiz()">Xem nghĩa</button>
  `
}

function quiz(){
  let w = currentTopic.words[wordIndex]

  // 👉 Lấy tất cả nghĩa trong topic
  let allMeanings = currentTopic.words.map(x => x.meaning)

  // 👉 Lọc bỏ đáp án đúng
  let wrongAnswers = allMeanings.filter(m => m !== w.meaning)

  // 👉 Trộn random
  wrongAnswers.sort(() => Math.random() - 0.5)

  // 👉 Lấy 3 đáp án sai
  let options = [w.meaning, ...wrongAnswers.slice(0, 3)]

  // 👉 Trộn lại lần nữa
  options.sort(() => Math.random() - 0.5)

  // 👉 Render
  screen.innerHTML = `
    <h2>${w.word} nghĩa là gì?</h2>
    ${options.map(o =>
      `<button class="option" onclick="check('${o}')">${o}</button>`
    ).join("")}
  `
}

function check(ans){
  let w = currentTopic.words[wordIndex]

  if(ans === w.meaning){
    steps++
    saveData()
    correct()
  } else {
    hearts--
    saveData()
    updateStats()

    if(hearts <= 0){
      gameOver()
    } else {
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

function grammarQuiz(){
  let g = grammar[Math.floor(Math.random() * grammar.length)]

  screen.innerHTML = `
    <h2>📚 Ngữ pháp</h2>
    <p>${g.question}</p>
    ${g.options.map(o =>
      `<button class="option" onclick="checkGrammar('${o}','${g.answer}')">${o}</button>`
    ).join("")}
  `
}

function checkGrammar(c, a){
  if(c === a){
    steps++
    saveData()
    correct()
  } else {
    hearts--
    saveData()
    updateStats()

    if(hearts <= 0){
      gameOver()
    } else {
      wrong()
    }
  }
}

// ===== GAME OVER =====

function gameOver(){

soundWrong.currentTime = 0
soundWrong.play()

screen.innerHTML = `

<h2>💔 Hết tim!</h2>

<p>Hãy thử lại nhé!</p>

<button onclick="resetHearts()">Chơi lại</button>

`

}

function resetHearts(){
  hearts = 5
  saveData()
  showHome()
}

function showProgress(){
  screen.innerHTML = `
    <h2>🏆 Tiến độ</h2>
    🚶 ${steps} bước
  `
}

function showSettings(){
  screen.innerHTML = `
    <h2>⚙ Cài đặt</h2>
    <button onclick="reset()">Reset tiến độ</button>
  `
}

function reset(){
  steps = 0
  streak = 1
  hearts = 5
  saveData()
  showHome()
}

// 🚀 START APP
showLogin()