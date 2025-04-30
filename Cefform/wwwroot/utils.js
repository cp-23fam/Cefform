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

function getMainColorFromCeff(ceff) {
  switch (ceff) {
    case 0:
      return "green-300";
    case 1:
      return "blue-400";
    case 2:
      return "purple-400";
    case 3:
      return "cyan-400";
    default:
      return "gray-400";
  }
}

function getMainColorButtonFromCeff(ceff) {
  switch (ceff) {
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
