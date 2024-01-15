const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');

admin.initializeApp();

// Initialize the Vision API client
const visionClient = new vision.ImageAnnotatorClient();

exports.processImage = functions.https.onRequest({ cors: true }, async (req, res) => {
    try {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST');

        if (req.method === "OPTIONS") {
            // stop preflight requests here
            res.status(204).send('');
            return;
        }
        // Check if the request has a file attached
        if (!req.body || !req.body.imageBase64) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // Decode base64 image
        const imageBuffer = Buffer.from(req.body.imageBase64, 'base64');

        // Call Vision API to get annotations
        const [result] = await visionClient.textDetection(imageBuffer);
        const annotations = result.textAnnotations;

        if (!annotations || annotations.length === 0) {
            return res.status(400).json({ error: 'No text found in the image' });
        }

        annotations.forEach(console.log);

        // Extract relevant information from the annotations
        const expenseDetails = {
            text: annotations[0].description,
            // Add logic to extract item, amount, date, and place from the text
        };

        // Save the extracted details to Firebase or perform further processing
        // You can use admin.firestore() to interact with Firebase Firestore

        return res.status(200).json({ expenseDetails });
    } catch (error) {
        console.error('Error processing image:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

functions.http('corsEnabledFunction', (req, res) => {
    // Set CORS headers for preflight requests
    // Allows GETs from any origin with the Content-Type header
    // and caches preflight response for 3600s

    res.set('Access-Control-Allow-Origin', '*');

    if (req.method === 'OPTIONS') {
        // Send response to OPTIONS requests
        res.set('Access-Control-Allow-Methods', 'GET');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        res.set('Access-Control-Max-Age', '3600');
        res.status(204).send('');
    } else {
        res.send('Hello World!');
    }
});
