document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");
  const errorMsg = document.getElementById("error-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault(); // empêche le rechargement de la page

    const email = document.getElementById("text").value.trim();
    const password = document.getElementById("password").value.trim();

    // Exemple de vérification basique
    if (!email || !password) {
      showError("Veuillez remplir tous les champs.");
      return;
    }

    const encrypted = await getPublicKeyAndEncrypt(password);

    const url = encodeURIComponent(encrypted);
    // Simule une requête d'authentification
    fetch(`https://localhost:7005/api/login?user=${email}&pwd=${url}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Échec de la connexion");
        return res.text();
      })
      .then((data) => {
        // Redirection ou stockage du token selon le backend
        localStorage.setItem("token", data);
        window.location.href = "dashboard.html";
      })
      .catch((err) => {
        showError("Adresse email ou mot de passe incorrect.");
      });
  });

  function showError(message) {
    errorMsg.innerHTML = message;
    errorMsg.classList.remove("hidden");
  }
});

async function getPublicKeyAndEncrypt(message) {
  const key = await fetch("https://localhost:7005/api/publickey").then(
    (res) => {
      return res.text();
    }
  );

  try {
    const pub = await importPublicKey(key);
    const encrypted = await encryptRSA(pub, new TextEncoder().encode(message));
    const encryptedBase64 = window.btoa(ab2str(encrypted));
    return encryptedBase64;
  } catch (error) {
    console.log(error);
  }
}

async function importPublicKey(spkiPem) {
  return await window.crypto.subtle.importKey(
    "spki",
    getSpkiDer(spkiPem),
    {
      name: "RSA-OAEP",
      hash: "SHA-256",
    },
    true,
    ["encrypt"]
  );
}

async function encryptRSA(key, plaintext) {
  let encrypted = await window.crypto.subtle.encrypt(
    {
      name: "RSA-OAEP",
    },
    key,
    plaintext
  );
  return encrypted;
}

function getSpkiDer(spkiPem) {
  const pemHeader = "-----BEGIN PUBLIC KEY-----";
  const pemFooter = "-----END PUBLIC KEY-----";
  var pemContents = spkiPem.substring(
    pemHeader.length,
    spkiPem.length - pemFooter.length
  );
  var binaryDerString = window.atob(pemContents);
  return str2ab(binaryDerString);
}

function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0, strLen = str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}
