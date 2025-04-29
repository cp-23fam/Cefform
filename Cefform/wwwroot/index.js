const container = document.getElementById("card-container");

fetch("https://localhost:7005/api/form/list")
  .then((res) => res.json())
  .then((data) => {
    container.innerHTML = ``;
    container.className =
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:mx-8 lg:mx-20";
    data.forEach((form) => {
      const card = createCard(form);
      container.appendChild(card);
    });
    container.className =
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:mx-8 lg:mx-20";
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des données :", error);
    container.className = "flex items-center justify-center h-64";
    container.innerHTML = `<p class="text-red-500 text-center">Impossible de charger les formulaires.</p>`;
  });

// Fonction pour choisir la couleur latérale
function getColorClass(color) {
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

function createCard(form) {
  const link = document.createElement("a");
  link.href = `form.html?id=${form.id}`;
  link.className = "block";

  const card = document.createElement("div");
  card.className =
    "relative bg-gray-200 p-4 rounded-lg shadow flex flex-col justify-between hover:bg-gray-300 transition";

  card.innerHTML = `
    <div>
      <h2 class="text-lg font-semibold">${form.name}</h2>
      <p class="text-sm text-gray-600">${form.description}</p>
    </div>
    <div class="absolute top-0 right-0 h-full w-2 rounded-r-lg ${getColorClass(
      form.ceff
    )}"></div>
  `;

  link.appendChild(card);
  return link;
}

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.querySelector("a[href='login.html']");
  const header = document.getElementById("header-buttons");
  const userId = getCookie("userId");

  if (userId) {
    fetch(`https://localhost:7005/api/Users/${userId}`)
      .then((res) => {
        if (!res.ok)
          throw new Error("Erreur lors du chargement de l'utilisateur");
        return res.json();
      })
      .then((user) => {
        // Bouton vers le profil
        const userButton = document.createElement("a");
        userButton.href = `profile.html?id=${user.iduser}`;
        userButton.className =
          "bg-white text-gray-700 px-4 py-1 rounded border border-gray-300 hover:bg-gray-100 hidden lg:block";
        userButton.textContent = `${user.firstName} ${user.lastName}`;

        // Bouton "Créer un formulaire"
        const createFormButton = document.createElement("a");
        createFormButton.href = "create.html";
        createFormButton.className = `${getColorButtonClass(
          user.ceff
        )} text-white px-4 py-1 rounded transition hidden lg:block`;
        createFormButton.textContent = "Créer un formulaire";

        // Supprimer bouton login et insérer les deux boutons
        if (loginButton) loginButton.remove();
        header.appendChild(createFormButton);
        header.appendChild(userButton);
      })
      .catch((err) => {
        console.error("Impossible de charger les infos utilisateur :", err);
      });
  }
});

// Fonction utilitaire pour lire un cookie par nom
function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

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

function getColorButtonClass(color) {
  switch (color) {
    case 0:
      return "bg-green-500 hover:bg-green-600";
    case 1:
      return "bg-blue-500 hover:bg-blue-600";
    case 2:
      return "bg-purple-500 hover:bg-purple-600";
    case 3:
      return "bg-cyan-500 hover:bg-cyan-600";
    default:
      return "bg-gray-500 hover:bg-gray-600";
  }
}
