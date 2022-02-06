const express = require('express');
const { handleWebhook, createGeofence, addUser, updateGeofence } = require('../controllers/app.controller');

const router = express.Router();

router.post('/handle-webhook', handleWebhook);

router.post('/create-geofence', createGeofence);

router.post('/add-user', addUser);

router.put('/update-geofence', updateGeofence)

module.exports = router;