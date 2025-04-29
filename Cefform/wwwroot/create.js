const sectionsContainer = document.getElementById("sections-container");
const addSectionBtn = document.getElementById("add-section-btn");

const params = new URLSearchParams(window.location.search);
const ceff = parseInt(params.get("ceff"));

const titleBar = document.getElementById("title-lbl");
const descritpionBar = document.getElementById("description-lbl");
const colorBar = document.getElementById("color-bar");
const createBtn = document.getElementById("create-btn");
const cancelBtn = document.getElementById("cancel-btn");

titleBar.className = `w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-${getMainColorFromCeff(ceff)}`;
descritpionBar.className = `w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-${getMainColorFromCeff(ceff)}`;
colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getMainColorFromCeff(ceff)}`;
createBtn.className = `${getColorButtonClass(ceff)} text-white px-6 py-2 rounded transition`;
cancelBtn.className = `px-6 py-2 rounded border border-${getMainColorFromCeff(ceff)} text-gray-700 hover:bg-gray-100 transition`;

// Types disponibles
const questionTypes = [
  "Texte",
  "Choix Unique",
  "Date",
  "Nombre",
  "Choix Multiple",
];

let sectionCount = 0;

addSectionBtn.addEventListener("click", () => {
  sectionCount++;
  const sectionId = `section-${sectionCount}`;

  const sectionDiv = document.createElement("div");
  sectionDiv.className = "bg-white p-4 rounded-lg shadow-md mb-4 relative";
  sectionDiv.id = sectionId;

  sectionDiv.innerHTML = `
        <input type="text" placeholder="Nom de section..." class="border-b border-gray-400 w-full mb-2 focus:outline-none">
        <div class="questions-container space-y-2 mb-4"></div>
        <button class="add-question-btn text-sm text-gray-700 hover:underline">+ Ajouter une question</button>
        <button class="delete-section absolute top-2 right-2 text-red-500 hover:text-red-700" title="Supprimer la section">
            🗑️
        </button>
    `;

  sectionsContainer.appendChild(sectionDiv);

  const addQuestionBtn = sectionDiv.querySelector(".add-question-btn");
  const questionsContainer = sectionDiv.querySelector(".questions-container");
  const deleteSectionBtn = sectionDiv.querySelector(".delete-section");

  addQuestionBtn.addEventListener("click", () => {
    const questionDiv = document.createElement("div");
    questionDiv.className = "bg-gray-100 p-3 rounded relative";

    questionDiv.innerHTML = `
            <input type="text" placeholder="Intitulé de la question..." class="w-full mb-2 px-2 py-1 rounded border focus:outline-none">
            <div class="flex flex-wrap gap-2 mb-2">
                ${questionTypes
                  .map(
                    (type) => `
                    <button type="button" class="type-btn text-sm border px-2 py-1 rounded hover:bg-gray-200" data-type="${type}">
                        ${type}
                    </button>
                `
                  )
                  .join("")}
            </div>
            <div class="answer-preview text-gray-500 text-sm italic mb-2">Type : aucun sélectionné</div>
            <div class="options-container hidden space-y-2"></div>
            <button class="delete-question absolute top-1 right-1 text-red-500 hover:text-red-700" title="Supprimer la question">🗑️</button>
        `;

    questionsContainer.appendChild(questionDiv);

    const typeBtns = questionDiv.querySelectorAll(".type-btn");
    const preview = questionDiv.querySelector(".answer-preview");
    const optionsContainer = questionDiv.querySelector(".options-container");

    typeBtns.forEach((btn) => {
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

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "text-red-500 hover:text-red-700";
            deleteBtn.textContent = "🗑️";
            deleteBtn.title = "Supprimer ce choix";

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

    const deleteQuestionBtn = questionDiv.querySelector(".delete-question");
    deleteQuestionBtn.addEventListener("click", () => {
      questionDiv.remove();
    });
  });

  deleteSectionBtn.addEventListener("click", () => {
    sectionDiv.remove();
  });
});


function getMainColorFromCeff(color) {
    switch (color) {
        case 0:
            return "green-300";
        case 1:
            return "blue-400";
        case 2:
            return "purple-400";
        case 3:
            return "cyan-400";
        default:
            return "gray-400";
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