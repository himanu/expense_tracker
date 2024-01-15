const functions = require('firebase-functions');
const admin = require('firebase-admin');
const vision = require('@google-cloud/vision');

admin.initializeApp();

// Initialize the Vision API client
const visionClient = new vision.ImageAnnotatorClient();

exports.processImage = functions.https.onRequest(async (req, res) => {
    try {
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
