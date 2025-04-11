// Simulation de données de l'API
const data = [
    {
        title: "TPA Informatique",
        description: "Description du TPA d'informatique.",
        color: "green",
        id: 1
    },
    {
        title: "TPA Électronique",
        description: "Petit projet sur les capteurs.",
        color: "blue",
        id: 2
    },
    {
        title: "TPA Réseaux",
        description: "Mise en place d'un serveur DHCP.",
        color: "cyan",
        id: 3
    },
    {
        title: "TPA Systèmes",
        description: "Installation d’un dual boot Linux.",
        color: "purple",
        id: 4
    },
    {
        title: "TPA Web",
        description: "Création d’un mini site en Tailwind.",
        color: "green",
        id: 5
    },
];

const fullData = [
    {
        id: 1,
        title: "TPA Informatique",
        description: "Description du TPA d'informatique.",
        color: "green",
        questions: [
            {
                question: "Quel langage as-tu utilisé pour ton projet ?",
                answer: "JavaScript avec Node.js",
            },
            {
                question: "Quel problème technique as-tu rencontré ?",
                answer: "Un bug de dépendance avec Express et une mauvaise gestion des requêtes asynchrones.",
            },
            {
                question: "As-tu utilisé un système de versionnage ?",
                answer: "Oui, j’ai utilisé Git avec GitHub.",
            },
        ]
    },
    {
        id: 2,
        title: "TPA Électronique",
        description: "Petit projet sur les capteurs.",
        color: "blue",
        questions: [
            {
                question: "Quel type de capteur as-tu utilisé ?",
                answer: "Un capteur de température analogique (LM35).",
            },
            {
                question: "Comment as-tu affiché les données ?",
                answer: "Sur un écran LCD 16x2 en I2C.",
            },
            {
                question: "Quelle est la précision attendue ?",
                answer: "Environ ±0.5°C dans les conditions normales.",
            },
        ]
    },
    {
        id: 3,
        title: "TPA Réseaux",
        description: "Mise en place d'un serveur DHCP.",
        color: "cyan",
        questions: [
            {
                question: "Quel logiciel as-tu utilisé pour le serveur DHCP ?",
                answer: "ISC-DHCP sur Debian.",
            },
            {
                question: "As-tu segmenté ton réseau ?",
                answer: "Oui, j’ai utilisé des VLANs avec un switch manageable.",
            },
            {
                question: "Comment as-tu testé le bon fonctionnement ?",
                answer: "Avec Wireshark pour observer les trames DHCP DISCOVER/OFFER.",
            },
        ]
    },
    {
        id: 4,
        title: "TPA Systèmes",
        description: "Installation d’un dual boot Linux.",
        color: "purple",
        questions: [
            {
                question: "Quel bootloader as-tu utilisé ?",
                answer: "GRUB2, installé avec Ubuntu.",
            },
            {
                question: "As-tu rencontré des problèmes avec Windows ?",
                answer: "Oui, j’ai dû désactiver le fast boot dans le BIOS.",
            },
            {
                question: "Quelle partition as-tu utilisé pour Linux ?",
                answer: "J’ai créé une partition ext4 séparée de 50 Go.",
            },
        ]
    },
    {
        id: 5,
        title: "TPA Web",
        description: "Création d’un mini site en Tailwind.",
        color: "green",
        questions: [
            {
                question: "Quel framework CSS as-tu utilisé ?",
                answer: "Tailwind CSS, pour sa rapidité et sa flexibilité.",
            },
            {
                question: "Le site est-il responsive ?",
                answer: "Oui, grâce aux classes responsive de Tailwind comme `sm:` et `md:`.",
            },
            {
                question: "Comment gères-tu le routing ?",
                answer: "Je n’ai pas encore de routing, mais je prévois d’utiliser Astro ou Next.js plus tard.",
            },
        ]
    },
];

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
const form = getFormById(id);

const container = document.getElementById("form-container");
const title = document.getElementById("form-title");
const description = document.getElementById("form-description");
const quizForm = document.getElementById("quiz-form");

const colorBar = document.getElementById("color-bar");
colorBar.className = `absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${getColorClass(form.color)}`;

const submitButton = document.getElementById("submit-button");
submitButton.className += ` ${getColorButtonClass(form.color)}`;


if (!selectedForm || !form) {
    container.innerHTML = `
        <p class="text-red-500 text-center">Formulaire introuvable.</p>
    `;
} else {
    document.title = "cefforms - " + form.title;
    title.textContent = form.title;
    description.textContent = form.description;

    form.questions.forEach((q, index) => {
        const block = document.createElement("div");

        block.innerHTML = `
            <label class="block font-semibold mb-1">${q.question}</label>
            <textarea name="q${index}" rows="2" class="w-full p-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-${getColorClass(form.color)} focus:outline-none transition-shadow duration-300 shadow-sm hover:shadow-md"></textarea>
        `;

        quizForm.appendChild(block);
    });
}

// Fonction qui donne la couleur en classe Tailwind
function getColorClass(color) {
    switch (color) {
        case "green":
            return "green-300";
        case "blue":
            return "blue-400";
        case "purple":
            return "purple-400";
        case "cyan":
            return "cyan-400";
        default:
            return "gray-400";
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

