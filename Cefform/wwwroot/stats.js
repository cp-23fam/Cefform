const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));
const container = document.getElementById("response-container");
const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const responsesList = document.getElementById("responses-list");
const colorBar = document.getElementById("color-bar");

// Fonction principale qui charge tout
async function loadFormAnswers() {
  try {
    // 1. Charger les infos du formulaire
    const form = await fetch(`${apiUrl}/form/${id}`).then((res) => res.json());

    if (!form) {
      container.innerHTML = `<p class="text-red-500 text-center">Formulaire introuvable.</p>`;
      return;
    }

    // Appliquer la couleur de l'utilisateur
    colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getMainColorFromCeff(
      form.user.ceff
    )}`;

    // Afficher les infos du formulaire
    title.textContent = form.name;
    description.textContent = form.description;

    // 2. Charger les questions
    const questions = await getQuestions(id);
    const flatQuestions = questions.flat();

    // 3. Charger les réponses
    const responses = await fetch(`${apiUrl}/form/${id}/answers`).then((res) =>
      res.json()
    );

    // 4. Grouper les réponses par question
    const grouped = {};
    responses.forEach((r) => {
      if (!grouped[r.questionIdquestion]) {
        grouped[r.questionIdquestion] = [];
      }
      grouped[r.questionIdquestion].push(r.content);
    });

    // 5. Afficher chaque question + ses réponses
    flatQuestions.forEach((q, index) => {
      const block = document.createElement("div");
      block.className = "bg-gray-50 p-4 rounded-lg border border-gray-200";

      const responses = grouped[q.idquestion] || [];

      block.innerHTML = `
        <h2 class="text-lg font-semibold mb-2">${q.content}</h2>
        ${
          responses.length === 0
            ? `<p class="text-sm text-gray-500 italic">Aucune réponse.</p>`
            : getFormattedResponses(q, responses)
        }
      `;

      responsesList.appendChild(block);
    });
  } catch (err) {
    console.error("Erreur lors du chargement :", err);
    container.innerHTML = `<p class="text-red-500 text-center">Erreur lors du chargement des données.</p>`;
  }
}

// Fonction pour afficher proprement les réponses selon le type de question
function getFormattedResponses(question, responses) {
  switch (question.type) {
    case 1: // choix unique
    case 2: // choix multiple
      const parts = question.content.split("\t");
      const questionText = parts[0];
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
