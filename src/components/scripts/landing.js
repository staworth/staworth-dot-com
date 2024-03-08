async function comingSoon() {
    document.getElementById("landing-text").style.display = "None";
    setTimeout(showLandingText, 3000)
}

function showLandingText() {
    document.getElementById("landing-text").style.display = "block";
}