const socket = io({ path: "/realtimeproducts" });

// Listen for form submissions
document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("productForm");

    productForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const productTitle = document.getElementById("productTitle").value;
        const productDescription = document.getElementById("productDescription").value;
        const productCode = document.getElementById("productCode").value;
        const productPrice = document.getElementById("productPrice").value;
        const productStock = document.getElementById("productStock").value;
        const productCategory = document.getElementById("productCategory").value;

        const productData = {
            title: productTitle,
            description: productDescription,
            code: productCode,
            price: parseFloat(productPrice),
            stock: parseInt(productStock),
            category: productCategory,
        };

        socket.emit("addProduct", productData);
        Swal.fire({ title: "Product added successfully!", text: "", icon: "success" });

        productForm.reset();
    });
});

// Listen for updates from the server
socket.on("updateProducts", function (updatedProducts) {
    // Call a function to update the product list with the new data
    updateProductList(updatedProducts);
});

function updateProductList(products) {
    // Get the product container element
    const productContainer = document.getElementById("product-container");

    // Clear existing products
    productContainer.innerHTML = "";

    // Iterate through the products and add them to the container
    products.forEach((product) => {
        const productElement = document.createElement("div");
        productElement.className = "product";

        productElement.innerHTML = `
            <h2>Title: ${product.title}</h2>
            <p>Description: ${product.description}</p>
            <p>Code: ${product.code}</p>
            <p>Price: ${product.price}</p>
            <p>Status: ${product.status}</p>
            <p>Stock: ${product.stock}</p>
            <p>Category: ${product.category}</p>
            <p>Thumbnail:</p>
            <ul>
            ${
                product.thumbnail
                    ? product.thumbnail.map((link, index) => `<li><a href="${link}">Link ${index}</a></li>`).join("")
                    : "<li>No thumbnail available</li>"
            }
            </ul>
            <p>Id: ${product.id ? product.id : product._id}</p>
            <hr />
            <button class="deleteProductBtn" data-product-id="${product.id ? product.id : product._id}">Delete</button>
        `;

        // Append the product element to the container
        productContainer.appendChild(productElement);

        // Add event listener for the delete button
        const deleteButton = productElement.querySelector(".deleteProductBtn");
        deleteButton.addEventListener("click", function () {
            // Handle the delete operation
            const productId = this.getAttribute("data-product-id");
            socket.emit("deleteProduct", productId);
            Swal.fire({ title: "Product deleted successfully", text: "", icon: "success" });
        });
    });
}
