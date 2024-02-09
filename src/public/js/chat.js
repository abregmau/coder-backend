const userName = document.querySelector(".userName");
const socket = io({ path: "/chat" });
let nameUser = "";

Swal.fire({
    title: "Submit your username",
    input: "text",
    inputAttributes: {
        autocapitalize: "off",
    },
    showCancelButton: true,
    confirmButtonText: "Sing in",
    showLoaderOnConfirm: true,
}).then((result) => {
    userName.textContent = result.value;
    nameUser = result.value;
    socket.emit("userConnection", {
        user: result.value,
    });
});

const chatMessage = document.querySelector(".chatMessage");
let idUser = "";
const messageInnerHTML = (data) => {
    let message = "";

    for (let i = 0; i < data.length; i++) {
        if (data[i].info === "connection") {
            message += `<p class="connection">${data[i].message}</p>`;
        }
        if (data[i].info === "message") {
            message += `
        <div class="messageUser">
            <p><b>${data[i].name}: </b></p>
            <p>${data[i].message}</p>
        </div>
        `;
        }
    }

    return message;
};

socket.on("userConnection", (data) => {
    chatMessage.innerHTML = "";
    const connection = messageInnerHTML(data);
    chatMessage.innerHTML = connection;
    scrollToBottom();
});

const inputMessage = document.getElementById("inputMessage");
const btnMessage = document.getElementById("btnMessage");

btnMessage.addEventListener("click", (e) => {
    e.preventDefault();
    socket.emit("userMessage", {
        message: inputMessage.value,
    });
    inputMessage.value = "";
});

socket.on("userMessage", (data) => {
    chatMessage.innerHTML = "";
    const message = messageInnerHTML(data);
    chatMessage.innerHTML = message;
    scrollToBottom();
});

inputMessage.addEventListener("keypress", () => {
    socket.emit("typing", { nameUser });
});

const typing = document.querySelector(".typing");
socket.on("typing", (data) => {
    typing.textContent = `${data.nameUser} typing...`;
});

function scrollToBottom() {
    chatMessage.scrollTop = chatMessage.scrollHeight - chatMessage.clientHeight;
}
