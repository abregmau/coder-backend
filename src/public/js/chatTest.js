const userName = document.querySelector(".userName");
const socket = io();

Swal.fire({
    title: "Enter your name",
    input: "text",
    inputAttributes: {
        autocapitalize: "on",
    },
    showCancelButton: false,
    confirmButtonText: "Confirm",
}).then((result) => {
    if (result.isConfirmed) {
        userName.innerHTML = result.value;
    }
    socket.emit("userConnection", { user: result.value });
});
