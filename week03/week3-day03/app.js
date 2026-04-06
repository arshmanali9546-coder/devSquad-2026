const loginForm = document.getElementById("loginForm")
const signupForm = document.getElementById("signupForm")

function showSignup() {

    loginForm.classList.add("hidden")
    signupForm.classList.remove("hidden")

}

function showLogin() {

    signupForm.classList.add("hidden")
    loginForm.classList.remove("hidden")

}