document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");
    addToCartButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const productId = button.getAttribute("data-product-id");
            const quantity = 1;

            // Objeto con los datos a enviar a la API
            // const data = {
            //     productId: productId,
            //     quantity: quantity,
            // };

            // Opciones para la solicitud fetch
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                //body: JSON.stringify(data),
            };

            // URL de tu API para agregar al carrito
            const apiUrl = "http://localhost:8080/api/carts/65dff6ab0464650f0aebf4bf/products/" + productId;

            // Realizar la solicitud fetch
            fetch(apiUrl, options)
                .then((response) => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    return response.json();
                })
                .then((data) => {
                    // Aquí puedes manejar la respuesta de la API
                    console.log("Producto agregado al carrito:", data);
                    alert("Producto agregado al carrito");
                })
                .catch((error) => {
                    console.error("Error al agregar producto al carrito:", error);
                    alert("Error al agregar producto al carrito");
                });

            alert("Product added to cart with ID: " + productId);
        });
    });
});
