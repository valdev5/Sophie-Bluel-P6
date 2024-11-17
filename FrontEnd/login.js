document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login");
    const errorMessage = document.getElementsByClassName("error")[0];

    if (loginForm && errorMessage) {
        loginForm.addEventListener("submit", async function (event) {
            event.preventDefault();

            const formData = new FormData(this);
            const formDataJson = Object.fromEntries(formData.entries());

            try {
                const response = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formDataJson),
                });

                const data = await response.json();
                console.log(data.token);

                if (data.token) {
                    localStorage.setItem("token", data.token);
                    window.location.href = "index.html";
                } else {
                    errorMessage.style.display = "block";
                    errorMessage.style.color = "red";
                }
            } catch (error) {
                console.error("Login error:", error);
                errorMessage.style.display = "block";
                errorMessage.style.color = "red";
            }
        });
    } else {
        console.error("Login form or error message element not found in the DOM.");
    }
});
