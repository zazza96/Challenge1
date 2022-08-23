# Challenge 1  #
## install and run project
To compile the code run 'npm i' to install dependencies, then run 'npm run build' to compile the code.

To start the server, run 'npm run buildServer' and then follow the localhost link provided on the terminal, which should be http://localhost:7000 if not, the terminal should tell you the exact localhost port being used.

From the page, look for the css and javascript file from the network part when accessing inspector mode.

The javascript link file should be: http://localhost:7001/assets/js/app.abe85f165799afd87df7.js

The css link file should be: http://localhost:7001/assets/css/styles.abe85f165799afd87df7.css

## Project explanations ##
The complications of this project come down to the fact that it is a single page application made on react, so elements keep deleting themselves and replacing themselves. As sometimes the javascript also gets injected before the elements exist, it makes it harder to attach functionality and events to certain elements. This

This is why I'm polling for elements, the pollFor function waits for an element to exist before firing other code, once the elements exist, it then fires those events and functionalities.

As elements keep deleting themselves, however, the mutation observer function had to be added to observe change happening on the page, and then reattach certain events and functionalities.

To add the discount, I am looking for the price and then taking that price and applying the 20% off, then I've inserted the new elements, however, due to commas and currency symbols I needed to use the replace() function.
