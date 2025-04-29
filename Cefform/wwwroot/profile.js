// Récupérer l'ID de l'utilisateur depuis l'URL : ?id=1
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

// Point d’accès à l’API
const apiUrl = `https://localhost:7005/api/Users/${userId}`;

// Elements HTML à remplir
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const formsList = document.getElementById("forms-list");

// Déconnexion
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
    deleteCookie("userId"); // Pour rester cohérent même si on n'utilise pas de cookie ici
    window.location.href = "index.html";
});

// Fonction utilitaire : couleur Tailwind selon CEFF
function getMainColorFromCeff(color) {
    switch (color) {
        case 0:
            return "bg-green-300";
        case 1:
            return "bg-blue-400";
        case 2:
            return "bg-purple-400";
        case 3:
            return "bg-cyan-400";
        default:
            return "bg-gray-400";
    }
}

// Chargement de l'utilisateur et des formulaires
fetch(apiUrl)
    .then(res => {
        if (!res.ok) throw new Error("Utilisateur introuvable");
        return res.json();
    })
    .then(user => {
        // Mise à jour du contenu
        userName.textContent = `${user.firstName} ${user.lastName}`;
        userEmail.textContent = user.email;

        // Couleur latérale
        const colorBar = document.getElementById("color-bar");
        colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl ${getMainColorFromCeff(user.ceff)}`;

        // Affichage des formulaires
        if (user.forms.length === 0) {
            formsList.innerHTML = `<p class="text-gray-500">Aucun formulaire créé pour l’instant.</p>`;
        } else {
            formsList.innerHTML = "";
            user.forms.forEach(form => {
                const div = document.createElement("div");
                div.className = "p-4 border rounded-md bg-gray-50 hover:shadow transition-shadow";

                div.innerHTML = `
          <div class="flex justify-between items-center">
            <div>
              <h3 class="text-lg font-semibold">${form.name}</h3>
              <p class="text-sm text-gray-600">${form.description}</p>
              <p class="text-xs text-gray-500 mt-1">Créé le ${form.createTime}</p>
            </div>
            <div class="flex gap-2 ml-4">
              <a href="stats.html?id=${form.idform}" class="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">Voir Réponses</a>
              <a href="edit.html?id=${form.idform}" class="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Modifier</a>
              <button class="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 delete-btn" data-id="${form.idform}">Supprimer</button>
            </div>
          </div>
        `;

                formsList.appendChild(div);
            });

            // Attacher les listeners pour suppression
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", () => {
                    const formId = btn.dataset.id;
                    if (confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ?")) {
                        fetch(`https://localhost:7005/api/Form/${formId}`, {
                            method: "DELETE"
                        })
                            .then(res => {
                                if (!res.ok) throw new Error("Échec de suppression");
                                alert("Formulaire supprimé.");
                                window.location.reload();
                            })
                            .catch(err => {
                                console.error(err);
                                alert("La suppression a échoué.");
                            });
                    }
                });
            });
        }
    })
    .catch(err => {
        userName.textContent = "Erreur";
        userEmail.textContent = err.message;
        formsList.innerHTML = `<p class="text-red-500">Impossible de charger les données de l'utilisateur.</p>`;
    });


// 🔧 Cookie helpers (au cas où)
function deleteCookie(name) {
    document.cookie = `${name}=; path=/; max-age=0`;
}
