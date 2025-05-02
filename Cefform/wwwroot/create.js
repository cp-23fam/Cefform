const sectionsContainer = document.getElementById("sections-container");
const addSectionBtn = document.getElementById("add-section-btn");

const params = new URLSearchParams(window.location.search);

const titleBar = document.getElementById("title-lbl");
const descriptionBar = document.getElementById("description-lbl");
const colorBar = document.getElementById("color-bar");
const createBtn = document.getElementById("create-btn");
const cancelBtn = document.getElementById("cancel-btn");

async function loadCeffComponents() {
  const infos = await getSelfInfosByToken();
  titleBar.className = `w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-${getMainColorFromCeff(
    infos.ceff
  )}`;
  descriptionBar.className = `w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-${getMainColorFromCeff(
    infos.ceff
  )}`;
  colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getMainColorFromCeff(
    infos.ceff
  )}`;
  createBtn.className = `${getMainColorButtonFromCeff(
    infos.ceff
  )} text-white px-6 py-2 rounded transition`;
  cancelBtn.className = `px-6 py-2 rounded border border-${getMainColorFromCeff(
    infos.ceff
  )} text-gray-700 hover:bg-gray-100 transition`;
}

loadCeffComponents();

// Types disponibles
const questionTypes = [
  "Texte",
  "Choix Unique",
  "Date",
  "Nombre",
  "Choix Multiple",
];

let sectionCount = 0;

// Fonction utilitaire pour créer un bouton "poubelle" avec SVG
function createTrashButton(title = "Supprimer") {
  const button = document.createElement("button");
  button.className =
    "border border-red-500 text-red-500 px-2 py-1 rounded focus:outline-none hover:bg-red-100 transition";
  button.title = title;
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 
        0H7m4-4h2a2 2 0 012 2v2H7V5a2 2 0 012-2z" />
    </svg>`;
  return button;
}

addSectionBtn.addEventListener("click", () => {
  sectionCount++;
  const sectionId = `section-${sectionCount}`;

  const sectionDiv = document.createElement("div");
  sectionDiv.className = "bg-white p-4 rounded-lg shadow-md mb-4 relative";
  sectionDiv.id = sectionId;

  const deleteSectionBtn = createTrashButton("Supprimer la section");
  deleteSectionBtn.classList.add("absolute", "top-2", "right-2");
  deleteSectionBtn.addEventListener("click", () => sectionDiv.remove());

  sectionDiv.innerHTML = `
    <input type="text" placeholder="Nom de section..." class="border-b border-gray-400 w-full mb-2 focus:outline-none">
    <div class="questions-container space-y-2 mb-4"></div>
    <button class="add-question-btn text-sm text-gray-700 hover:underline">+ Ajouter une question</button>
  `;

  sectionDiv.appendChild(deleteSectionBtn);
  sectionsContainer.appendChild(sectionDiv);

  const addQuestionBtn = sectionDiv.querySelector(".add-question-btn");
  const questionsContainer = sectionDiv.querySelector(".questions-container");

  addQuestionBtn.addEventListener("click", () => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "bg-gray-100 p-3 rounded relative";

    const deleteQuestionBtn = createTrashButton("Supprimer la question");
    deleteQuestionBtn.classList.add("absolute", "top-2", "right-2");
    deleteQuestionBtn.addEventListener("click", () => questionDiv.remove());

    questionDiv.innerHTML = `
      <div class="flex items-center justify-between mb-2 gap-2">
        <input type="text" placeholder="Intitulé de la question..." class="flex-grow min-w-[200px] px-2 py-1 rounded border focus:outline-none">
        <button class="delete-question border border-red-500 text-red-500 px-2 py-1 rounded hover:bg-red-100 transition" title="Supprimer la question">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m2 
              0H7m4-4h2a2 2 0 012 2v2H7V5a2 2 0 012-2z" />
          </svg>
        </button>
      </div>
      <div class="flex flex-wrap gap-2 mb-2">
        ${questionTypes
          .map(
            (type) => `
          <button type="button" class="type-btn text-sm border px-2 py-1 rounded hover:bg-gray-200" data-type="${type}">
            ${type}
          </button>`
          )
          .join("")}
      </div>
      <div class="answer-preview text-gray-500 text-sm italic mb-2">Type : aucun sélectionné</div>
      <div class="options-container hidden space-y-2"></div>
    `;

    const deleteQuestionTrashBtn =
      questionDiv.querySelector(".delete-question");
    deleteQuestionTrashBtn.addEventListener("click", () =>
      questionDiv.remove()
    );

    questionsContainer.appendChild(questionDiv);

    const typeButtons = questionDiv.querySelectorAll(".type-btn");
    const preview = questionDiv.querySelector(".answer-preview");
    const optionsContainer = questionDiv.querySelector(".options-container");

    typeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const selectedType = btn.getAttribute("data-type");
        preview.textContent = `Type : ${selectedType}`;

        optionsContainer.innerHTML = "";
        optionsContainer.classList.add("hidden");

        if (
          selectedType === "Choix Unique" ||
          selectedType === "Choix Multiple"
        ) {
          optionsContainer.classList.remove("hidden");

          const addOptionBtn = document.createElement("button");
          addOptionBtn.className = "text-sm text-blue-600 hover:underline";
          addOptionBtn.textContent = "+ Ajouter un choix";

          const createOptionField = () => {
            const optionDiv = document.createElement("div");
            optionDiv.className = "flex items-center gap-2";

            const input = document.createElement("input");
            input.type = "text";
            input.placeholder = "Choix...";
            input.className = "px-2 py-1 rounded border w-full";

            const deleteBtn = createTrashButton("Supprimer ce choix");
            deleteBtn.addEventListener("click", () => optionDiv.remove());

            optionDiv.appendChild(input);
            optionDiv.appendChild(deleteBtn);
            return optionDiv;
          };

          optionsContainer.appendChild(createOptionField());
          optionsContainer.appendChild(addOptionBtn);

          addOptionBtn.addEventListener("click", () => {
            optionsContainer.insertBefore(createOptionField(), addOptionBtn);
          });
        }
      });
    });
  });
});
