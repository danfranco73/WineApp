// need the code for this view related to the profile page and post /api/users/inactiveUsers
/* <button type="button" onclick="limpiarInactivos()">Limpio Inactivos</button> */
// cuando en mi view se haga click en el boton limpiarInactivos, se debe hacer un fetch a la ruta /api/users/inactiveUsers
// metodo POST

function limpiarInactivos() {
  fetch("/api/users/inactiveUsers", {
    method: "POST",
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const limpiarInactivosButton = document.getElementById("limpiarInactivos");
  limpiarInactivosButton.addEventListener("click", limpiarInactivos);
});



