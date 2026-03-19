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
            button.addEventListener("click", () => addToCart(producto));
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