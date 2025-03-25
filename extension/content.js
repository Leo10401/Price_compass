chrome.runtime.sendMessage({ action: "getSupportedSites" }, (response) => {
    if (!response || !response.supportedSites) {
        console.error("Failed to retrieve supported sites");
        return;
    }

    const currentSite = response.supportedSites.find(site => location.hostname.includes(site.domain));
    if (!currentSite) {
        console.error("Site not supported:", location.hostname);
        return;
    }

    let productNameElement = document.querySelector(currentSite.productNameSelector);
    let productPriceElement = document.querySelector(currentSite.productPriceSelector);

    if (!productPriceElement) {
        const selectors = currentSite.productPriceSelector.split(/[ ,]+/);
        for (const selector of selectors) {
            productPriceElement = document.querySelector(selector);
            if (productPriceElement) break;
        }
    }

    const productName = productNameElement?.textContent.trim() || "Unknown Product";
    const productPrice = productPriceElement?.textContent.trim() || "Price Not Found";

    console.log("Extracted Product:", productName);
    console.log("Extracted Price:", productPrice);
    

    if (productName !== "Unknown Product" && productPrice !== "Price Not Found") {
        chrome.runtime.sendMessage({ action: "productData", data: { productName, productPrice, site: currentSite.domain } }, () => {
            chrome.runtime.sendMessage({ action: "comparePrices", data: { productName, site: currentSite.domain } });
        });
    }
});
