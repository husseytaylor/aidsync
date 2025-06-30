# **App Name**: AidSync AI Platform

## Core Features:

- UI Replication: Faithfully replicate the interactive UI and overall experience of the Elementus showcase website in AidSync's branding, including scroll-triggered animations and layout structure.
- Header Implementation: Implement a sticky header with AidSync branding, including navigation links, call-to-action buttons, and a mobile hamburger menu that mirrors the functionality and style of the reference website.
- Calendly Integration: Embed the Calendly scheduling tool directly into the Hero or Contact section, ensuring immediate loading and seamless integration for scheduling discovery calls.
- AI Chat Assistant: Implement an 'AidSync AI Assistant' chat widget using an LLM tool. It appears as a floating button with dynamic color-switching. When clicked, the chat window mimics Apple's Messages in styling.
- Authentication Setup: Set up Supabase authentication pages for login, signup, and password reset under `/app/auth/`, handling user authentication via email and password with redirects and alert messages.
- Auth Callback Configuration: Configure an authentication callback page at `/auth/callback` to handle the exchange of code for session with Supabase, redirecting users to the analytics dashboard or login page based on success or failure.
- Analytics Dashboard: Create an analytics dashboard at `/dashboard/analytics` that fetches and displays key metrics using a webhook and presents them in summary cards and tables styled with Shadcn components, ensuring unauthorized users are redirected to login.

## Style Guidelines:

- Primary color: AidSync Green (#50FA7B), a vibrant green to represent growth and innovation.
- Background color: Cream (#F8F8F0), a soft, neutral color to provide a clean backdrop.
- Accent color: Mint (#94F9C6), a lighter, analogous shade of green to highlight interactive elements.
- Body font: 'Inter' (sans-serif) for its modern and neutral appearance, ideal for readability in both headlines and body text.
- Headline font: 'Poppins' (sans-serif) for a geometric and contemporary feel, used for headings to create visual interest.
- Lucide-React icons: A consistent style of minimalist icons to visually represent features and navigation elements.
- Section animations: Subtle fade-in or slide-in animations upon scrolling to enhance user engagement, inspired by the Elementus showcase website.