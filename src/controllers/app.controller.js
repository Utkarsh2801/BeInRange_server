const apis = require('../services/apis');
const axios = require('axios');
const User = require("../schema/user.schema");
const Geofence = require("../schema/geofence.schema");
const sendNotification = require("../utils/messaging.utils");

exports.handleWebhook = async (req, res, next) => {

    if (req.body.events) {
        let user = await User.findOne({ userId: req.body.events[0].user_id });

        if (user) {
            if (req.body.events[0].event_type == 'geospark:geofence:entry') {
                await sendNotification({
                    notification: {
                        title: "Welcome!",
                        body: "You have entered in geofence"
                    }
                }, user.fcmToken);
            } else if (req.body.events[0].event_type == 'geospark:geofence:Exit') {
                await sendNotification({
                    notification: {
                        title: "Attention!",
                        body: "You have left the geofence"
                    }
                }, user.fcmToken);
            }
        }

    }
    res.json({})
}

// Create geofence for user
exports.createGeofence = async (req, res) => {
    try {
        if (!req.body.coordinates
            || !req.body.geometry_radius
            || !req.body.geometry_type
            || !req.body.user_ids
            || !req.body.is_enabled) {

            return res.status(401).json({
                status: true,
                message: "Please provide all the required values"
            })
        }

        const response = await axios.post(`${apis.ROAM_BASE_URL}/${apis.CREATE}/`, req.body, {
            headers: {
                "Api-key": process.env.ROAM_API_KEY,
            }
        })

        let ogeo = await Geofence.findOne({ user: req.body.user_ids[0], isDeleted: false });

        if (ogeo) {
            ogeo.isDeleted = true;
            await ogeo.save();
        }

        const ngeo = new Geofence({
            user: response.data.data.user_ids[0],
            geofenceId: response.data.data.geofence_id,
            radius: response.data.data.geometry_radius,
            coords: response.data.data.geometry_center.coordinates
        })

        await ngeo.save();

        res.status(200).json({
            status: true,
            message: "Geofence created",
            data: response.data.data
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Server Error"
        })
    }
}

// Update geofence for user
exports.updateGeofence = async (req, res) => {
    try {
        if (!req.body.coordinates
            || !req.body.geometry_radius
            || !req.body.geometry_type
            || !req.body.user_ids
            || !req.body.is_enabled
            || !req.body.geofence_id
            ) {

            return res.status(401).json({
                status: true,
                message: "Please provide all the required values"
            })
        }

    
        let ogeo = await Geofence.findOne({ user: req.body.user_ids[0], isDeleted: false });
                

        if(ogeo) {
            await axios.delete(`${apis.ROAM_BASE_URL}/${apis.CREATE}/?geofence_id=${req.body.geofence_id}`,{
                headers: {
                    "Api-key": process.env.ROAM_API_KEY,
                }
            })

            ogeo.isDeleted = true;
            await ogeo.save();
        }
        
        req.body['geofence_id'] = undefined;

        const response = await axios.post(`${apis.ROAM_BASE_URL}/${apis.CREATE}/`, req.body, {
            headers: {
                "Api-key": process.env.ROAM_API_KEY,
            }
        })

        const ngeo = new Geofence({
            user: response.data.data.user_ids[0],
            geofenceId: response.data.data.geofence_id,
            radius: response.data.data.geometry_radius,
            coords: response.data.data.geometry_center.coordinates
        })

        await ngeo.save();

        console.log(response.data.data)

        res.status(200).json({
            status: true,
            message: "Geofence updated successfully",
            data: response.data.data
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Server Error"
        })
    }
}




// Add a new user
exports.addUser = async (req, res) => {
    try {
        if (!req.body.userId || !req.body.fcmToken) {
            return res.status(401).json({
                status: false,
                message: "Information missing"
            })
        }

        const user = new User({
            userId: req.body.userId,
            fcmToken: req.body.fcmToken
        });

        await user.save();

        res.status(200).json({
            status: true,
            message: "User created successfully"
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "Server Error"
        })
    }
}