export default () => {
    pollFor(".listing-pbox .eOXOEk", _ => {
        priceDetection();
    });

    pollFor(".sc-98aa4w-0.gRTkcX", _ => {
        // Select the node that will be observed for mutations
        const targetNode = document.querySelector('.sc-98aa4w-0.gRTkcX');

        // Options for the observer (which mutations to observe)
        const config = {
            childList: true
        };

        // Callback function to execute when mutations are observed
        const callback = (mutationList, observer) => {
            priceDetection();
            
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
        
        window.addEventListener('locationchange', function () {
            priceDetection();
        });
    });
    pollFor("#ROOT_RESPONSIVE_CONTAINER > div", _ => {
        // Select the node that will be observed for mutations
        const targetNode2 = document.querySelector('#ROOT_RESPONSIVE_CONTAINER > div');

        // Options for the observer (which mutations to observe)
        const config2 = {
            attributes: true, childList: true
        };

        // Callback function to execute when mutations are observed
        const callback2 = (mutationList, observer) => {
            priceDetection();
            
        };

        // Create an observer instance linked to the callback function
        const observer2 = new MutationObserver(callback2);

        // Start observing the target node for configured mutations
        observer2.observe(targetNode2, config2);
        
        window.addEventListener('locationchange', function () {
            priceDetection();
        });
    });
}
function priceDetection(){
    if(!document.querySelector('.discountedPrice')){
        let getPrice = [...document.querySelectorAll(".listing-pbox .eOXOEk span.hEyBwM")];

        getPrice.forEach(price => {
            let stringPrice = parseFloat(price.textContent.replace(/\$|,|£|€/g, ""));
            let discountPrice = stringPrice - calc20Off(stringPrice);
            price.insertAdjacentHTML('beforebegin', `<span class="discountedPrice" font-size="L" color="slate" font-family="tiemposText" font-weight="400" ><span class="currency"></span>${discountPrice.toFixed(2)}</span>`);
            price.insertAdjacentHTML('afterend', `<span class="discountPercentage" font-size="L" color="slate" font-family="tiemposText" font-weight="400" >(-20%)</span>`);
            price.classList.add('dicounted');
            price.parentElement.nextElementSibling.innerHTML = `approx <span class="currency"></span><span class="newPrice">${discountPrice.toFixed(2)} </span><span class="oldPrice">${price.textContent}</span> <span class="discountPercentage">(-20%)</span> / bedroom`;
        });
        let currency = [...document.querySelectorAll(".currency")];
        currency.forEach(e => {
            if (document.querySelector('.listing-pbox .eOXOEk span.hEyBwM').textContent.includes('£')) {
                e.textContent = '£';
            } else if (document.querySelector('.listing-pbox .eOXOEk span.hEyBwM').textContent.includes("$")) {
                e.textContent = '$';
            } else if (document.querySelector('.listing-pbox .eOXOEk span.hEyBwM').textContent.includes("€")) {
                e.textContent = '€';
            }

        });
    }
}
function calc20Off(price) {
    return (20 / 100) * price;
}

function elementExists(el) {
    return document.querySelectorAll(el).length > 0;
}

function isFunction(x) {
    return typeof x === "function";
}

function isString(x) {
    return typeof x === "string";
}
/**
 * @callback pollForCallback
 * @param {string|function|array} assertion - The assertion that was passed to pollFor
 */
/**
 * A poller which allows you to wait for specific criteria before running
 * a callback function.
 * @param {string|function|array} assertion - Either a CSS selector, a function that returns a boolean, or an array of functions
 * @param {pollForCallback} onSuccess - The function to run when the assertion has returned true
 * @param {number|null} [timeout=10] - How many seconds should we poll for before giving up
 * @param {pollForCallback|null} [onTimeout] - An optional function to run when polling has timed out
 */
function pollFor(assertion, onSuccess) {
    var timeout =
        arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;
    var onTimeout =
        arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;
    var test,
        // Holds the function that will be tested on each loop
        expired = false,
        // A flag that will be set to true on timeout
        timeoutInSeconds = timeout * 1000; // Converts the seconds passed in to milliseconds
    // Convert the assertion into a testable function
    if (isFunction(assertion)) {
        test = assertion;
    } else if (isString(assertion)) {
        test = function test() {
            return elementExists(assertion);
        };
    } else if (Array.isArray(assertion)) {
        test = function test() {
            return (
                assertion
                .reduce(function (o, n) {
                    if (typeof n !== "function" && typeof n !== "string") {
                        throw new Error("assertion is not a string or function");
                    }
                    o.push(typeof n === "function" ? n() : elementExists(n));
                    return o;
                }, [])
                .indexOf(false) === -1
            ); // All assertions need to evaluate to true
        };
    } else {
        throw new Error("assertion must be a Function, String, or Array");
    } // Ensure backwards compatability for requestAnimationFrame;
    var requestAnimationFrame =
        window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        }; // This will repeatedly test the assertion until expired is true
    function loop() {
        if (expired === true) {
            // If onTimeout exists, call it
            if (isFunction(onTimeout)) {
                onTimeout(assertion);
            }
        } else {
            if (test() === true) {
                onSuccess(assertion);
            } else {
                requestAnimationFrame(loop);
            }
        }
    } // Kick off the loop
    if (typeof test === "function") {
        loop(); // Set the expired flag to true after the elapsed timeout
        window.setTimeout(function () {
            expired = true;
        }, timeoutInSeconds);
    }
}