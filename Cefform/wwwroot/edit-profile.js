// Récupérer l'ID de l'utilisateur depuis l'URL
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

// Point d'accès à l'API
const apiUrl = `https://localhost:7005/api/Users/${userId}`;

// Éléments du formulaire
const editForm = document.getElementById("edit-profile-form");
const cancelBtn = document.getElementById("cancel-btn");

// Mettre à jour le lien d'annulation
cancelBtn.href = `profile.html?id=${userId}`;

// Charger les données de l'utilisateur
fetch(apiUrl)
  .then((res) => {
    if (!res.ok) throw new Error("Utilisateur introuvable");
    return res.json();
  })
  .then((user) => {
    document.getElementById("firstname").value = user.firstName || "";
    document.getElementById("lastname").value = user.lastName || "";
    document.getElementById("email").value = user.email || "";
    document.getElementById("ceff").value = user.ceff || 0;
  })
  .catch((err) => {
    console.error(err);
    alert("Impossible de charger les données de l'utilisateur");
  });

// Gérer la soumission du formulaire
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    firstName: document.getElementById("firstname").value,
    lastName: document.getElementById("lastname").value,
    username: document.getElementById("username").value,
    email: document.getElementById("email").value || null,
    ceff: parseInt(document.getElementById("ceff").value),
  };

  fetch(apiUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Échec de la mise à jour");
      return res.json();
    })
    .then(() => {
      alert("Profil mis à jour avec succès");
      window.location.href = `profile.html?id=${userId}`;
    })
    .catch((err) => {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil");
    });
});
