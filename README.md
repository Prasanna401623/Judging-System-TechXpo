# Hawkathon Judging System

A web-based judging system for hackathon events, built with Next.js, TailwindCSS, and Firebase Realtime Database.

## Features

- Judge identification with local storage persistence
- Team selection from a dropdown
- Scoring based on multiple criteria (Innovation, UI/UX, Technical Complexity)
- Duplicate submission prevention
- Real-time data storage with Firebase
- Responsive design optimized for tablets

## Prerequisites

- Node.js 18.x or later
- npm 9.x or later
- Firebase project with Realtime Database enabled

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd hawkathon-judging
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with your Firebase configuration:
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_database_url
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter your name when first accessing the application
2. Select a team from the dropdown
3. Score the team on various criteria (0-10)
4. Submit the scores
5. Repeat for other teams

## Firebase Database Structure

```json
{
  "submissions": {
    "$submissionId": {
      "judgeName": "string",
      "teamName": "string",
      "scores": {
        "Innovation": number,
        "UI_UX": number,
        "Technical": number
      },
      "timestamp": number
    }
  }
}
```

## Development

- Built with Next.js 14
- Styled with TailwindCSS and ShadCN UI
- Form handling with React Hook Form and Zod
- Real-time database with Firebase

## License

MIT
