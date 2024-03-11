async function comingSoon() {
    await setTimeout(() => {
        setIdDisplay("landing-image", "block");
    }, 1000);
    await setTimeout(() => {
        setIdDisplay("landing-text", "block");
    }, 5000);
    await setTimeout(() => {
        setIdDisplay("landing-image", "none");
    }, 10000);
    await setTimeout(() => {
        setIdDisplay("landing-text", "none");
    }, 10000);
}

function setIdDisplay(Id, display) {
    document.getElementById(Id.toString()).style.display = display.toString();
    console.log(Id + " is set as: " + document.getElementById(Id.toString()).style.display);
}