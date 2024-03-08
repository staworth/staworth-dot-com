async function comingSoon() {
    document.getElementById("landing-image").style.display = "None";
    document.getElementById("landing-text").style.display = "None";
    setTimeout(
        showLandingImage,
        1000
    )
    setTimeout(
        showLandingText,
        3000
    )
}

function showLandingImage() {
    document.getElementById("landing-image").style.display = "block";
}

function showLandingText() {
    document.getElementById("landing-text").style.display = "block";
}