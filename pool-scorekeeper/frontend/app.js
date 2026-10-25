// SECTION CONTROL
function hideAllSections() {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = 'none');
}

function showNewGameMenu() {
  hideAllSections();
  document.getElementById("newGameMenu").style.display = "block";
}

function confirmGameMode() {
  const mode = document.getElementById("gameMode").value;

  hideAllSections();

  if (mode === "8ball") {
    document.getElementById("eightBallSection").style.display = "block";
  } else {
    document.getElementById("nineBallSection").style.display = "block";
  }
}