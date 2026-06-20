const form = document.getElementById("registerForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const userData = {
        username: document.getElementById("username").value,
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    const response = await fetch(
        "/api/auth/register",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify(userData)
        }
    );

    const data = await response.json();

    if(response.ok){

        localStorage.setItem(
            "accessToken",
            data.accessToken
        );

        alert("Registration Successful");

        window.location.href = "/login.html";
    }
    else{
        alert(data.message);
    }

});