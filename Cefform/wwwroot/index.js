const container = document.getElementById("card-container");

fetch(`${apiUrl}/form/list`)
  .then((res) => res.json())
  .then((data) => {
    container.innerHTML = "";
    data.forEach((form) => {
      const card = createCard(form);
      container.appendChild(card);
    });
  })
  .catch((error) => {
    console.error("Erreur lors de la récupération des données :", error);
    container.className = "flex items-center justify-center h-64";
    container.innerHTML = `<p class="text-red-500 text-center">Impossible de charger les formulaires.</p>`;
  });

function createCard(form) {
  const link = document.createElement("a");
  link.href = `form.html?id=${form.id}`;
  link.className = "block";

  const card = document.createElement("div");
  card.className =
    "relative bg-gray-200 p-4 rounded-lg shadow flex flex-col justify-between hover:bg-gray-300 transition";

  card.innerHTML = `
      <h2 class="text-lg font-semibold">${form.name}</h2>
      <p class="text-sm text-gray-600">${form.description}</p>
    </div>
    <div class="absolute top-0 right-0 h-full w-2 rounded-r-lg bg-${getMainColorFromCeff(
      form.ceff
    )}">
  `;

  link.appendChild(card);
  return link;
}

document.addEventListener("DOMContentLoaded", async () => {
  const loginButton = document.querySelector("a[href='login.html']");
  const header = document.getElementById("header-buttons");

  const infos = await getSelfInfosByToken();

  if (infos != null) {
    const userButton = document.createElement("a");
    userButton.href = `profile.html`;
    userButton.className =
      "bg-white text-gray-700 px-4 py-1 rounded border border-gray-300 hover:bg-gray-100 hidden lg:block";
    if (infos.firstName != "" && infos.lastName != "") {
      userButton.textContent = `${infos.firstName} ${infos.lastName}`;
    } else {
      userButton.textContent = `${infos.username}`;
    }

    // Bouton "Créer un formulaire"
    const createFormButton = document.createElement("a");
    createFormButton.href = `create.html`;
    createFormButton.className = `${getMainColorButtonFromCeff(
      infos.ceff
    )} text-white px-4 py-1 rounded transition hidden lg:block`;
    createFormButton.textContent = "Créer un formulaire";

    // Supprimer bouton login et insérer les deux boutons
    if (loginButton) loginButton.remove();
    header.appendChild(createFormButton);
    header.appendChild(userButton);
  }
});
