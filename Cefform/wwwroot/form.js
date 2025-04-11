const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id")); // attention à bien le caster en nombre

const container = document.getElementById("form-container");
const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const quizForm = document.getElementById("quiz-form");
const colorBar = document.getElementById("color-bar");
const submitButton = document.getElementById("submit-button");

fetch("https://localhost:7005/form/" + id.toString())
    .then((res) => res.json())
    .then((form) => {
        colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl ${getColorClass(form.user.ceff)}`;
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

                if (q.type == 2) {
                    const parts = q.content.split("\t");
                    block.innerHTML = `<label class="block font-semibold mb-1">${parts[0]}</label>`;
                    for (answer of parts) {
                        block.innerHTML += `<input type="checkbox" name="${parts[0]}">${answer}</input>`
                    }
                } else if (q.type == 1) {
                    const parts = q.content.split("\t");
                    block.innerHTML = `<label class="block font-semibold mb-1">${parts[0]}</label>`;
                    for (answer of parts) {
                        block.innerHTML += `<input type="radio" name="${parts[0]}">${answer}</input>`
                    }
                } else {
                    block.innerHTML = `
                        <label class="block font-semibold mb-1">${q.content}</label>
                        <textarea name="q${index}" rows="2" class="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow duration-300 shadow-sm hover:shadow-md"></textarea>
                    `;
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
