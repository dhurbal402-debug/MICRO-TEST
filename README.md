# Smart Waste Bin Monitoring — Local Data Server

A small Node.js + Express API that receives ESP32 fill-level readings and stores them in MongoDB.

## 1. Requirements
- Node.js (LTS)
- MongoDB Community Server running locally, OR a MongoDB Atlas connection string

## 2. Install
Open a terminal in this folder:

```bash
npm install
```

## 3. Configure MongoDB
Copy `.env.example` to `.env`.

Windows CMD:
```bat
copy .env.example .env
```

Default local MongoDB URI:
```env
MONGODB_URI=mongodb://127.0.0.1:27017/smart_waste_bin
PORT=5000
```

If you use MongoDB Atlas, replace the URI with your Atlas connection string.

MongoDB is optional for the first API test: if it cannot connect, the server starts in temporary in-memory mode. Data in memory is lost when the server stops. To persist data, start MongoDB or configure Atlas.

## 4. Run
Development:
```bash
npm run dev
```

Or:
```bash
npm start
```

Open:
- http://localhost:5000/
- http://localhost:5000/api/health

## 5. Test sending sample sensor data
Use Postman, or run this in a second terminal:

```bash
curl -X POST http://localhost:5000/api/readings ^
  -H "Content-Type: application/json" ^
  -d "{\"binId\":\"BIN-01\",\"distanceCm\":12.5,\"fillLevel\":75}"
```

Read latest:
```text
GET http://localhost:5000/api/readings/latest
```

Read history:
```text
GET http://localhost:5000/api/readings?limit=50
```

## API summary

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Server/database status |
| POST | `/api/readings` | Save a sensor reading |
| GET | `/api/readings/latest` | Get latest reading |
| GET | `/api/readings` | Get reading history |

### POST body
```json
{
  "binId": "BIN-01",
  "distanceCm": 12.5,
  "fillLevel": 75
}
```

`fillLevel` must be a number from 0 to 100.

## Important: Wokwi simulation connection
The server runs on your PC, but a cloud-hosted Wokwi simulation generally cannot reach your PC's `localhost` directly. For ESP32-to-server testing, expose port 5000 through a temporary HTTPS tunnel (for example, ngrok), then use that public tunnel URL in the ESP32 code. Do not share the tunnel URL publicly; stop the tunnel after testing.
