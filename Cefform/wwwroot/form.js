const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id"));

const container = document.getElementById("form-container");
const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const quizForm = document.getElementById("quiz-form");
const colorBar = document.getElementById("color-bar");
const visibilityInfo = document.getElementById("form-visibility-info");

fetch(`${apiUrl}/form/${id.toString()}`)
  .then((res) => res.json())
  .then(async (form) => {
    colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getMainColorFromCeff(
      form.user.ceff
    )}`;

    if (form == null) {
      container.innerHTML = `
        <p class="text-red-500 text-center">Formulaire introuvable.</p>
    `;
    } else {
      title.textContent = form.name;
      description.textContent = form.description;
      limitToAuthUsers = !form.anonym;

      if (limitToAuthUsers) {
        visibilityInfo.textContent =
          "⚠ Ce formulaire n'est accessible qu'aux utilisateurs authentifiés. Vos réponses peuvent être liées à votre identité.";
      } else {
        visibilityInfo.textContent =
          "Ce formulaire est anonyme. Vos réponses ne seront pas liées à votre identité.";
      }

      const questions = await getQuestions(id);

      for (let i = 0; i < questions.length; i++) {
        const page = document.createElement("div");

        page.className =
          "relative max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-4";

        page.innerHTML = `
        <div
          id="color-bar"
          class="absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getMainColorFromCeff(
            form.user.ceff
          )}"
        ></div>
        </div>`;

        document.querySelector("main").appendChild(page);

        questions[i].forEach((q, index) => {
          const block = document.createElement("div");
          block.className = "mb-6";

          switch (q.type) {
            case 1:
            case 2:
              const parts = q.content.split("\t");
              const questionText = parts[0];
              const answers = parts.slice(1);

              block.innerHTML = `<label class="block font-semibold mb-2 text-lg">${questionText}</label>`;

              answers.forEach((answer, ai) => {
                const id = `p${i}q${index}a${ai}`;
                const inputType = q.type === 1 ? "radio" : "checkbox";

                const optionDiv = document.createElement("div");
                optionDiv.className =
                  "flex items-center gap-3 mb-2 pl-2 hover:bg-gray-50 rounded-md transition";

                optionDiv.innerHTML = `
                              <input 
                                  type="${inputType}" 
                                  name="p${i}q${index}" 
                                  id="${id}" 
                                  value="${ai}" 
                                  class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                              <label for="${id}" class="text-gray-800 cursor-pointer select-none">${answer}</label>
                          `;

                block.appendChild(optionDiv);
              });
              break;
            case 3:
              block.innerHTML = `
                          <label class="block font-semibold mb-1">${q.content}</label>
                          <input type="date" name="p${i}q${index}" rows="2" class="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow duration-300 shadow-sm hover:shadow-md"/>
              `;
              break;
            case 4:
              block.innerHTML = `
                          <label class="block font-semibold mb-1">${q.content}</label>
                          <input type="number" name="p${i}q${index}" rows="2" class="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow duration-300 shadow-sm hover:shadow-md"/>
              `;
              break;

            default:
              block.innerHTML = `
                          <label class="block font-semibold mb-1">${q.content}</label>
                          <textarea name="p${i}q${index}" rows="2" maxlength="300" class="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow duration-300 shadow-sm hover:shadow-md"/>`;
              break;
          }

          page.appendChild(block);
        });
      }

      document.querySelector("main").innerHTML += `<div
        class="relative max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-3"
        id="form-container"
      >
        <div
          id="color-bar"
          class="absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getMainColorFromCeff(
            form.user.ceff
          )}"
        ></div>
        <div class="flex gap-4">
          <a
            href="/"
            id="cancel-button"
            class="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Annuler
          </a>
          <button
            id="submit-button"
            type="submit"
            class="px-4 py-2 text-white rounded transition ${getMainColorButtonFromCeff(
              form.user.ceff
            )}"
            form="quiz-form"
          >
            Envoyer
          </button>
        </div>
      </div>`;
    }
  });

async function SendResults(event) {
  event.preventDefault();

  const responses = [];

  const questionGroups = {};

  for (const elem of quizForm.elements) {
    if (!elem.name || elem.type === "submit") continue;

    if (!questionGroups[elem.name]) {
      questionGroups[elem.name] = [];
    }
    questionGroups[elem.name].push(elem);
  }

  for (const groupName in questionGroups) {
    const elements = questionGroups[groupName];

    const firstType = elements[0].type;

    if (firstType === "radio") {
      const selected = elements.find((el) => el.checked);
      if (selected) {
        responses.push({ content: selected.value });
      } else {
        responses.push({ content: "" });
      }
    } else if (firstType === "checkbox") {
      const selected = elements
        .filter((el) => el.checked)
        .map((el) => el.value);
      responses.push({ content: selected.join("") });
    } else {
      responses.push({ content: elements[0].value });
    }
  }

  const payload = {
    idForm: id,
    responses: responses,
  };

  try {
    const res = await fetch(`${apiUrl}/form/${id}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Erreur serveur :", error);
      alert("Erreur lors de l'envoi du formulaire.");
    } else {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Erreur réseau :", error);
    alert("Erreur de connexion au serveur.");
  }
}

async function getQuestions(id) {
  return await fetch(`${apiUrl}/form/${id}/questions`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      return data;
    });
}
