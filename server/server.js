require('dotenv').config();
'use strict';

//Modules for CORS, express, and smartcar
const cors = require('cors');
const express = require('express');
const smartcar = require('smartcar');

// Create a new express application on port 3000
const app = express().use(cors());
const port = 8000;

//Create a new client object with Smartcar API credentials
const client = new smartcar.AuthClient({
    clientId: process.env.SMARTCAR_CLIENT_ID,
    clientSecret: process.env.SMARTCAR_CLIENT_SECRET,
    redirectUri: process.env.SMARTCAR_REDIRECT_URI,
    mode: 'test',
  });

// access token
let access;

//********AUTHENTICATION ROUTES**********

// Login route for Smartcar authentication
app.get('/login', function(req, res) {
    const scope = ['read_vehicle_info'];
    const authUrl = client.getAuthUrl(scope);
    res.render('home', {
        url: authUrl,
    });
});

//Response from Smartcar, exchange code for access token
app.get('/exchange', async function(req, res) {
    const code = req.query.code;

    access = await client.exchangeCode(code);
    res.redirect('/vehicle');
});
//VEHICLE ROUTES

app.get('/vehicle', async function(req, res) {
    // Get the smartcar vehicleIds associated with the access_token
    const { vehicles } = await smartcar.getVehicles(access.accessToken);
    
    // Instantiate the first vehicle in the vehicle id list
    const vehicle = new smartcar.Vehicle(vehicles[0], access.accessToken);

    // Make a request to Smartcar API
    const attributes = await vehicle.attributes();
    res.render('vehicle', {
        info: attributes, 
    });
});


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
