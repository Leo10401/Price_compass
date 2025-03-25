document.addEventListener("DOMContentLoaded", function () {
    const authSection = document.getElementById("authSection");
    const priceSection = document.getElementById("priceSection");
    const authMessage = document.getElementById("authMessage");
    const loginButton = document.getElementById("loginButton");
    const registerButton = document.getElementById("registerButton");
    const logoutButton = document.getElementById("logoutButton");
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const pricesElement = document.getElementById("prices");
    const statusElement = document.getElementById("status");
    const saveButton = document.getElementById("saveButton");

    // Check if the user is already logged in
    const token = localStorage.getItem("token");
    if (token) {
        authSection.classList.add("hidden");
        priceSection.classList.remove("hidden");
        logoutButton.classList.remove("hidden");
        loadPriceComparison();
    }

    // Login User
    loginButton.addEventListener("click", () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                localStorage.setItem("token", data.token);
                authSection.classList.add("hidden");
                priceSection.classList.remove("hidden");
                logoutButton.classList.remove("hidden");
                loadPriceComparison();
            } else {
                authMessage.innerText = data.message || "Login failed";
            }
        })
        .catch(err => console.error("Login error:", err));
    });

    // Register User
    registerButton.addEventListener("click", () => {
        const username = usernameInput.value;
        const password = passwordInput.value;
        fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            authMessage.innerText = data.message || "Registration failed";
        })
        .catch(err => console.error("Registration error:", err));
    });

    // Logout User
    logoutButton.addEventListener("click", () => {
        localStorage.removeItem("token");
        authSection.classList.remove("hidden");
        priceSection.classList.add("hidden");
        logoutButton.classList.add("hidden");
    });

    // Load price comparison data
    function loadPriceComparison() {
        chrome.runtime.sendMessage({ action: "getProductData" }, (response) => {
            if (!response || !response.data) {
                statusElement.innerText = "No product data available.";
                return;
            }

            const { productName, productPrice, site } = response.data;
            pricesElement.innerHTML = `
                <h3>${productName}</h3>
                <p><strong>${site} Price:</strong> ${productPrice}</p>
                <p><strong>Comparing Prices...</strong></p>
            `;

            chrome.runtime.sendMessage({ action: "comparePrices", data: { productName, site } }, (comparisonResponse) => {
                if (!comparisonResponse || !comparisonResponse.prices) {
                    pricesElement.innerHTML += "<p>Error fetching prices.</p>";
                    return;
                }

                let comparisons = comparisonResponse.prices.map(({ site, price }) => `<p><strong>${site}:</strong> ${price}</p>`).join("");
                pricesElement.innerHTML += comparisons;
                saveButton.classList.remove("hidden");

                saveButton.addEventListener("click", () => {
                    fetch("http://localhost:5000/api/prices", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${localStorage.getItem("token")}`
                        },
                        body: JSON.stringify({
                            productName: productName,
                            currentSite: site,
                            currentPrice: productPrice,
                            comparisons: comparisonResponse.prices
                        })
                    })
                    .then(res => res.json())
                    .then(data => {
                        alert("Price history saved successfully!");
                        console.log("Price history saved:", data);
                    })
                    .catch(err => console.error("Error saving history:", err));
                });
            });
        });
    }
});
