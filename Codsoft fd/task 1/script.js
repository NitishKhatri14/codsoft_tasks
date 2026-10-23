
document.addEventListener("DOMContentLoaded", function () {

    // Mobile navigation menu
    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    menuToggle.addEventListener("click", function () {
        const isOpen = navLinks.classList.toggle("open");

        menuToggle.setAttribute("aria-expanded", isOpen);
        menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    // Close menu after clicking a navigation link
    document.querySelectorAll(".nav-links a").forEach(function (link) {
        link.addEventListener("click", function () {
            navLinks.classList.remove("open");
            menuToggle.setAttribute("aria-expanded", "false");
            menuToggle.textContent = "☰";
        });
    });

    // Update copyright year automatically
    document.getElementById("year").textContent =
        new Date().getFullYear();

    // Contact form validation
    const contactForm = document.getElementById("contactForm");
    const formStatus = document.getElementById("formStatus");

    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const messageInput = document.getElementById("message");

    function showError(input, errorId, message) {
        document.getElementById(errorId).textContent = message;
        input.classList.toggle("invalid", Boolean(message));
        input.setAttribute("aria-invalid", String(Boolean(message)));
        return message === "";
    }

    function validateName() {
        const value = nameInput.value.trim();

        if (value.length < 2) {
            return showError(
                nameInput,
                "nameError",
                "Name must contain at least 2 characters."
            );
        }

        return showError(nameInput, "nameError", "");
    }

    function validateEmail() {
        const value = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

        if (!emailPattern.test(value)) {
            return showError(
                emailInput,
                "emailError",
                "Please enter a valid email address."
            );
        }

        return showError(emailInput, "emailError", "");
    }

    function validateMessage() {
        const value = messageInput.value.trim();

        if (value.length < 10) {
            return showError(
                messageInput,
                "messageError",
                "Message must contain at least 10 characters."
            );
        }

        return showError(messageInput, "messageError", "");
    }

    // Clear errors as the user corrects the fields
    nameInput.addEventListener("input", validateName);
    emailInput.addEventListener("input", validateEmail);
    messageInput.addEventListener("input", validateMessage);

    contactForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isMessageValid = validateMessage();

        if (!isNameValid || !isEmailValid || !isMessageValid) {
            formStatus.textContent =
                "Please correct the errors before submitting.";
            formStatus.className = "error";

            contactForm.querySelector(".invalid").focus();
            return;
        }

        // Frontend demonstration only; no email is sent.
        formStatus.textContent =
            "Thank you, " + nameInput.value.trim() +
            "! Your form has been validated successfully.";

        formStatus.className = "success";

        contactForm.reset();

        [nameInput, emailInput, messageInput].forEach(function (input) {
            input.classList.remove("invalid");
            input.removeAttribute("aria-invalid");
        });
    });

});
