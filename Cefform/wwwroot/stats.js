const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const container = document.getElementById("response-container");
const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const responsesList = document.getElementById("responses-list");
const colorBar = document.getElementById("color-bar");

let allQuestions = [];
let allResponses = [];
let form = null;

async function loadFormAnswers() {
  try {
    // Charger les infos du formulaire
    form = await fetch(`${apiUrl}/form/${id}`).then((res) => res.json());

    if (!form) {
      container.innerHTML = `<p class="text-red-500 text-center">Formulaire introuvable.</p>`;
      return;
    }

    // Appliquer la couleur CEFF
    colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getMainColorFromCeff(
      form.user.ceff
    )}`;

    // Afficher nom + description
    title.textContent = form.name;
    description.textContent = form.description;

    // Récupérer les questions
    const questions = await getQuestions(id);
    allQuestions = questions.flat();

    // Récupérer toutes les réponses
    const responses = await fetch(`${apiUrl}/form/${id}/answers`).then((res) =>
      res.json()
    );
    allResponses = responses;

    // Si le formulaire n'est pas anonyme, on insère le filtre utilisateur
    if (!form.anonym || form.anonym === 0) {
      createUserSelect(responses);
    }

    // Afficher les réponses (toutes par défaut)
    renderAnswers(responses);
  } catch (err) {
    console.error("Erreur lors du chargement :", err);
    container.innerHTML = `<p class="text-red-500 text-center">Erreur lors du chargement des données.</p>`;
  }
}

// Affiche les réponses groupées par question (filtrées ou pas)
function renderAnswers(responses) {
  responsesList.innerHTML = "";

  const grouped = {};
  responses.forEach((r) => {
    if (!grouped[r.questionIdquestion]) {
      grouped[r.questionIdquestion] = [];
    }
    grouped[r.questionIdquestion].push(r.content);
  });

  if (allQuestions.length === 0) {
    responsesList.innerHTML = `<p class="text-gray-500 italic mt-6">Aucune question n'a été définie pour ce formulaire.</p>`;
    return;
  }

  allQuestions.forEach((q) => {
    const block = document.createElement("div");
    block.className = "bg-gray-50 p-4 rounded-lg border border-gray-200";

    const resps = grouped[q.idquestion] || [];

    block.innerHTML = `
      <h2 class="text-lg font-semibold mb-2">${q.content.split("\t")[0]}</h2>
      ${
        resps.length === 0
          ? `<p class="text-sm text-gray-500 italic">Aucune réponse.</p>`
          : getFormattedResponses(q, resps)
      }
    `;

    responsesList.appendChild(block);
  });
}

async function createUserSelect(responses) {
  const userIds = [...new Set(responses.map((r) => r.userIduser))];

  const usersMap = new Map();

  // Charger les infos de chaque user
  await Promise.all(
    userIds.map(async (id) => {
      try {
        const user = await fetch(`${apiUrl}/user/${id}`).then((res) =>
          res.json()
        );

        let label = user.username;
        if (user.firstName && user.lastName) {
          label = `${user.firstName} ${user.lastName} - ${user.username}`;
        }

        usersMap.set(id, label);
      } catch (e) {
        console.warn(`Erreur lors du chargement de l'utilisateur ${id}`, e);
        usersMap.set(id, `Utilisateur id : ${id}`);
      }
    })
  );

  if (usersMap.size === 0) return;

  const wrapper = document.createElement("div");
  wrapper.className = "my-4";

  const label = document.createElement("label");
  label.textContent = "Voir les réponses de :";
  label.className = "block mb-1 text-sm text-gray-700";

  const select = document.createElement("select");
  select.className =
    "w-full sm:w-auto border border-gray-300 rounded px-3 py-2 text-sm";

  // Option globale = toutes les réponses
  const allOption = document.createElement("option");
  allOption.value = "";
  allOption.textContent = "Tous les utilisateurs";
  select.appendChild(allOption);

  // Ajouter chaque utilisateur
  usersMap.forEach((name, id) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = name;
    select.appendChild(opt);
  });

  // Filtrer les réponses par utilisateur sélectionné
  select.addEventListener("change", async () => {
    const selectedUserId = select.value;

    let filtered = allResponses;

    if (selectedUserId) {
      const res = await fetch(
        `${apiUrl}/form/${id}/answers?userId=${selectedUserId}`
      ).then((r) => r.json());
      filtered = res;
    }

    renderAnswers(filtered);
  });

  wrapper.appendChild(label);
  wrapper.appendChild(select);
  description.after(wrapper); // Insert après la description
}

// Fonction pour afficher proprement les réponses selon le type de question
function getFormattedResponses(question, responses) {
  switch (question.type) {
    case 1: // choix unique
    case 2: // choix multiple
      const parts = question.content.split("\t");
      const options = parts.slice(1);

      const counts = new Array(options.length).fill(0);

      responses.forEach((resp) => {
        if (question.type === 2) {
          // checkbox -> peut contenir plusieurs indices
          resp.split("").forEach((char) => {
            const idx = parseInt(char);
            if (!isNaN(idx)) counts[idx]++;
          });
        } else {
          // radio -> une seule valeur
          const idx = parseInt(resp);
          if (!isNaN(idx)) counts[idx]++;
        }
      });

      return `
        <ul class="space-y-1 text-sm">
          ${options
            .map(
              (opt, i) =>
                `<li class="flex justify-between"><span>${opt}</span><span class="text-gray-500">${counts[i]} réponses</span></li>`
            )
            .join("")}
        </ul>
      `;

    case 3: // date
    case 4: // nombre
    default:
      return `
        <ul class="list-disc ml-5 space-y-1 text-sm text-gray-800">
          ${responses.map((r) => `<li>${r}</li>`).join("")}
        </ul>
      `;
  }
}

async function getQuestions(id) {
  return await fetch(`${apiUrl}/form/${id}/questions`)
    .then((res) => res.json())
    .then((data) => data);
}

function createBottomButtons() {
  const buttonWrapper = document.createElement("div");
  buttonWrapper.className =
    "mt-10 flex flex-col sm:flex-row justify-end gap-4 border-t pt-6";

  const backButton = document.createElement("a");
  backButton.href = "/profile.html";
  backButton.textContent = "Retour";
  backButton.className =
    "px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition text-sm";

  const resetButton = document.createElement("button");
  resetButton.textContent = "Réinitialiser les réponses";
  resetButton.className =
    "px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition text-sm";

  resetButton.addEventListener("click", async () => {
    const confirmDelete = confirm(
      "Es-tu sûr de vouloir supprimer toutes les réponses ? Cette action est irréversible."
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${apiUrl}/form/${id}/answers`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Erreur lors de la suppression des réponses.");
        return;
      }

      alert("Réponses supprimées avec succès.");
      location.reload();
    } catch (err) {
      console.error(err);
      alert("Erreur réseau ou serveur.");
    }
  });

  buttonWrapper.appendChild(backButton);
  buttonWrapper.appendChild(resetButton);
  container.appendChild(buttonWrapper);
}

loadFormAnswers().then(createBottomButtons);
