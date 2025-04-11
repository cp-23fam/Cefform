document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const errorMsg = document.getElementById("error-msg");

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // empêche le rechargement de la page

        const email = form.email.value.trim();
        const password = form.password.value.trim();

        // Exemple de vérification basique
        if (!email || !password) {
            showError("Veuillez remplir tous les champs.");
            return;
        }

        // Simule une requête d'authentification
        fetch("https://exemple.com/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            .then(res => {
                if (!res.ok) throw new Error("Échec de la connexion");
                return res.json();
            })
            .then(data => {
                // Redirection ou stockage du token selon le backend
                localStorage.setItem("token", data.token);
                window.location.href = "dashboard.html";
            })
            .catch(err => {
                showError("Adresse email ou mot de passe incorrect.");
            });
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove("hidden");
    }
});
