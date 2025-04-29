document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    const errorMsg = document.getElementById("error-msg");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const email = form.email.value.trim();
        const password = form.password.value.trim();

        if (!email || !password) {
            showError("Veuillez remplir tous les champs.");
            return;
        }

        try {
            // 1. Récupérer la clé publique du serveur
            const pubKeyRes = await fetch("https://localhost:7005/publickey");
            if (!pubKeyRes.ok) throw new Error("Impossible de récupérer la clé publique.");
            const publicKey = await pubKeyRes.text();

            // 2. Chiffrer le mot de passe avec la clé publique
            const encryptor = new JSEncrypt();
            encryptor.setPublicKey(publicKey);
            const encryptedPassword = encryptor.encrypt(password);

            if (!encryptedPassword) throw new Error("Erreur lors du chiffrement du mot de passe.");

            // 3. Envoyer les données en POST JSON
            const loginRes = await fetch("https://localhost:7005/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user: email,
                    pwd: encryptedPassword,
                }),
            });

            if (!loginRes.ok) throw new Error("Identifiants invalides.");

            // 4. Connexion réussie
            window.location.href = "index.html";

        } catch (err) {
            console.error(err);
            showError("Erreur : " + err.message);
        }
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.classList.remove("hidden");
    }
});
