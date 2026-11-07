# Smart Waste Bin Dashboard

## Run
1. Extract ZIP and open the folder in VS Code.
2. Open terminal in this folder.
3. Run `npm install`
4. Run `npm run dev`
5. Open the localhost URL shown by Vite (usually http://localhost:5173).

The dashboard is already configured for:
`https://micro-test-cihr.onrender.com`

It reads `GET /api/health` and `GET /api/readings`, and refreshes every 3 seconds.

To change backend URL, create `.env` using `.env.example`, update `VITE_API_BASE_URL`, then restart Vite.

If the browser reports CORS errors, enable CORS on the Express backend for the frontend origin.
