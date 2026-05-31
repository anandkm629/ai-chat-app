# AI Chat App

A modern full-stack AI chatbot application built with Next.js, Clerk, Prisma, Neon, Groq, and UploadThing.

Users can:
- chat with AI in real time
- upload images
- analyze images with AI vision
- store chat history
- authenticate securely
- experience smooth streaming responses

---

# Features

- AI Chat Streaming
- Authentication with Clerk
- Persistent Chat History
- Image Upload Support
- AI Vision Analysis
- Responsive Mobile UI
- Markdown Rendering
- Syntax Highlighting
- Copy Response Feature
- Animated Chat Experience

---

# Tech Stack

## Frontend
- Next.js 15
- React
- Tailwind CSS
- TypeScript

## Backend
- Next.js API Routes
- Prisma ORM
- PostgreSQL (Neon)

## AI
- Groq API
- Llama 3.1

## Authentication
- Clerk

## File Uploads
- UploadThing

---

# Screenshots

## Home Page
<img width="1919" height="962" alt="image" src="https://github.com/user-attachments/assets/b0f2d103-c599-4c8e-8924-25b778a00729" />

## Chat Interface
<img width="1919" height="976" alt="image" src="https://github.com/user-attachments/assets/6b74c19f-a6a5-4dbc-91a5-7243ad9746f0" />

## Authentication
<img width="1919" height="922" alt="image" src="https://github.com/user-attachments/assets/e12ed3be-0002-471d-a83a-df41605b3dcb" />


---

# Installation

Clone the repository:

```bash
git clone https://github.com/your-username/ai-chat-app.git
```

Navigate to the project folder:

```bash
cd ai-chat-app
```

Install dependencies:

```bash
npm install
```
# Environment Variables

Create a `.env.local` file in the root directory and add:

```env
DATABASE_URL=

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=

CLERK_SECRET_KEY=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in

NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

GROQ_API_KEY=

UPLOADTHING_SECRET=

UPLOADTHING_APP_ID=
```
# Run Development Server

```bash
npm run dev
```

Open:

```bash
http://localhost:3000
```
