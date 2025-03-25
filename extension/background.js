const supportedSites = [
    {
        domain: "flipkart.com",
        productNameSelector: "span.VU-ZEz",
        productPriceSelector: "div.Nx9bqj.CxhGGd",
        searchUrl: "https://www.flipkart.com/search?q={query}",
        searchResultsContainer: "div._75nlfW",
        titleSelector: "div.KzDlHZ",
        priceSelector: "div.Nx9bqj._4b5DiR"
    },
    {
        domain: "amazon.in",
        productNameSelector: "#productTitle",
        productPriceSelector: ".a-price-whole",
        searchUrl: "https://www.amazon.in/s?k={query}",
        searchResultsContainer: ".sg-col-20-of-24.s-result-item.s-asin.sg-col-0-of-12.sg-col-16-of-20.AdHolder.sg-col.s-widget-spacing-small.sg-col-12-of-16",
        titleSelector: ".a-size-medium.a-spacing-none.a-color-base.a-text-normal span",
        priceSelector: ".a-price-whole "
    },
    {
        domain: "snapdeal.com",
        productNameSelector: ".pdp-e-i-head",
        productPriceSelector: ".payBlkBig",
        searchUrl: "https://www.snapdeal.com/search?keyword={query}",
        searchResultsContainer: ".product-tuple-listing",
        titleSelector: ".product-title",
        priceSelector: ".lfloat.product-price"
    },
    {
        domain: "myntra.com",
        productNameSelector: ".pdp-title",
        productPriceSelector: ".pdp-price",
        searchUrl: "https://www.myntra.com/{query}",
        searchResultsContainer: ".results-base .product-base",
        titleSelector: ".product-product",
        priceSelector: ".product-price"
    }
];

// Updated fetchPricesFromOtherSites to wait for the tab to fully load
function fetchPricesFromOtherSites(productName, currentSite) {
    return Promise.all(
        supportedSites
            .filter(site => site.domain !== currentSite)
            .map(site => new Promise(resolve => {
                const searchUrl = site.searchUrl.replace("{query}", encodeURIComponent(productName));
                chrome.tabs.create({ url: searchUrl, active: false }, tab => {
                    const tabId = tab.id;
                    chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {
                        if (updatedTabId === tabId && info.status === 'complete') {
                            chrome.tabs.onUpdated.removeListener(listener);
                            chrome.scripting.executeScript({
                                target: { tabId: tabId },
                                func: scrapePrice,
                                args: [site]
                            }, (results) => {
                                chrome.tabs.remove(tabId);
                                let price = "Not Found";
                                if (chrome.runtime.lastError) {
                                    console.error(chrome.runtime.lastError);
                                } else if (results && results[0] && results[0].result) {
                                    price = results[0].result.price || "Not Found";
                                }
                                resolve({ site: site.domain, price });
                            });
                        }
                    });
                });
            }))
    );
}

function scrapePrice(site) {
    const firstResult = document.querySelector(site.searchResultsContainer);
    if (!firstResult) return null;
    const priceElement = firstResult.querySelector(site.priceSelector);
    return { price: priceElement?.innerText.trim() };
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getProductData") {
        chrome.storage.local.get(["productData"], (result) => {
            sendResponse({ data: result.productData || null });
        });
        return true;
    }

    if (message.action === "productData") {
        if (!message.data) {
            console.error("Received empty product data");
            return;
        }
        chrome.storage.local.set({ productData: message.data }, () => {
            console.log("Product data saved successfully");
        });
    }

    if (message.action === "comparePrices") {
        const { productName, site } = message.data;
        fetchPricesFromOtherSites(productName, site).then(prices => {
            sendResponse({ prices });
        });
        return true;
    }

    if (message.action === "getSupportedSites") {
        sendResponse({ supportedSites });
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received: ", message);
    if (message.action === "fetchData") {
        sendResponse({ success: true, data: "Sample Data" });
    }
    return true; // Keeps the message port open for async responses
});
