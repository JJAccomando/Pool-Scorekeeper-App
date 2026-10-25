// MATCH STATE (data only)
window.currentMatch = {
  mode: "8ball",
  player1: "",
  player2: "",
  raceTo: 0,
  lagWinner: "",
  break: "",
  previousAction: ["none"],
  currentShooter: "",
  currentInning: 1,
  currentGame: 1,
  scoreP1: 0,
  scoreP2: 0,
  defenseP1: 0,
  defenseP2: 0,
};

// START 8-BALL SETUP
function startEightBallGame() {
  const p1 = document.getElementById("player1Name").value;
  const p2 = document.getElementById("player2Name").value;
  const race = document.getElementById("raceTo").value;

  if (!p1 || !p2 || !race) {
    alert("Please enter both player names and race-to value.");
    return;
  }

  window.currentMatch.player1 = p1;
  window.currentMatch.player2 = p2;
  window.currentMatch.raceTo = parseInt(race);

  hideAllSections();

  document.getElementById("lagP1Btn").innerText = p1;
  document.getElementById("lagP2Btn").innerText = p2;

  document.getElementById("lagWinnerSection").style.display = "block";
}

function goBackToEightBallSetup() {
  hideAllSections();
  document.getElementById("eightBallSection").style.display = "block";
}

// LAG WINNER → SCOREBOARD
function selectLagWinner(winner) {
  const match = window.currentMatch;

  match.lagWinner = winner;
  match.break = winner;
  match.currentShooter = winner;
  match.currentInning = 1;
  match.currentGame = 1;

  match.scoreP1 = 0;
  match.scoreP2 = 0;
  match.defenseP1 = 0;
  match.defenseP2 = 0;

  hideAllSections();

  document.getElementById("scoreboardTitle").innerText =
    `${match.player1} vs ${match.player2}`;

  document.getElementById("p1Name").innerText = match.player1;
  document.getElementById("p2Name").innerText = match.player2;

  document.getElementById("raceToDisplay").innerText = match.raceTo;
  document.getElementById("breakDisplay").innerText =
    winner === "player1" ? match.player1 : match.player2;

  document.getElementById("gameHeader").innerText =
    `Game ${match.currentGame}`;

  updateShooterHighlight();

  document.getElementById("scoreboardSection").style.display = "block";
}

// SHOOTER HIGHLIGHT
function updateShooterHighlight() {
  const match = window.currentMatch;

  document.getElementById("player1Box").classList.remove("activeShooter");
  document.getElementById("player2Box").classList.remove("activeShooter");

  if (match.currentShooter === "player1") {
    document.getElementById("player1Box").classList.add("activeShooter");
  } else {
    document.getElementById("player2Box").classList.add("activeShooter");
  }
}

// NEXT SHOOTER + INNING LOGIC
function nextShooter() {
  const match = window.currentMatch;

  const previousShooter = match.currentShooter;
  const previousInning = match.currentInning;
  let inningIncreased = false;

  // Switch shooter
  match.currentShooter =
    match.currentShooter === "player1" ? "player2" : "player1";

  // Update previous action
  match.previousAction.push("nextShooter");

  // Inning logic: ONLY when turn returns to ORIGINAL lag winner
  if (match.currentShooter === match.lagWinner) {
    match.currentInning++;
    inningIncreased = true;
    document.getElementById("inningDisplay").innerText = match.currentInning;
  }

  updateShooterHighlight();
}

// DEFENSE COUNTERS
function addDefense() {
  const match = window.currentMatch;

  if (match.currentShooter === "player1") {
    match.defenseP1++;
    document.getElementById("p1Defense").innerText = match.defenseP1;
  } else {
    match.defenseP2++;
    document.getElementById("p2Defense").innerText = match.defenseP2;
  }

  // Update previous action
  match.previousAction.push("defense");

}

// POINTS
function addPoint(player) {
  const match = window.currentMatch;

  if (player === "p1") {
    match.scoreP1++;
    document.getElementById("p1Score").innerText = match.scoreP1;
  } else {
    match.scoreP2++;
    document.getElementById("p2Score").innerText = match.scoreP2;
  }
}

// FINISH GAME MODAL
function finishGame() {
  hideAllSections();
  document.getElementById("finishModal").style.display = "block";
}

function cancelFinish() {
  hideAllSections();
  document.getElementById("scoreboardSection").style.display = "block";
}

// END GAME LOGIC
function endGame(result) {
  const match = window.currentMatch;

  let winner;
  if (result === "win") {
    winner = match.currentShooter;
  } else {
    winner = match.currentShooter === "player1" ? "player2" : "player1";
  }

  // Update score
  if (winner === "player1") {
    match.scoreP1++;
    document.getElementById("p1Score").innerText = match.scoreP1;
  } else {
    match.scoreP2++;
    document.getElementById("p2Score").innerText = match.scoreP2;
  }

  // Check race-to
  if (match.scoreP1 == match.raceTo || match.scoreP2 == match.raceTo) {
    showMatchSummary();
    return;
  }

  // Prepare next game
  match.currentGame++;

  // BREAK GOES TO WINNER OF PREVIOUS GAME
  match.break = winner;
  match.currentShooter = match.break;

  // Update UI
  document.getElementById("gameHeader").innerText =
    `Game ${match.currentGame} of Race to ${match.raceTo}`;

  document.getElementById("breakDisplay").innerText =
    winner === "player1" ? match.player1 : match.player2;

  updateShooterHighlight();

  hideAllSections();
  document.getElementById("scoreboardSection").style.display = "block";
}

// MATCH SUMMARY
function showMatchSummary() {
  alert("Match Over! Summary screen coming next.");
}

// UNDO ACTION
function undoAction() {
  const match = window.currentMatch;

  // Inning = 1 and no actions to undo
  if (match.previousAction[match.previousAction.length - 1] === "none") {
    hideAllSections();
    document.getElementById("lagWinnerSection").style.display = "block";
  }

  
  // Undo last action based on previousAction
  if (match.previousAction[match.previousAction.length - 1] === "defense") {
    if (match.currentShooter === "player1") {
      match.defenseP1--;
      document.getElementById("p1Defense").innerText = match.defenseP1;
    } else if (match.currentShooter === "player2") {
      match.defenseP2--;
      document.getElementById("p2Defense").innerText = match.defenseP2;
    }
    match.previousAction.pop();
  } else if (match.previousAction[match.previousAction.length - 1] === "nextShooter") {
      if (match.currentShooter !== match.break) {
        match.currentShooter = match.currentShooter === "player1" ? "player2" : "player1";
        updateShooterHighlight();
      } else {
        match.currentShooter = match.currentShooter === "player1" ? "player2" : "player1";
        updateShooterHighlight();
        match.currentInning--;
        document.getElementById("inningDisplay").innerText = match.currentInning;
      }
      match.previousAction.pop();
  } 

}
