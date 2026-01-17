const express = require('express');
const cors = require('cors');
require('dotenv').config({ path: __dirname + '/.env' });
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Threads API Backend is running');
});

// OAuth Flow
app.get('/auth/threads', (req, res) => {
    const { THREADS_APP_ID, REDIRECT_URI } = process.env;
    console.log('Starting OAuth flow');
    console.log('ID:', THREADS_APP_ID);
    console.log('URI:', REDIRECT_URI);

    const scope = 'threads_basic,threads_content_publish'; // Verify correct scopes
    const authUrl = `https://threads.net/oauth/authorize?client_id=${THREADS_APP_ID}&redirect_uri=${REDIRECT_URI}&scope=${scope}&response_type=code`;
    console.log('Redirecting to:', authUrl);
    res.json({ url: authUrl });
});

app.get('/auth/threads/callback', async (req, res) => {
    const { code } = req.query;
    console.log('Received callback with code:', code ? 'Yes' : 'No');

    if (!code) return res.status(400).send('No code provided');

    try {
        const { THREADS_APP_ID, THREADS_APP_SECRET, REDIRECT_URI } = process.env;

        console.log('Exchanging code for token...');
        // Exchange code for short-lived token
        const tokenResponse = await axios.post('https://graph.threads.net/oauth/access_token', {
            client_id: THREADS_APP_ID,
            client_secret: THREADS_APP_SECRET,
            grant_type: 'authorization_code',
            redirect_uri: REDIRECT_URI,
            code: code
        });

        console.log('Token received');
        const { access_token, user_id } = tokenResponse.data;

        // For now, redirect back to frontend with token (In prod, use session/cookie)
        res.redirect(`${process.env.FRONTEND_URL}/login?token=${access_token}&user_id=${user_id}`);
    } catch (error) {
        console.error('Error exchanging token:', error.response?.data || error.message);
        res.status(500).send('Authentication failed: ' + (JSON.stringify(error.response?.data) || error.message));
    }
});

// Post to Threads
app.post('/api/post', async (req, res) => {
    const { token, userId, text, mediaType, mediaUrl } = req.body;

    if (!token || !userId) return res.status(401).send('Unauthorized');
    if (!text && !mediaUrl) return res.status(400).send('Content required');

    try {
        // Step 1: Create Media Container
        let containerId;
        const baseUrl = `https://graph.threads.net/v1.0/${userId}/threads`;

        let containerParams = {
            access_token: token,
            text: text
        };

        if (mediaType === 'IMAGE') {
            containerParams.image_url = mediaUrl;
            containerParams.media_type = 'IMAGE';
        } else if (mediaType === 'VIDEO') {
            containerParams.video_url = mediaUrl;
            containerParams.media_type = 'VIDEO';
        } else {
            containerParams.media_type = 'TEXT';
        }

        const containerResponse = await axios.post(`${baseUrl}`, containerParams); // creating a thread media container
        containerId = containerResponse.data.id;

        // Step 2: Publish Container
        const publishResponse = await axios.post(`${baseUrl}_publish`, {
            creation_id: containerId,
            access_token: token
        });

        res.json({ success: true, id: publishResponse.data.id });

    } catch (error) {
        console.error('Error posting to Threads:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
