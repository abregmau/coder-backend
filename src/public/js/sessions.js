// Get the current URL
var url = window.location.href;

// Function to get the value of a parameter in the URL
function getParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return "";
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// Get the value of the "status" parameter from the URL
var statusCode = getParameterByName("status", url);

// Function to show alert based on status code
function showAlert(statusCode) {
    var message;
    switch (statusCode) {
        case "0":
            message = "User created successfully";
            break;
        case "1":
            message = "User Login Successful";
            break;
        case "10":
            message = "All fields are required";
            break;
        case "11":
            message = "Email already exists";
            break;
        case "12":
            message = "Incorrect email or password";
            break;
        default:
            message = "Unknown error";
    }
    alert(message);
}

// Check if there is an error code in the URL and show the error message
if (statusCode !== null) {
    showAlert(statusCode);
}
