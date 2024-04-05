# CCAPDEV-MCO-PHASE3

Render Website Link: https://ilabyou-reservation-system.onrender.com/

How to Run This Locally:
1. In order to run the project locally, first open auth-routes.js in the controllers folder.
2. Next, locate the function add(server) and just under that is the declaration for mongURI.
3. Comment out "const mongoURI = process.env.MONGODB_URI;" and replace that with "const mongoURI = 'mongodb://127.0.0.1:27017/labDB';" instead.
