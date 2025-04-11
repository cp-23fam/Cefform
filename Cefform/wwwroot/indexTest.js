const container = document.getElementById("card-container");

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

// Affichage des cartes comme si c'était une réponse d'API
data.forEach((form) => {
    const link = document.createElement("a");
    link.href = `form.html?id=${form.id}`;
    link.className = "block";

    const card = document.createElement("div");
    card.className = "relative bg-gray-200 p-4 rounded-lg shadow flex flex-col justify-between hover:bg-gray-300 transition";

    card.innerHTML = `
        <div>
            <h2 class="text-lg font-semibold">${form.title}</h2>
            <p class="text-sm text-gray-600">${form.description}</p>
        </div>
        <div class="absolute top-0 right-0 h-full w-2 rounded-r-lg ${getColorClass(form.color)}"></div>
    `;

    link.appendChild(card);
    container.appendChild(link);
});

// Fonction pour choisir la couleur latérale
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
