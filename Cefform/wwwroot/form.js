function getAllForms() {
    return data;
}

function getFormById(id) {
    return fullData.find(form => form.id === id);
}

// ------------- Script principal -------------

const params = new URLSearchParams(window.location.search);
const id = parseInt(params.get("id")); // attention à bien le caster en nombre
const forms = getAllForms();

const selectedForm = forms.find(form => form.id === id);
const fullForm = getFormById(id);

const container = document.getElementById("form-container");
const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const quizForm = document.getElementById("quiz-form");

const colorBar = document.getElementById("color-bar");
colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl ${getColorClass(fullForm.color)}`;

const submitButton = document.getElementById("submit-button");
submitButton.className += ` ${getColorButtonClass(fullForm.color)}`;


if (!selectedForm || !fullForm) {
    container.innerHTML = `
        <p class="text-red-500 text-center">Formulaire introuvable.</p>
    `;
} else {
    title.textContent = fullForm.title;
    description.textContent = fullForm.description;

    fullForm.questions.forEach((q, index) => {
        const block = document.createElement("div");

        block.innerHTML = `
            <label class="block font-semibold mb-1">${q.question}</label>
            <textarea name="q${index}" rows="2" class="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition-shadow duration-300 shadow-sm hover:shadow-md"></textarea>
        `;

        quizForm.appendChild(block);
    });
}

// Fonction qui donne la couleur en classe Tailwind
function getColorClass(color) {
    switch (color) {
        case "green":
            return "bg-green-300";
        case "blue":
            return "bg-blue-400";
        case "purple":
            return "bg-purple-400";
        case "cyan":
            return "bg-cyan-400";
        default:
            return "bg-gray-400";
    }
}

function getColorButtonClass(color) {
    switch (color) {
        case "green":
            return "bg-green-500 hover:bg-green-600";
        case "blue":
            return "bg-blue-500 hover:bg-blue-600";
        case "purple":
            return "bg-purple-500 hover:bg-purple-600";
        case "cyan":
            return "bg-cyan-500 hover:bg-cyan-600";
        default:
            return "bg-gray-500 hover:bg-gray-600";
    }
}
