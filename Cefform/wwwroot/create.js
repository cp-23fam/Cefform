const params = new URLSearchParams(window.location.search);
const formId = params.get("id");

const sectionsContainer = document.getElementById("sections-container");
const pageTemplate = document.getElementById("page-template");
const questionTemplate = document.getElementById("question-template");

let baseData = null;
let baseQuestions = [];

const questionTypes = [
  "Texte",
  "Choix Unique",
  "Choix Multiple",
  "Date",
  "Nombre",
];

if (getCookie("token") === null) {
  window.location.href = "/login.html";
}

async function prepareForm() {
  form = await loadFormData();
  baseData = form;
  document.getElementById("title-lbl").value = form.name;
  document.getElementById("description-lbl").value = form.description;
}

async function loadFormData() {
  try {
    const response = await fetch(`${apiUrl}/form/${formId}`);
    const formData = await response.json();
    return formData;
  } catch (error) {
    console.error("Erreur lors du chargement du formulaire", error);
  }
}
async function prepareQuestionsVariable() {
  baseQuestions = await loadAllQuestions();
}

async function loadAllQuestions() {
  const allPages = [];
  let currentPage = 1;

  try {
    while (true) {
      const response = await fetch(
        `${apiUrl}/form/${formId}/questions?page=${currentPage}`
      );

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const questions = await response.json();

      if (!Array.isArray(questions) || questions.length === 0) {
        break;
      }

      allPages.push(questions);
      currentPage++;
    }

    return allPages;
  } catch (error) {
    console.error("Erreur lors du chargement des questions :", error);
    return [];
  }
}

function displayLoadedQuestions() {
  baseQuestions.forEach((pageQuestions, pageIndex) => {
    addPage(); // Ajoute une nouvelle page vide
    const pageDiv = sectionsContainer.lastElementChild;
    const questionsContainer = pageDiv.querySelector(".questions-container");

    pageQuestions.forEach((q) => {
      const questionDiv = document.createElement("div");
      questionDiv.className = "question bg-gray-100 p-3 rounded relative";

      questionDiv.appendChild(questionTemplate.content.cloneNode(true));

      const deleteQuestionBtn = questionDiv.querySelector(".delete-question");
      deleteQuestionBtn.addEventListener("click", () => questionDiv.remove());

      const typeSelection = questionDiv.querySelector(".type-selection");
      typeSelection.innerHTML = questionTypes
        .map(
          (type) => `
      <button
        type="button"
        class="type-btn text-sm border px-2 py-1 rounded hover:bg-gray-200"
        data-type="${type}"
      >
        ${type}</button>`
        )
        .join("");

      const typePreview = questionDiv.querySelector(".answer-preview");
      const optionsContainer = questionDiv.querySelector(".options-container");

      const [mainText, ...choices] = q.content.split("\t");

      questionDiv.querySelector('input[name="question"]').value = mainText;

      const selectedType = questionTypes[q.type];
      typePreview.textContent = `Type : ${selectedType}`;

      if (
        selectedType === "Choix Unique" ||
        selectedType === "Choix Multiple"
      ) {
        optionsContainer.classList.remove("hidden");

        choices.forEach((choiceText) => {
          const optionDiv = document.createElement("div");
          optionDiv.className = "flex items-center gap-2";

          const input = document.createElement("input");
          input.type = "text";
          input.value = choiceText;
          input.placeholder = "Choix...";
          input.className = "choice px-2 py-1 rounded border w-full";
          input.required = true;
          input.maxLength = 15;

          const deleteBtn = createTrashButton("Supprimer ce choix");
          deleteBtn.addEventListener("click", () => optionDiv.remove());

          optionDiv.appendChild(input);
          optionDiv.appendChild(deleteBtn);
          optionsContainer.appendChild(optionDiv);
        });

        const addOptionBtn = document.createElement("button");
        addOptionBtn.className = "text-sm text-blue-600 hover:underline";
        addOptionBtn.textContent = "+ Ajouter un choix";
        addOptionBtn.addEventListener("click", () => {
          const newChoice = document.createElement("div");
          newChoice.className = "flex items-center gap-2";

          const input = document.createElement("input");
          input.type = "text";
          input.placeholder = "Choix...";
          input.className = "choice px-2 py-1 rounded border w-full";
          input.required = true;
          input.maxLength = 15;

          const deleteBtn = createTrashButton("Supprimer ce choix");
          deleteBtn.addEventListener("click", () => newChoice.remove());

          newChoice.appendChild(input);
          newChoice.appendChild(deleteBtn);
          optionsContainer.insertBefore(newChoice, addOptionBtn);
        });

        optionsContainer.appendChild(addOptionBtn);
      }

      addButtonsType(questionDiv);
      questionsContainer.appendChild(questionDiv);
    });
  });
}

async function loadCeffComponents() {
  const titleBar = document.getElementById("title-lbl");
  const descriptionBar = document.getElementById("description-lbl");
  const colorBar = document.getElementById("color-bar");
  const createBtn = document.getElementById("create-btn");
  const cancelBtn = document.getElementById("cancel-btn");

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

  if (formId != null) {
    createBtn.innerHTML = "Sauvegarder";
  }
}

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

function addPage() {
  const pageDiv = document.createElement("div");
  pageDiv.className = "page bg-white p-4 rounded-lg shadow-md mb-4 relative";

  pageDiv.appendChild(pageTemplate.content.cloneNode(true));

  pageDiv.querySelector("p[name='page-title']").innerHTML =
    "Page - " + (document.querySelectorAll("div.page").length + 1);

  const deleteSectionBtn = createTrashButton("Supprimer la page");
  deleteSectionBtn.classList.add("absolute", "top-2", "right-2");
  deleteSectionBtn.addEventListener("click", () => pageDiv.remove());

  pageDiv.appendChild(deleteSectionBtn);
  sectionsContainer.appendChild(pageDiv);

  const addQuestionBtn = pageDiv.querySelector(".add-question-btn");
  const questionsContainer = pageDiv.querySelector(".questions-container");

  addQuestionBtn.addEventListener("click", () =>
    prepareQuestion(questionsContainer)
  );
}

function prepareQuestion(container) {
  const questionDiv = document.createElement("div");
  questionDiv.className = "question bg-gray-100 p-3 rounded relative";

  questionDiv.appendChild(questionTemplate.content.cloneNode(true));

  const deleteQuestionBtn = questionDiv.querySelector(".delete-question");
  deleteQuestionBtn.addEventListener("click", () => questionDiv.remove());

  const typeSelection = questionDiv.querySelector(".type-selection");
  typeSelection.innerHTML = questionTypes
    .map(
      (type) => `
      <button
        type="button"
        class="type-btn text-sm border px-2 py-1 rounded hover:bg-gray-200"
        data-type="${type}"
      >
        ${type}</button>`
    )
    .join("");

  addButtonsType(questionDiv);
  container.appendChild(questionDiv);
}

function addButtonsType(question) {
  const typeButtons = question.querySelectorAll(".type-btn");
  const preview = question.querySelector(".answer-preview");
  const optionsContainer = question.querySelector(".options-container");

  const createOptionField = () => {
    const optionDiv = document.createElement("div");
    optionDiv.className = "flex items-center gap-2";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Choix...";
    input.className = "choice px-2 py-1 rounded border w-full";
    input.required = true;
    input.maxLength = 15;

    const deleteBtn = createTrashButton("Supprimer ce choix");
    deleteBtn.addEventListener("click", () => optionDiv.remove());

    optionDiv.appendChild(input);
    optionDiv.appendChild(deleteBtn);
    return optionDiv;
  };

  typeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const selectedType = btn.getAttribute("data-type");
      preview.textContent = `Type : ${selectedType}`;

      if (
        selectedType === "Choix Unique" ||
        selectedType === "Choix Multiple"
      ) {
        optionsContainer.classList.remove("hidden");

        optionsContainer.innerHTML = "";

        const addOptionBtn = document.createElement("button");
        addOptionBtn.className = "text-sm text-blue-600 hover:underline";
        addOptionBtn.textContent = "+ Ajouter un choix";
        addOptionBtn.addEventListener("click", () => {
          optionsContainer.insertBefore(createOptionField(), addOptionBtn);
        });

        optionsContainer.appendChild(createOptionField());
        optionsContainer.appendChild(addOptionBtn);
      } else {
        optionsContainer.classList.add("hidden");
        optionsContainer.innerHTML = "";
      }
    });
  });
}

async function validateForm(event) {
  event.preventDefault();

  const title = document.querySelector("input[name='title']");
  const description = document.querySelector("input[name='description']");

  const pages = document.querySelectorAll(".page");
  const questionsList = [];

  for (let i = 0; i < pages.length; i++) {
    const questions = pages[i].querySelectorAll("div.question");

    for (const question of questions) {
      const typePreview = question.querySelector(".answer-preview").innerHTML;

      let value = question.querySelector('input[name="question"]').value;
      const type = questionTypes.indexOf(typePreview.substring(7));

      if (type == 1 || type == 2) {
        const choices = question.querySelectorAll(".choice");

        for (const choice of choices) {
          value += "\t" + choice.value;
        }
      }

      questionsList.push({
        type: type,
        page: i + 1,
        content: value,
      });
    }
  }

  const infos = await getSelfInfosByToken();

  if (formId != null) {
    const json = {
      idform: formId,
      name: title.value,
      description: description.value ?? "",
      anonym: baseData.anonym,
      published: 0,
      userIduser: infos.id,
      questions: questionsList,
    };
    console.log(JSON.stringify(json));
    await fetch(
      `${apiUrl}/form/${formId}?token=${encodeURIComponent(infos.token)}`,
      {
        method: "PUT",
        body: JSON.stringify(json),
        headers: {
          "Content-Type": "application/json",
        },
      }
    ).then((res) => {
      if (res.status == 401) {
        window.location.href = "/login.html";
      }
    });
    window.location.href = "profile.html";
  } else {
    const json = {
      name: title.value,
      description: description.value ?? "",
      anonym: 1,
      published: 0,
      userIduser: infos.id,
      questions: questionsList,
    };
    console.log(JSON.stringify(json));
    await fetch(`${apiUrl}/form?token=${encodeURIComponent(infos.token)}`, {
      method: "POST",
      body: JSON.stringify(json),
      headers: {
        "Content-Type": "application/json",
      },
    });
    window.location.href = "index.html";
  }
}

if (formId != null) {
  prepareForm().then(() => {
    prepareQuestionsVariable().then(() => {
      displayLoadedQuestions();
    });
  });
}

loadCeffComponents();
