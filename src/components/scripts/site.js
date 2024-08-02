var myVar;
var root = document.documentElement;
var rndNum;
    
async function spinLoader() {
    var rndNum =  Math.random() * 2000;
    console.log(rndNum);
    window.scrollTo(0, 0);
    window.setTimeout(showPage, rndNum);
}

function showPage() {
    document.getElementById("loader").style.display = "none";
}

// Scroll Button

function scrollDown() {
    window.scroll({
        top: 1100,
        left: 0,
        behavior: "smooth",
    })
};

function scrollDown2() {
    window.scroll({
        top: 2000,
        left: 0,
        behavior: "smooth",
    })
};

function scrollDown3() {
    window.scroll({
        top: 3000,
        left: 0,
        behavior: "smooth",
    })
};

function scrollDown4() {
    window.scroll({
        top: 4000,
        left: 0,
        behavior: "smooth",
    })
};

function scrollUp() {
    window.scroll({
        top: 0,
        left: 0,
        behavior: "smooth",
    })
};