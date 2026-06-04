<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
<!-- BEGIN:nextjs-agent-rules -->
...
<!-- END:nextjs-agent-rules -->

# PromptBase AI Agent Instructions

## Project Context

PromptBase is an AI Prompt Management Platform for teams.

Users can:
- Register
- Login
- Create prompts
- Edit prompts
- Delete prompts
- Favorite prompts

Admins can:
- Manage users
- Manage categories
- Moderate prompts

## Tech Stack

- Next.js 16
- TypeScript
- TailwindCSS
- PostgreSQL (Neon)
- Drizzle ORM
- JWT Authentication

## Database Rules

- Always use Drizzle ORM
- Always use migrations
- Never write raw SQL when avoidable

## Authentication

- JWT based authentication
- Passwords hashed with bcrypt

## Architecture

Use:
- app/
- components/
- services/
- lib/
- db/
- hooks/
- types/

Business logic belongs in services.
Database access belongs in db.