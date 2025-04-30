// Récupérer l'ID de l'utilisateur depuis l'URL : ?id=1
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

// Elements HTML à remplir
const userName = document.getElementById("user-name");
const userEmail = document.getElementById("user-email");
const userFirstName = document.getElementById("user-firstname");
const userLastName = document.getElementById("user-lastname");
const userUsername = document.getElementById("user-username");
const userCeff = document.getElementById("user-ceff");
const formsList = document.getElementById("forms-list");
const editProfileBtn = document.getElementById("edit-profile-btn");

// Déconnexion
const logoutBtn = document.getElementById("logout");
logoutBtn.addEventListener("click", () => {
  deleteCookie("token"); // Pour rester cohérent même si on n'utilise pas de cookie ici
  window.location.href = "/";
});

// Redirection vers la page d'édition
editProfileBtn.addEventListener("click", () => {
  window.location.href = `edit-profile.html?id=${userId}`;
});

// Fonction pour traduire le numéro CEFF en texte
function getCeffText(ceff) {
  const ceffNames = [
    "CEFF Santé-Social",
    "CEFF Commerce",
    "CEFF Artisanat",
    "CEFF Industrie",
  ];
  return ceffNames[ceff] || "Non spécifié";
}

async function loadUserInfos() {
  user = await getSelfInfosByToken();
  // Mise à jour du contenu
  if (user.firstName != "" && user.lastName != "") {
    userName.textContent = `${user.firstName} ${user.lastName}`;
  } else {
    userName.textContent = `${user.username}`;
  }
  if (user.email != "") {
    userEmail.textContent = user.email;
  } else {
    userEmail.textContent = `aucun email enregistré`;
  }

  userUsername.innerHTML = user.username;
  userCeff.innerHTML = getCeffText(user.ceff);

  // Couleur latérale
  const colorBar = document.getElementById("color-bar");
  colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getMainColorFromCeff(
    user.ceff
  )}`;

  // Affichage des formulaires
  if (user.forms === undefined) {
    formsList.innerHTML = `<p class="text-gray-500">Aucun formulaire créé pour l’instant.</p>`;
  } else {
    formsList.innerHTML = "";
    user.forms.forEach((form) => {
      const div = document.createElement("div");
      div.className =
        "p-4 border rounded-md bg-gray-50 hover:shadow transition-shadow";

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
    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const formId = btn.dataset.id;
        if (confirm("Êtes-vous sûr de vouloir supprimer ce formulaire ?")) {
          fetch(`${apiUrl}/form/${formId}`, {
            method: "DELETE",
          })
            .then((res) => {
              if (!res.ok) throw new Error("Échec de suppression");
              alert("Formulaire supprimé.");
              window.location.reload();
            })
            .catch((err) => {
              console.error(err);
              alert("La suppression a échoué.");
            });
        }
      });
    });
  }
}

loadUserInfos();
