const container = document.getElementById("card-container");

fetch("https://api.exemple.com/form")
    .then((res) => res.json())
    .then((data) => {
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
    })
    .catch((error) => {
        console.error("Erreur lors de la récupération des données :", error);
        container.className = "flex items-center justify-center h-64";
        container.innerHTML = `<p class="text-red-500 text-center">Impossible de charger les formulaires.</p>`;
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
