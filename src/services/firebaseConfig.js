// const admin = require("firebase-admin");
// const path = require("path");

// // Path to your Firebase service account key
// const serviceAccount = require("../path/to/your/serviceAccountKey.json");

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "your-project-id.appspot.com", // Replace with your Firebase Storage bucket URL
// });

// const bucket = admin.storage().bucket();

// module.exports = { bucket };


// const admin = require("firebase-admin");
// const path = require("path");

// // Dummy Firebase Service Account JSON
// const serviceAccount = {
//   "type": "service_account",
//   "project_id": "dummy-project-id",
//   "private_key_id": "dummy-private-key-id",
//   "private_key": "-----BEGIN PRIVATE KEY-----\nDUMMY_PRIVATE_KEY\n-----END PRIVATE KEY-----\n",
//   "client_email": "firebase-adminsdk@example.iam.gserviceaccount.com",
//   "client_id": "123456789012345678901",
//   "auth_uri": "https://accounts.google.com/o/oauth2/auth",
//   "token_uri": "https://oauth2.googleapis.com/token",
//   "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
//   "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk%40example.iam.gserviceaccount.com"
// };

// // Initialize Firebase Admin SDK
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   storageBucket: "dummy-project-id.appspot.com" // Dummy Firebase Storage bucket URL
// });

// const bucket = admin.storage().bucket();

// module.exports = { bucket };
