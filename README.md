# Gideon AI - Personal Productivity Assistant

A modern, AI-powered productivity application built with Next.js that helps users organize their day through natural conversation. Simply talk about your day, and Gideon AI automatically extracts actionable tasks, tracks your mood, and helps you achieve your goals.

## 🌟 Features

- **Natural Language Processing**: Chat naturally about your day - no structured input required
- **Automatic Task Extraction**: AI automatically identifies and creates actionable tasks from conversations
- **Goal Tracking**: Set and monitor long-term goals with progress tracking
- **Mood & Reflection Logging**: AI analyzes your emotional state and insights from conversations
- **Task Management**: Full CRUD operations for tasks with priorities, due dates, and categories
- **Clean, Modern UI**: Responsive design with Tailwind CSS
- **Secure Authentication**: JWT-based authentication system
- **Real-time Chat Interface**: Smooth, responsive chat experience

## 🚀 Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: MongoDB with Mongoose ODM
- **AI Integration**: OpenAI GPT-4 for message analysis and response generation
- **Authentication**: JWT with bcryptjs for password hashing
- **Styling**: Tailwind CSS with custom component system

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16.0 or higher)
- npm or yarn package manager
- MongoDB database (local or cloud instance)
- OpenAI API key

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd gideon-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
   # OpenAI API Key
   OPENAI_API_KEY=your_openai_api_key_here
   
   # MongoDB Connection String
   MONGODB_URI=your_mongodb_connection_string_here
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your_nextauth_secret_here
   
   # JWT Secret for custom auth
   JWT_SECRET=your_jwt_secret_here
   ```

   **Getting your API keys:**
   - **OpenAI API Key**: Visit [OpenAI Platform](https://platform.openai.com/api-keys) to create an API key
   - **MongoDB URI**: Use [MongoDB Atlas](https://www.mongodb.com/atlas) for a free cloud database, or set up a local MongoDB instance

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

## 🎯 Usage

### Getting Started
1. **Landing Page**: Visit the homepage to learn about Gideon AI's features
2. **Sign Up**: Create a new account or sign in with existing credentials
3. **Onboarding**: Set up your initial tasks and long-term goals
4. **Chat**: Start conversing with Gideon AI about your day

### Example Conversation
```
User: "Hey, so today I had class in the morning, then grabbed coffee with a guy named Justin — I should probably follow up with him about that project idea. I also remembered I need to do laundry, and my econ exam is next Thursday so I should start reviewing."

Gideon AI: "Sounds like a productive day! I've extracted a few tasks for you:
• Follow up with Justin about project idea
• Do laundry
• Start reviewing for econ exam (due next Thursday)

You seem energized about the project opportunity with Justin! Would you like me to remind you to follow up tomorrow?"
```

### Key Features
- **Task Management**: View, edit, complete, and delete tasks
- **Goal Tracking**: Monitor progress on long-term objectives
- **Priority System**: Organize tasks by priority (low, medium, high)
- **Due Dates**: Set and track task deadlines
- **Categories**: Organize tasks by type (work, personal, study, etc.)

## 🏗️ Project Structure

```
gideon-ai/
├── app/                          # Next.js 13+ App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── chat/                 # Chat processing
│   │   ├── tasks/                # Task CRUD operations
│   │   └── goals/                # Goal management
│   ├── auth/                     # Authentication pages
│   ├── dashboard/                # Main dashboard
│   ├── onboarding/               # User onboarding flow
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Landing page
├── components/                   # Reusable components
│   ├── ui/                       # Base UI components
│   ├── auth/                     # Authentication forms
│   └── dashboard/                # Dashboard components
├── lib/                          # Utility libraries
│   ├── mongodb.ts                # Database connection & models
│   ├── auth.ts                   # Authentication utilities
│   ├── openai.ts                 # OpenAI integration
│   └── utils.ts                  # General utilities
├── types/                        # TypeScript type definitions
└── README.md
```

## 🔐 Security Features

- **Password Hashing**: Uses bcryptjs with salt rounds for secure password storage
- **JWT Authentication**: Stateless authentication with configurable expiration
- **Input Validation**: Server-side validation for all API endpoints
- **Protected Routes**: Authentication required for dashboard and API access
- **Environment Variables**: Sensitive data stored in environment variables

## 🎨 UI/UX Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Clean Interface**: Modern, intuitive design focused on usability
- **Real-time Updates**: Instant feedback for user actions
- **Loading States**: Smooth loading indicators for better UX
- **Error Handling**: Graceful error handling with user-friendly messages

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Heroku**

Make sure to:
1. Set environment variables in your deployment platform
2. Configure your MongoDB connection for production
3. Update NEXTAUTH_URL to your production domain

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Adding New Features
1. Create API routes in `app/api/`
2. Add database models to `lib/mongodb.ts`
3. Build UI components in `components/`
4. Update TypeScript types in `types/index.ts`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Future Enhancements

- **Calendar Integration**: Sync with Google Calendar, Outlook
- **Mobile App**: React Native companion app
- **Team Collaboration**: Share goals and tasks with others
- **Analytics Dashboard**: Detailed productivity insights
- **Voice Input**: Speech-to-text for hands-free task entry
- **Smart Reminders**: AI-powered notification system
- **Habit Tracking**: Monitor daily habits and routines

## 📞 Support

If you encounter any issues or have questions:
1. Check the GitHub Issues page
2. Review the documentation
3. Create a new issue with detailed information

---

Built with ❤️ using Next.js, OpenAI, and modern web technologies. 