# Protothon 2026 Judging System

A web-based judging system for Girls Who Code (GWC) Protothon 2026, a project showcase event, built with Next.js, TailwindCSS, and Firebase Realtime Database.

## Features

- Judge identification with local storage persistence
- Team selection from a dropdown
- Scoring with the Protothon 2026 Official Judging Rubric: Problem Solving, Creativity & Wow Factor, and Presentation Skills, each scored 1 to 5 (15 points total)
- Target time of 5 minutes per presentation plus 3 minutes for questions
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
cd techxpo-judging
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

1. Enter your judge code when first accessing the application
2. Select a team from the dropdown
3. Score the team from 1 to 5 in each of the three rubric categories
4. Submit the scores
5. Repeat for other teams

## Firebase Database Structure

```json
{
  "submissions": {
    "$submissionId": {
      "judgeCode": "string",
      "judgeName": "string",
      "teamName": "string",
      "scores": {
        "ProblemSolving": number,
        "CreativityWowFactor": number,
        "PresentationSkills": number
      },
      "timestamp": number
    }
  },
  "teams": {
    "$teamId": "string"
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
