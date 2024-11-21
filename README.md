# Newsletter Subscription Renewal Flow

A simulation of a newsletter subscription renewal process with a modern UI, built using Next.js, Express, Nodejs, and MongoDB.

## 🌐 Live Demo

- Deployed link: [https://newsletter-subscription-email-agrim.vercel.app/](https://newsletter-subscription-email-agrim.vercel.app/)
- Backend deployed link: [https://newsletter-subscription-email-agrim.onrender.com](https://newsletter-subscription-email-agrim.onrender.com)
- Video Demo: [Watch on YouTube](https://youtu.be/6G1hYqUzJTg)

## 🔄 Flow Process

- User initiates flow simulation
- System sends first reminder email
- Waits for 3 days (simulated in seconds)
- Checks renewal status
- If not renewed:
  - Sends second reminder
  - Waits for 2 days(seconds)
  - Final status check
- Flow completes with either renewal thank you message or no further action

## ✍️ My Solution and assumptions

- I started with buidling the backend, making it robust with respect to every requirement
- While backend testing, I checked every case which can happen
- Built the frontend, used UI library and animations to show the progress bar
- Beautify the UI

## 🛠️ Tech Stack

### Frontend
- Next.js 13+ (React Framework)
- TypeScript
- NextUI (UI Components)
- Tailwind CSS (Styling)
- React Icons
- Lucide React

### Backend
- Node.js
- Express.js
- MongoDB (Database)
- Mongoose (ODM)
- Cors (Cross-Origin Resource Sharing)

## ⚙️ Installation & Setup

1. Clone the repository
```bash
git clone [your-repository-url]
cd newsletter-subscription-flow
```

2. Frontend Setup
```bash
cd newsletter-flow-frontend
npm install
npm run dev
```

3. Backend Setup
```bash
cd newsletter-flow-backend
npm install
```

4. Create a `.env` file in the backend directory with:
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
```

5. Start the backend server
```bash
npm start
```

## 📝 API Endpoints

- `POST /api/flows/start` - Start a new flow
- `POST /api/flows/simulate` - Simulate flow progression
- `GET /api/flows/list` - List all flows (testing only)

## 💡 Implementation Details

- The flow simulation uses random number generation to determine renewal status
- Waiting periods are simulated using timeouts
- Flow state and logs are persisted in MongoDB
- User IDs are randomly generated for each simulation
- The UI updates in real-time as the flow progresses

## 🎨 UI Components

- **StepProgressBar**: Visualizes the current stage of the flow
- **SimulationButton**: Controls flow simulation
- **SimulationLogs**: Displays real-time progress logs
- **SimulationStatus**: Shows completion/error status
- **EmailPosition**: Decorative email icons background
