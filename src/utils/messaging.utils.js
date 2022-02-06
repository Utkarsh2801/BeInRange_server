let admin = require("firebase-admin");

const serviceAccount = require("../beintherange-firebase-adminsdk-j6xf9-2d582660dd.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const notification_options = {
    priority: "high",
    timeToLive: 60 * 60 * 24
};

module.exports = async function (data, token) {
  admin
    .messaging()
    .sendToDevice(token, data)
    .then((response) => {
      console.log(response.successCount + " messages were sent successfully");
    })
    .catch((err) => {
      console.log(err);
    });
};