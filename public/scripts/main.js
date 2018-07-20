function showPassword() {
    var x = document.getElementById("signUpPass");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}
