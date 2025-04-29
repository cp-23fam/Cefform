const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id")); // attention à bien le caster en nombre

const container = document.getElementById("form-container");
const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const quizForm = document.getElementById("quiz-form");
const colorBar = document.getElementById("color-bar");
const submitButton = document.getElementById("submit-button");

fetch("https://localhost:7005/api/form/" + id.toString())
  .then((res) => res.json())
  .then((form) => {
    colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl ${getColorClass(
      form.user.ceff
    )}`;
    submitButton.className += ` ${getColorButtonClass(form.user.ceff)}`;

    if (form == null) {
      container.innerHTML = `
        <p class="text-red-500 text-center">Formulaire introuvable.</p>
    `;
    } else {
      title.textContent = form.name;
      description.textContent = form.description;

      form.questions.forEach((q, index) => {
        const block = document.createElement("div");
        block.className = "mb-6";

        if (q.type === 2 || q.type === 1) {
          const parts = q.content.split("\t");
          const questionText = parts[0];
          const answers = parts.slice(1);

          block.innerHTML = `<label class="block font-semibold mb-2 text-lg">${questionText}</label>`;

          answers.forEach((answer, i) => {
            const id = `q${index}_a${i}`;
            const inputType = q.type === 2 ? "radio" : "checkbox";

            const optionDiv = document.createElement("div");
            optionDiv.className =
              "flex items-center gap-3 mb-2 pl-2 hover:bg-gray-50 rounded-md transition";

            optionDiv.innerHTML = `
                            <input 
                                type="${inputType}" 
                                name="q${index}" 
                                id="${id}" 
                                value="${answer}" 
                                class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded">
                            <label for="${id}" class="text-gray-800 cursor-pointer select-none">${answer}</label>
                        `;

            block.appendChild(optionDiv);
          });
        } else {
          // Question texte
          block.innerHTML = `
                        <label class="block font-semibold mb-1">${q.content}</label>
                        <textarea name="q${index}" rows="2" class="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow duration-300 shadow-sm hover:shadow-md"/>`;
        }

        quizForm.appendChild(block);
      });
    }
  });

// Fonction qui donne la couleur en classe Tailwind
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
