const apiUrl = "https://localhost:7005/api";

async function getSelfInfosByToken() {
  const token = getCookie("token");

  const infos = await fetch(
    `${apiUrl}/token?token=${encodeURIComponent(token)}`
  ).then((res) => {
    if (!res.ok) {
      //   window.location.href = "/login";
      return;
    }

    return res.json();
  });

  console.log(infos);

  return infos;
}

function getCookie(name) {
  const cookie = document.cookie
    .split("; ")
    .find((c) => c.startsWith(name + "="));
  return cookie ? decodeURIComponent(cookie.split("=")[1]) : null;
}

function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0`;
}
