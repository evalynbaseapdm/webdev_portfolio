let status = document.getElementById("status");
let form = document.getElementById("form");
let inp = document.getElementById("nickname");
let year = document.getElementById("year");
let btn1 = document.getElementById("btn1");
let btn2 = document.getElementById("btn2");
let btn3 = document.getElementById("btn3");


form.addEventListener("mouseenter", function () {
    status.innerHTML = "You joined the form.";
});
form.addEventListener("mouseleave", function () {
    status.innerHTML = "You left the form.";
});


btn1.addEventListener("click", function () {
    let name = inp.value.trim() === "" ? "Evalyn" : inp.value;
    let msg = "Hi " + name + ", welcome to my profile!";
    if (year.selectedIndex > 0) {
        msg += " (" + year.value + ")";
    }
    status.innerHTML = msg;
});

btn2.addEventListener("dblclick", function () {
    status.innerHTML = "Double click!";
});

btn3.addEventListener("mousedown", function () {
    status.innerHTML = "Holding... waiting for interaction...";
});
btn3.addEventListener("mouseup", function () {
    status.innerHTML = "You let go!";
});

inp.addEventListener("mouseenter", function () {
    inp.style.backgroundColor = "#f3ecfb";
});
inp.addEventListener("mouseleave", function () {
    inp.style.backgroundColor = "white";
});