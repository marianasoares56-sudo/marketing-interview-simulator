# Behavioral Interview Simulator

## Project Overview
A web app built with Next.js and the Anthropic API that simulates behavioral interviews. The app generates personalized interview questions, accepts written or multiple-choice answers, and provides AI-powered feedback.

## Tech Stack
- **Framework:** Next.js (App Router)
- **AI:** Anthropic API (`claude-sonnet-4-20250514`)
- **Deployment:** Vercel
- **Styling:** Tailwind CSS

## Environment Variables
- `ANTHROPIC_API_KEY` — Anthropic API key, set in Vercel. Never hardcode it.

## Commands
- `npm run dev` — start local dev server
- `npm run build` — production build
- `npm run lint` — run ESLint

## App Structure
- `/app` — Next.js App Router pages
- `/app/api` — API routes that call the Anthropic API
- `/components` — reusable UI components
- `/lib` — helper functions and API wrappers

## Features
1. **Question Generation** — behavioral (STAR), open-ended case, and situational judgment questions
2. **Difficulty Levels** — Easy, Medium, Hard
3. **Job Description Mode** — paste a JD link or text to generate role-specific questions
4. **Answer Options** — free-form text box OR multiple-choice per question
5. **AI Feedback** — strengths + areas for improvement, STAR evaluation for behavioral questions
6. **Personalization** — all questions and feedback tailored to the user profile below

## User Profile (for Personalization)
This app is built for and used by:

- **Industry:** Consumer Goods / FMCG (Fast-Moving Consumer Goods)
- **Function:** Marketing
- **Experience:** 9 years in Marketing at PepsiCo
- **Seniority:** Senior / Manager level (based on tenure)
- **Background highlights:**
  - Deep experience in brand management, campaigns, and go-to-market strategy
  - Worked in a large multinational corporation with cross-functional teams
  - Familiar with data-driven marketing, agency management, and P&L ownership
  - Likely transitioning to a new marketing leadership role or adjacent function

## Personalization Instructions for Claude
When generating questions and feedback, always:
- Reference FMCG / CPG industry context (brands, shelf space, consumer insights, trade marketing, etc.)
- Calibrate difficulty and depth for a senior marketing professional (not entry-level)
- For behavioral questions, expect answers that reflect large-scale campaigns, cross-functional leadership, and corporate environments (PepsiCo scale)
- For feedback, point out whether the answer reflects strategic thinking, not just execution
- When a job description is provided, map it against a marketing background (e.g., how brand management skills transfer to growth marketing or product marketing roles)
- Suggested STAR examples should feel realistic for someone who ran marketing at PepsiCo (e.g., launching a product line, managing a $XM budget, leading an agency team)

## API Usage Conventions
- All Anthropic API calls go through `/app/api` routes (never call from client)
- Use `claude-sonnet-4-20250514` model
- Always stream responses where possible for better UX
- Keep system prompts in `/lib/prompts.ts` for easy editing

## UI/UX Guidelines
- Clean, modern, professional look (not playful — this is a career tool)
- Landing page → question setup → question + answer → feedback view
- Mobile responsive
- Loading states for all AI calls
