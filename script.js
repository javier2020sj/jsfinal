const carrito = [];
document.getElementById("btnSubmitForm").addEventListener("click", function (event) {
    //Validar el formulario
    event.preventDefault();
    const nombre = document.getElementById("nombre");
    const apellido = document.getElementById("apellido");
    const email = document.getElementById("email");
    const telefono = document.getElementById("telefono");
    const direccion = document.getElementById("direccion");
    let bandera = true
    if (!nombre.value.trim()) {
        nombre.classList.add("is-invalid");
        bandera = false;
    } else {
        nombre.classList.remove("is-invalid");

    }

    if (!apellido.value.trim()) {
        apellido.classList.add("is-invalid");
        bandera = false;
    } else {
        apellido.classList.remove("is-invalid");
    }

    if (!validateEmail(email.value)) {
        email.classList.add("is-invalid");
        bandera = false;
    } else {
        email.classList.remove("is-invalid");
    }

    if (!validatePhone(telefono.value)) {
        telefono.classList.add("is-invalid");
        bandera = false;
    } else {
        telefono.classList.remove("is-invalid");
    }

    if (bandera) {
        Swal.fire({
            title: '¡Datos guardados!',
            text: 'Tus datos han sido guardados correctamente.',
            icon: 'success',
            confirmButtonText: 'Aceptar'
        }).then(() => {

            document.getElementById("form-section").classList.add("hidden-section");
            cargarProductos();
            document.getElementById("shop-section").classList.remove("hidden-section");
        });
    };


});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}
function validatePhone(phone) {
    const re = /^\d{10}$/; // Asegura que el número tenga exactamente 10 dígitos
    return re.test(String(phone));
}


async function cargarProductos() {
    try {
        //   elements.loader.style.display = "block";

        const response = await fetch("https://devsapihub.com/api-fast-food");

        if (!response.ok) {
            throw new Error("No se pudieron obtener los productos.");
        }

        productos = await response.json();


        contProductos=document.getElementById("productsContainer")
        contProductos.innerHTML = "";

        productos.forEach((producto) => {
            const col = document.createElement("div");
            col.className = "col-sm-6 col-lg-4 col-xl-3";

            col.innerHTML = `
                <div class="card product-card h-100">
                <img src="${producto.image}" class="card-img-top product-img" alt="${producto.name}">
                <div class="card-body d-flex flex-column">
                    <h5 class="card-title">${producto.name}</h5>
                    <p class="card-text text-muted mb-2">Categoría: ${producto.category}</p>
                    <p class="price mb-3">$${Number(producto.price).toFixed(2)}</p>
                    <button class="btn btn-primary mt-auto" data-product-id="${producto.id}">
                    Agregar al carrito
                    </button>
                </div>
                </div>
            `;

            const button = col.querySelector("[data-product-id]");
            button.addEventListener("click", () => agregarCarrito(producto));
            contProductos.appendChild(col);
        });


    } catch (error) {
        document.getElementById("productsContainer").innerHTML = `
        <div class="col-12">
          <div class="alert alert-danger">
            Error al cargar productos: ${error.message}
          </div>
        </div>
      `;
    } finally {

        document.getElementById("loader").style.display = "none";
    }
}
function agregarCarrito(producto)
{
    producto.cantidad=1;
    carrito.push(producto);
    // pongo los datos en el htmls
    document.getElementById("pago-section").classList.remove("hidden-section");
    document.getElementById("listadoCarrito").innerHTML=carrito.map((item)=>` <div class="cart-item">
            <div class="d-flex gap-3 align-items-center">
              <img
                src="${item.image}"
                alt="${item.name}"
                width="80"
                height="80"
                style="object-fit: cover; border-radius: 10px;"
              />
              <div class="flex-grow-1">
                <h6 class="mb-1">${item.name}</h6>
                <p class="mb-1 text-muted">Precio unitario: $${Number(item.price).toFixed(2)}</p>
                <p class="mb-0"><strong>Subtotal:</strong> $${(Number(item.price) * item.cantidad).toFixed(2)}</p>
              </div>
              <div class="text-end">
                <div class="btn-group mb-2">
                  <button class="btn btn-sm btn-outline-secondary" data-action="decrease" data-id="${item.id}">-</button>
                  <button class="btn btn-sm btn-outline-dark" disabled>${item.cantidad}</button>
                  <button class="btn btn-sm btn-outline-dark" disabled>${item.cantidad}</button>
                  <button class="btn btn-sm btn-outline-secondary" data-action="increase" data-id="${item.id}">+</button>
                </div>
                <div>
                  <button class="btn btn-sm btn-outline-danger" data-action="remove" data-id="${item.id}">
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        `).join("")
    console.log(carrito);
}
