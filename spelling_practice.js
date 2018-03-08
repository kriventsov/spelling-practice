/*!
 * The following code displays a spelling practice exercise
 *
 * The interface is available in English and Russian
 * To switch to the Russian interface, call the useRussian() function
 * 
 * Replace www.mysite.com below with the address of your site
 *
 * @author Stan Kriventsov (stan@kriventsov.com)
 *
*/

var phpLocation = "http://www.mysite.com/spelling_practice.php";

var rawContent = []; dataContent = [];
var currentWord = -1; numRight = 0; numTotal = 0;
var rightAnswer, isAnswered, oneWordData, isNewTry; 
var startTime, setIntervalId;

var topSpelling = document.getElementById("top-spelling");
var selectLevel = document.getElementById("select-level");
var subSpelling = document.getElementById("sub-spelling");
var spellingSelect = document.getElementById("spelling-select");
var northAm = document.getElementById("north-am");
var nextWordButton = document.getElementById('next-word-button');
var wordsLeft = document.getElementById('words-left');
var timerMessage = document.getElementById('timer-message');
var correctTotal = document.getElementById('correct-total');
var misspelledTitle = document.getElementById('misspelled-title');
var misspelled = document.getElementById('misspelled');

var topSpellingStr = "Spelling practice";
var selectLevelStr = "Choose your level:";
var subSpellingStr = "Choose the right spelling of the word";
var rightOptionsStr = ["Exactly!", "Right on!", "Yes!", "Good job!", "That's it!", "Correct"];
var wrongOptionsStr = ["Wrong!", "Not really", "Nope", "Try again!" ];
var northAmStr1 = "The North American spelling ";
var northAmStr2 = " is also correct";
var correctAnswersStr = "Correct answers: ";
var misspelledWordsStr = "Misspelled words: ";
var wordsLeftStr = "Words left: ";
var timeStr = "Time: ";
var nextWordStr = "Next word";
var endOfExerciseStr = "End of exercise";
var restartExerciseStr = "Restart exercise";

function initScreen() {
  topSpelling.innerHTML = topSpellingStr;
  selectLevel.innerHTML = selectLevelStr;
  subSpelling.innerHTML = subSpellingStr;
}

function useRussian() {
  rightOptionsStr = ["Правильно!", "Именно так!", "Да!"];
  wrongOptionsStr = ["Неправильно!", "Ошибка!", "Нет!", "Не так!"];
  northAmStr1 = "Американский вариант ";
  northAmStr2 = " также правилен";
  correctAnswersStr = "Правильные ответы: ";
  misspelledWordsStr = "Ошибки: ";
  wordsLeftStr = "Осталось слов: ";
  timeStr = "Время:  ";
  nextWordStr = "Следующее слово";
  endOfExerciseStr = "Конец упражнения";
  restartExerciseStr = "Начать сначала";
  topSpellingStr = "Практика написания слов";
  selectLevelStr = "Выберите ваш уровень:";
  subSpellingStr = "Выберите правильный вариант написания слова";
  initScreen();
}

function addZeroIfOneDigit (n) { 
  if (n<10) { return ("0" + n); } else { return n; }
}

function restartTimer() {
  startTime = new Date().getTime();
  setIntervalId = setInterval( function() {
	var elapsedTime = (new Date().getTime()) - startTime;
    var days = Math.floor(elapsedTime / (1000 * 60 * 60 * 24));
    var hours = addZeroIfOneDigit(Math.floor((elapsedTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
    var minutes = addZeroIfOneDigit(Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60)));
    var seconds = addZeroIfOneDigit(Math.floor((elapsedTime % (1000 * 60)) / 1000));
	var elapsedTimeStr = minutes + ":" + seconds;
	if (days>0) { elapsedTimeStr = days + ":" + hours + ":" + elapsedTimeStr; }
	else if (hours>0) { elapsedTimeStr = hours + ":" + elapsedTimeStr; }
	timerMessage.innerHTML = timeStr + elapsedTimeStr;	
  }, 1000);
}

function drawWordButton(n) {
  var htmlStr = "<form onsubmit='return checkAnswer(" + n + ")' action=''> <input type='submit' id='Button1' value='" + oneWordData[n] + "' class='btn btn-large btn-primary animated bounceIn spell-button'> </form>";
  document.getElementById('b' + n).innerHTML = htmlStr;
}

function showWord(n) {
  var htmlStr = '<span style="color:';
  if (rightAnswer==n) { htmlStr += 'blue'; } else { htmlStr += 'red;  opacity: 0.1'; }
  htmlStr += ';"> ' + oneWordData[n] + '</span>';
  document.getElementById('b' + n).innerHTML = htmlStr;
}

function showRightWrongMessage(n) {
  var options;
  if (isAnswered) { options = rightOptionsStr; } else { options = wrongOptionsStr; }
  document.getElementById('rw' + n).innerHTML = options[Math.floor(Math.random() * (options.length))];
}

function clearRightWrongMessages() {
  for (var i=1; i<=3; i++) { document.getElementById('rw' + i).innerHTML = ""; }
}

function errorCounterMessage() {
  var htmlStr = correctAnswersStr + numRight + "/" + numTotal;
  if (numTotal>0) { htmlStr += " (" + Math.floor(numRight*100/numTotal) + "%)"; }
  correctTotal.innerHTML = htmlStr;
}

function adjustRightPanel() {  // adjusts the right panel in the middle of an exercise
  if (isNewTry) {
    numTotal++;
    if (isAnswered) { numRight++; } 
	else { 
	  var tmp = numTotal - numRight; 
	  misspelledTitle.innerHTML = misspelledWordsStr + tmp; 
	}
    errorCounterMessage();
  }
  else {
	if (isAnswered) { misspelled.innerHTML += "<p>" + oneWordData[rightAnswer] + "</p>"; }
  }
}

function refreshRightPanel() {  // refreshes the right panel to default values at the beginning of a new exercise
  numRight = 0;
  numTotal = 0;
  errorCounterMessage();
  misspelledTitle.innerHTML = misspelledWordsStr + "0";
  misspelled.innerHTML = "";  
  wordsLeft.innerHTML = wordsLeftStr + dataContent.length;
  timerMessage.innerHTML = timeStr + "00:00";
  nextWordButton.value = nextWordStr;
  restartTimer();
}

function shuffleWords() {
  var randN, tmp;
  for (var i = dataContent.length - 1; i > 0; i--) {
	randN = Math.floor(Math.random() * (i+1));
	tmp = dataContent[randN];
	dataContent[randN] = dataContent[i];
	dataContent[i] = tmp;
  }
}

function shuffleQuestion() {
  var randN, tmp;
  rightAnswer = 1;
  for (var i = 3; i > 1; i--) {
	randN = Math.floor(Math.random() * i) + 1;
	tmp = oneWordData[randN];
	oneWordData[randN] = oneWordData[i];
	oneWordData[i] = tmp;
	if (rightAnswer==randN) { rightAnswer = i; }
	else if (rightAnswer==i) { rightAnswer = randN; }
  }
}

function nextWord() {
  currentWord++;
  if (currentWord==dataContent.length) { 
    currentWord = 0; 
	shuffleWords();
	refreshRightPanel();
  }
  nextWordButton.style.display = "none";
  northAm.innerHTML = "";
  northAm.style.display = "none";
  isNewTry = true;
  clearRightWrongMessages();
  oneWordData = dataContent[currentWord].split("|");
  shuffleQuestion();
  for (var i=1; i<4; i++) { drawWordButton(i); }
  isAnswered = false;
  return false;
}

function filterWords() {
  dataContent = [];
  clearInterval(setIntervalId);
  var filter = spellingSelect.value;
  for (var i=0; i<rawContent.length; i++) {
	oneWordData = rawContent[i].split("|");
	if (oneWordData[0] == filter) { dataContent.push(rawContent[i]); }
  }
  currentWord = -1;
  shuffleWords();
  refreshRightPanel();
  nextWord();
}

function checkAnswer(n) {
  if (isAnswered) { return false; } else { isAnswered = (n==rightAnswer); }
  adjustRightPanel();
  showRightWrongMessage(n);
  isNewTry = false;
  if (isAnswered) { 
    for (var i=1; i<4; i++) { showWord(i); }
	nextWordButton.style.display = "block";
	var tmp = dataContent.length - numTotal;
    wordsLeft.innerHTML = wordsLeftStr + tmp;
	if (oneWordData.length == 5) {
	  northAm.innerHTML = northAmStr1 + '<span style="color:blue; font-size:18px;">' + oneWordData[4] + '</span>' + northAmStr2;
	  northAm.style.display = "block";
	}
  } 
  else { 
    showWord(n); 
  }
  if (isAnswered && (currentWord==dataContent.length - 1)) {
	clearInterval(setIntervalId);
	wordsLeft.innerHTML = endOfExerciseStr;
	nextWordButton.value = restartExerciseStr;
  }
  return false;
}

initScreen();	

$.ajax({ 
  url: phpLocation, 
  type:"POST", 
  success:function(data){ rawContent = JSON.parse(data); console.log(rawContent); filterWords(); }, 
  error: function(errorThrown){ alert(errorThrown); } 
});


