const loginForm = document.getElementById("login");
loginForm.addEventListener("submit", async function(event) {
    event.preventDefault();

    const formData = new FormData(this); 
    const formDataJson = Object.fromEntries(formData.entries()); 

    const response = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(formDataJson)
    })
    .catch(error => {
        console.error("Erreur lors de la connexion :", error);
    });
    const data = await response.json()
    localStorage.setItem("token", data.token)
    if (localStorage.getItem("token")){
        window.location.href = "index.html"
    }
});