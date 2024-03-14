async function comingSoon() {
    await setTimeout(() => {
        setIdDisplay("landing-image", "block");
    }, 500);
    await setTimeout(() => {
        setIdDisplay("landing-text", "block");
    }, 2000);
    await setTimeout(() => {
        setIdDisplay("landing-image", "none");
    }, 4000);
    await setTimeout(() => {
        setIdDisplay("landing-text", "none");
    }, 4000);
    await setTimeout(() => {
        window.location.href = "links.html";
    }, 4500);
}

function setIdDisplay(Id, display) {
    document.getElementById(Id.toString()).style.display = display.toString();
    console.log(Id + " is set as: " + document.getElementById(Id.toString()).style.display);
}