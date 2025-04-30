document.addEventListener("DOMContentLoaded", function () {
  function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }
  const csrftoken = getCookie("csrftoken");
  window.cambiarSeccion = function () {
    document.getElementById("log-sec").style.display = "none";
    document.getElementById("reg-sec").style.display = "block";
  };

  window.volverLogin = function () {
    document.getElementById("reg-sec").style.display = "none";
    document.getElementById("log-sec").style.display = "block";
  };
  const register = document.getElementById("form-regis");
  if (!register) {
    console.error("Formulario con id 'form-regis no encontrado.");
    return;
  }
  const form = document.getElementById("login-form");
  if (!form) {
    console.error("Formulario con id 'login-form' no encontrado.");
    return;
  }
  register.addEventListener("submit", async function (e) {
    e.preventDefault();
    const Nombre = document.getElementById("Nombre").value;
    const Telefono = document.getElementById("Telefono").value;
    const gmail = document.getElementById("Correo").value;
    const password = document.getElementById("Pass").value;
    if (!Nombre || !Telefono || !gmail || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }
    try {
      const response = await fetch("/registro/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken, // ← Agrega esta línea
        },
        body: JSON.stringify({ Nombre, Telefono, gmail, password }),
      });
      const data = await response.json();

      if (response.ok) {
        window.location.href = "/inicio/";
      } else {
        alert(data.error || "Error en las credenciales.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    }
  });
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!username || !password) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    try {
      const response = await fetch("/login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const accessToken = data.access_token;
        localStorage.setItem("access_token", accessToken);
        window.location.href = "/dashboard/";
      } else {
        alert(data.error || "Error en las credenciales.");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error al conectar con el servidor.");
    }
  });
});
