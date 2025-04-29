// Récupérer l'ID de l'utilisateur depuis l'URL : ?id=1
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

// Point d’accès à l’API
const apiUrl = `https://localhost:7005/api/Users/${userId}`;

// Elements HTML à remplir
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const formsList = document.getElementById("forms-list");

// Fonction qui donne la couleur en classe Tailwind
function getColorClassFromCeff(color) {
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
        colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getColorClassFromCeff(user.ceff)}`;

        if (user.forms.length === 0) {
            formsList.innerHTML = `<p class="text-gray-500">Aucun formulaire créé pour l’instant.</p>`;
        } else {
            formsList.innerHTML = "";
            user.forms.forEach(form => {
                const div = document.createElement("div");
                div.className = "p-4 border rounded-md bg-gray-50 hover:shadow transition-shadow";

                div.innerHTML = `
                    <h3 class="text-lg font-semibold">${form.name}</h3>
                    <p class="text-sm text-gray-600">${form.description}</p>
                    <p class="text-xs text-gray-500 mt-1">Créé le ${form.createTime}</p>
                `;

                formsList.appendChild(div);
            });
        }
    })
    .catch(err => {
        userName.textContent = "Erreur";
        userEmail.textContent = err.message;
        formsList.innerHTML = `<p class="text-red-500">Impossible de charger les données de l'utilisateur.</p>`;
    });
