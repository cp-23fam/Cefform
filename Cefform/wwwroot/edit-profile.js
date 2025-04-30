// Récupérer l'ID de l'utilisateur depuis l'URL
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

// Champ Text
const firstName = document.getElementById("firstname");
const lastName = document.getElementById("lastname");
const email = document.getElementById("email");
const ceff = document.getElementById("ceff");
const editProfileLbl = document.getElementById("edit-profile-lbl");

// Éléments du formulaire
const editForm = document.getElementById("edit-profile-form");
const cancelBtn = document.getElementById("cancel-btn");

// Mettre à jour le lien d'annulation
cancelBtn.href = `profile.html`;

async function loadUserInfos() {
  user = await getSelfInfosByToken();
  // Mise à jour du contenu
  firstName.value = user.firstName;
  lastName.value = user.lastName;
  email.value = user.email;
  ceff.value = user.ceff;

  editProfileLbl.innerHTML = `Éditer le profil (${user.username})`;
}

// Gérer la soumission du formulaire
editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const formData = {
    firstName: firstName.value,
    lastName: lastName.value,
    email: email.value,
    ceff: ceff.value,
    token: getCookie("token"),
  };

  fetch(`${apiUrl}/user/${user.id}`, {
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
      window.location.href = `profile.html`;
    })
    .catch((err) => {
      console.error(err);
      alert("Erreur lors de la mise à jour du profil");
    });
});

loadUserInfos();
