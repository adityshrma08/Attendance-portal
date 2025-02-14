function loginUser() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    fetch('http://localhost:5000/login', { // Send request to the backend for login
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username, password: password })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            window.location.href = "attendance system.html"; // Redirect on success
        } else {
            alert(data.message); // Show error message if login fails
        }
    })
    .catch(error => console.error('Error:', error));

    return false; // Prevent form submission
}
