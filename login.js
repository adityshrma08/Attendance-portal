function loginUser() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    // Perform authentication logic here (e.g., check against a database)

    // For now, let's just redirect to another page
    if (username === "user" && password === "pass") {
        window.location.href = "attendance system.html";
    } else {
        alert("Invalid username or password. Please try again.");
    }

    // Prevent the form from submitting
    return false;
}
