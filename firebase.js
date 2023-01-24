var admin = require("firebase-admin");

var serviceAccount = require("./configs/firebase-key.json");

admin.initializeApp({

  credential: admin.credential.cert(serviceAccount),
  storageBucket:"storageapp-13725.appspot.com/"
});

const bucket = admin.storage().bucket()

module.exports = {
  bucket
}