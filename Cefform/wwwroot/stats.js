const id = parseInt(new URLSearchParams(window.location.search).get("id"));
const main = document.querySelector("main");

fetch(`${apiUrl}/form/${id}`)
  .then((res) => res.json())
  .then(async (form) => {
    if (!form) {
      main.innerHTML = `<p class="text-red-500 text-center">Formulaire introuvable.</p>`;
      return;
    }

    const questions = await getQuestions(id);

    for (const pageQuestions of questions) {
      const page = document.createElement("div");
      page.className =
        "relative max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md mt-4";

      const color = getMainColorFromCeff(form.user.ceff);
      page.innerHTML = `<div class="absolute top-0 right-0 h-full w-2 rounded-r-xl bg-${color}"></div>`;

      for (const q of pageQuestions) {
        const block = document.createElement("div");
        block.className = "mb-6";

        const responses = await fetch(`${apiUrl}/response/${q.id}`).then((r) =>
          r.json()
        );
        block.innerHTML = `<h2 class="font-semibold text-lg mb-2">${
          q.content.split("\t")[0]
        }</h2>`;

        switch (q.type) {
          case 0: // Texte
            responses.forEach((r) => {
              const p = document.createElement("p");
              p.textContent = r;
              p.className = "bg-gray-100 p-2 rounded mb-1";
              block.appendChild(p);
            });
            break;

          case 1: // Choix unique
          case 2: // Choix multiple
            const counts = {};
            responses.flat().forEach((r) => (counts[r] = (counts[r] || 0) + 1));

            for (const [answer, count] of Object.entries(counts)) {
              const line = document.createElement("div");
              line.className = "flex justify-between items-center mb-1";

              line.innerHTML = `
                <span class="text-gray-800">${answer}</span>
                <span class="text-sm text-gray-500">${count} réponse(s)</span>
              `;

              block.appendChild(line);
            }
            break;

          case 3: // Date
            responses.forEach((r) => {
              const p = document.createElement("p");
              p.textContent = new Date(r).toLocaleDateString();
              p.className = "bg-gray-100 p-2 rounded mb-1";
              block.appendChild(p);
            });
            break;

          case 4: // Nombre
            const nums = responses.map(Number);
            const avg = (nums.reduce((a, b) => a + b, 0) / nums.length).toFixed(
              2
            );
            const min = Math.min(...nums);
            const max = Math.max(...nums);

            block.innerHTML += `
              <p>Moyenne : <strong>${avg}</strong></p>
              <p>Min : <strong>${min}</strong>, Max : <strong>${max}</strong></p>
            `;

            break;
        }

        page.appendChild(block);
      }

      main.appendChild(page);
    }
  });

async function getQuestions(id) {
  return await fetch(`${apiUrl}/form/${id}/questions`).then((res) =>
    res.json()
  );
}
