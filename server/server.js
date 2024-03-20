'use strict';

//Modules for CORS, express, and smartcar
const cors = require('cors');
const express = require('express');
const smartcar = require('smartcar');

// Create a new express application on port 8000
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

// Login route for Smartcar authentication
app.get('/login', function(req, res) {
    const link = client.getAuthUrl(['required:read_vehicle_info']);
    res.redirect(link);
});

//Response from Smartcar, exchange code for access token
app.get('/exchange', async function(req, res) {
    const code = req.query.code;
    access = await client.exchangeCode(code);
    res.redirect('/vehicle');
});

app.get('/vehicle', async function(req, res) {
    //Get vehicle IDs
    const vehicleIds = await smartcar.getVehicleIds(access.accessToken);
    //Create first vehicle object in list of vehicles
    const vehicle = new smartcar.Vehicle(vehicleIds.vehicles[0], access.accessToken);
    //get vehicle info
    const info = await vehicle.info();
    console.log(info);
    res.json(info);
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
