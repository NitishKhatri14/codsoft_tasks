
document.addEventListener("DOMContentLoaded", function () {
    const STORAGE_KEY = "moneyWiseTransactions";
    const THEME_KEY = "moneyWiseTheme";

    const form = document.getElementById("transactionForm");
    const description = document.getElementById("description");
    const type = document.getElementById("type");
    const amount = document.getElementById("amount");
    const category = document.getElementById("category");
    const date = document.getElementById("date");

    const transactionList = document.getElementById("transactionList");
    const emptyState = document.getElementById("emptyState");
    const emptyTitle = document.getElementById("emptyTitle");
    const emptyMessage = document.getElementById("emptyMessage");

    const totalIncome = document.getElementById("totalIncome");
    const totalExpense = document.getElementById("totalExpense");
    const balance = document.getElementById("balance");
    const transactionCount = document.getElementById("transactionCount");

    const searchInput = document.getElementById("searchInput");
    const typeFilter = document.getElementById("typeFilter");
    const categoryFilter = document.getElementById("categoryFilter");
    const sortFilter = document.getElementById("sortFilter");

    const submitBtn = document.getElementById("submitBtn");
    const cancelEdit = document.getElementById("cancelEdit");
    const formHeading = document.getElementById("formHeading");
    const formStatus = document.getElementById("formStatus");
    const themeToggle = document.getElementById("themeToggle");

    const descriptionError = document.getElementById("descriptionError");
    const amountError = document.getElementById("amountError");
    const dateError = document.getElementById("dateError");

    const categories = {
        income: [
            "Salary",
            "Business",
            "Freelance",
            "Investment",
            "Gift",
            "Other Income"
        ],
        expense: [
            "Food",
            "Transport",
            "Shopping",
            "Bills",
            "Entertainment",
            "Health",
            "Education",
            "Travel",
            "Rent",
            "Other Expense"
        ]
    };

    const categoryIcons = {
        Salary: "💼",
        Business: "🏢",
        Freelance: "💻",
        Investment: "📈",
        Gift: "🎁",
        "Other Income": "💰",
        Food: "🍔",
        Transport: "🚗",
        Shopping: "🛍️",
        Bills: "🧾",
        Entertainment: "🎬",
        Health: "❤️",
        Education: "📚",
        Travel: "✈️",
        Rent: "🏠",
        "Other Expense": "💳"
    };

    let transactions = loadTransactions();
    let editingId = null;

    // Format amounts as Indian Rupees.
    function formatMoney(value) {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(value);
    }

    // Generate a local date in YYYY-MM-DD format.
    function getToday() {
        const now = new Date();

        return [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0")
        ].join("-");
    }

    function formatDate(value) {
        if (!value) return "";

        const parts = value.split("-");

        if (parts.length !== 3) return value;

        return new Date(
            Number(parts[0]),
            Number(parts[1]) - 1,
            Number(parts[2])
        ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    }

    document.getElementById("todayDate").textContent =
        new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });

    document.getElementById("year").textContent =
        new Date().getFullYear();

    date.max = getToday();
    date.value = getToday();

    // Load transactions from Local Storage.
    function loadTransactions() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            const parsed = saved ? JSON.parse(saved) : [];

            if (!Array.isArray(parsed)) return [];

            return parsed.filter(function (item) {
                return item &&
                    typeof item.id === "string" &&
                    typeof item.description === "string" &&
                    (item.type === "income" || item.type === "expense") &&
                    Number.isFinite(Number(item.amount)) &&
                    Number(item.amount) > 0 &&
                    typeof item.date === "string" &&
                    typeof item.category === "string";
            }).map(function (item) {
                return {
                    ...item,
                    amount: Number(item.amount)
                };
            });
        } catch (error) {
            return [];
        }
    }

    // Save transactions to Local Storage.
    function saveTransactions() {
        try {
            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(transactions)
            );
            return true;
        } catch (error) {
            showStatus(
                "Unable to save data. Check browser storage settings.",
                "error"
            );
            return false;
        }
    }

    function createId() {
        if (window.crypto &&
            typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }

        return Date.now().toString() + "-" +
            Math.random().toString(36).slice(2);
    }

    function showStatus(message, className) {
        formStatus.textContent = message;
        formStatus.className = className || "";
    }

    // Update the category choices when the type changes.
    function updateCategoryOptions(selectedCategory) {
        const selectedType = type.value;

        category.replaceChildren();

        categories[selectedType].forEach(function (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            category.appendChild(option);
        });

        if (selectedCategory &&
            categories[selectedType].includes(selectedCategory)) {
            category.value = selectedCategory;
        }
    }

    type.addEventListener("change", function () {
        updateCategoryOptions();
    });

    updateCategoryOptions();

    // Populate the category filter with all income and expense categories.
    function updateCategoryFilter() {
        const previousValue = categoryFilter.value;
        const allCategories = [
            ...categories.income,
            ...categories.expense
        ];

        categoryFilter.replaceChildren();

        const allOption = document.createElement("option");
        allOption.value = "all";
        allOption.textContent = "All Categories";
        categoryFilter.appendChild(allOption);

        allCategories.forEach(function (item) {
            const option = document.createElement("option");
            option.value = item;
            option.textContent = item;
            categoryFilter.appendChild(option);
        });

        if (allCategories.includes(previousValue)) {
            categoryFilter.value = previousValue;
        } else {
            categoryFilter.value = "all";
        }
    }

    // Form validation.
    function clearErrors() {
        descriptionError.textContent = "";
        amountError.textContent = "";
        dateError.textContent = "";
    }

    function validateForm() {
        clearErrors();

        let valid = true;
        const title = description.value.trim();
        const money = Number(amount.value);

        if (!title) {
            descriptionError.textContent =
                "Please enter a transaction description.";
            valid = false;
        } else if (title.length > 100) {
            descriptionError.textContent =
                "Description must not exceed 100 characters.";
            valid = false;
        }

        if (
            amount.value.trim() === "" ||
            !Number.isFinite(money) ||
            money <= 0 ||
            money > 1000000000000
        ) {
            amountError.textContent =
                "Enter an amount greater than zero.";
            valid = false;
        }

        if (!date.value) {
            dateError.textContent = "Please select a date.";
            valid = false;
        } else if (
            !/^\d{4}-\d{2}-\d{2}$/.test(date.value) ||
            date.value > getToday()
        ) {
            dateError.textContent =
                "Please select a valid date that is not in the future.";
            valid = false;
        }

        return valid;
    }

    function resetForm() {
        form.reset();
        editingId = null;

        formHeading.textContent = "Add Transaction";
        submitBtn.textContent = "+ Add Transaction";
        cancelEdit.hidden = true;

        type.value = "expense";
        updateCategoryOptions();

        date.value = getToday();
        date.max = getToday();

        clearErrors();
    }

    cancelEdit.addEventListener("click", function () {
        resetForm();
        showStatus("Editing cancelled.", "");
    });

    // Add a transaction or save edited changes.
    form.addEventListener("submit", function (event) {
        event.preventDefault();

        if (!validateForm()) {
            showStatus("Please correct the highlighted fields.", "error");
            return;
        }

        const transaction = {
            id: editingId || createId(),
            description: description.value.trim(),
            type: type.value,
            amount: Math.round(Number(amount.value) * 100) / 100,
            category: category.value,
            date: date.value
        };

        const previousTransactions = transactions;

        if (editingId) {
            transactions = transactions.map(function (item) {
                return item.id === editingId ? transaction : item;
            });
        } else {
            transactions.unshift(transaction);
        }

        if (!saveTransactions()) {
            transactions = previousTransactions;
            return;
        }

        const message = editingId
            ? "Transaction updated successfully!"
            : "Transaction added successfully!";

        resetForm();
        showStatus(message, "success");
        updateCategoryFilter();
        render();
    });

    // Edit an existing transaction.
    function editTransaction(id) {
        const transaction = transactions.find(function (item) {
            return item.id === id;
        });

        if (!transaction) return;

        editingId = id;

        description.value = transaction.description;
        type.value = transaction.type;
        updateCategoryOptions(transaction.category);
        amount.value = transaction.amount;
        date.value = transaction.date;

        formHeading.textContent = "Edit Transaction";
        submitBtn.textContent = "Save Changes";
        cancelEdit.hidden = false;

        clearErrors();
        showStatus("", "");

        form.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        description.focus();
    }

    // Delete a transaction.
    function deleteTransaction(id) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this transaction?"
        );

        if (!confirmed) return;

        const previousTransactions = transactions;

        transactions = transactions.filter(function (item) {
            return item.id !== id;
        });

        if (!saveTransactions()) {
            transactions = previousTransactions;
            return;
        }

        if (editingId === id) {
            resetForm();
        }

        showStatus("Transaction deleted.", "success");
        updateCategoryFilter();
        render();
    }

    // Create safe HTML elements.
    function makeElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;

        return element;
    }

    // Create an individual transaction row.
    function createTransactionRow(item) {
        const row = makeElement("article", "transaction-item");

        const icon = makeElement(
            "div",
            "transaction-icon",
            categoryIcons[item.category] || "💳"
        );

        const details = makeElement("div", "transaction-details");
        const title = makeElement("h3", "", item.description);

        const meta = makeElement("div", "transaction-meta");
        meta.appendChild(makeElement("span", "", item.category));
        meta.appendChild(makeElement("span", "", "•"));
        meta.appendChild(makeElement("span", "", formatDate(item.date)));

        details.appendChild(title);
        details.appendChild(meta);

        const signedAmount = (item.type === "income" ? "+" : "−") +
            formatMoney(item.amount);

        const money = makeElement(
            "div",
            "transaction-amount " + item.type,
            signedAmount
        );

        const actions = makeElement("div", "transaction-actions");

        const editButton = makeElement("button", "icon-btn", "✏️");
        editButton.type = "button";
        editButton.title = "Edit transaction";
        editButton.setAttribute(
            "aria-label",
            "Edit " + item.description
        );

        editButton.addEventListener("click", function () {
            editTransaction(item.id);
        });

        const deleteButton = makeElement(
            "button",
            "icon-btn delete-btn",
            "🗑️"
        );

        deleteButton.type = "button";
        deleteButton.title = "Delete transaction";
        deleteButton.setAttribute(
            "aria-label",
            "Delete " + item.description
        );

        deleteButton.addEventListener("click", function () {
            deleteTransaction(item.id);
        });

        actions.appendChild(editButton);
        actions.appendChild(deleteButton);

        row.appendChild(icon);
        row.appendChild(details);
        row.appendChild(money);
        row.appendChild(actions);

        return row;
    }

    // Apply search, category filtering, type filtering, and sorting.
    function getFilteredTransactions() {
        const searchTerm = searchInput.value.trim().toLowerCase();
        const selectedType = typeFilter.value;
        const selectedCategory = categoryFilter.value;
        const sortBy = sortFilter.value;

        let filtered = transactions.filter(function (item) {
            const matchesSearch =
                item.description.toLowerCase().includes(searchTerm) ||
                item.category.toLowerCase().includes(searchTerm);

            const matchesType =
                selectedType === "all" || item.type === selectedType;

            const matchesCategory =
                selectedCategory === "all" ||
                item.category === selectedCategory;

            return matchesSearch && matchesType && matchesCategory;
        });

        if (sortBy === "newest") {
            filtered.sort(function (a, b) {
                return b.date.localeCompare(a.date);
            });
        } else if (sortBy === "oldest") {
            filtered.sort(function (a, b) {
                return a.date.localeCompare(b.date);
            });
        } else if (sortBy === "highest") {
            filtered.sort(function (a, b) {
                return b.amount - a.amount;
            });
        } else if (sortBy === "lowest") {
            filtered.sort(function (a, b) {
                return a.amount - b.amount;
            });
        }

        return filtered;
    }

    // Update the financial summary and history.
    function render() {
        const income = transactions.reduce(function (sum, item) {
            return sum + (item.type === "income" ? item.amount : 0);
        }, 0);

        const expenses = transactions.reduce(function (sum, item) {
            return sum + (item.type === "expense" ? item.amount : 0);
        }, 0);

        totalIncome.textContent = formatMoney(income);
        totalExpense.textContent = formatMoney(expenses);
        balance.textContent = formatMoney(income - expenses);

        transactionCount.textContent =
            transactions.length + (
                transactions.length === 1 ? " transaction" : " transactions"
            );

        const filtered = getFilteredTransactions();

        transactionList.replaceChildren();

        filtered.forEach(function (item) {
            transactionList.appendChild(createTransactionRow(item));
        });

        emptyState.hidden = filtered.length > 0;

        if (transactions.length === 0) {
            emptyTitle.textContent = "No transactions yet";
            emptyMessage.textContent =
                "Add your first transaction to see it here.";
        } else if (filtered.length === 0) {
            emptyTitle.textContent = "No matching transactions";
            emptyMessage.textContent =
                "Try changing your search or filters.";
        }
    }

    // Refresh the transaction list whenever a filter changes.
    searchInput.addEventListener("input", render);
    typeFilter.addEventListener("change", render);
    categoryFilter.addEventListener("change", render);
    sortFilter.addEventListener("change", render);

    // Dark mode with saved preference.
    function applyTheme(theme) {
        document.body.classList.toggle("dark", theme === "dark");
        themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
        themeToggle.setAttribute(
            "aria-label",
            theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
        );
    }

    let savedTheme = "light";

    try {
        savedTheme = localStorage.getItem(THEME_KEY) || "light";
    } catch (error) {
        savedTheme = "light";
    }

    applyTheme(savedTheme);

    themeToggle.addEventListener("click", function () {
        const newTheme = document.body.classList.contains("dark")
            ? "light"
            : "dark";

        applyTheme(newTheme);

        try {
            localStorage.setItem(THEME_KEY, newTheme);
        } catch (error) {
            // Theme remains active until the page is closed.
        }
    });

    // Initial setup.
    updateCategoryFilter();
    render();
});
