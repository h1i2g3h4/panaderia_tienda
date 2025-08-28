document.getElementById("form-cotizacion").addEventListener("submit", e => {
  e.preventDefault();
  let nombre = document.getElementById("nombre").value;
  let producto = document.getElementById("producto").value;
  let cantidad = document.getElementById("cantidad").value;

  let total = cantidad * 2000; // ejemplo de precio base
  document.getElementById("resultado").innerHTML =
    `<p>Gracias ${nombre}, tu cotización para ${cantidad} ${producto}(s) es de $${total}.</p>`;
});
