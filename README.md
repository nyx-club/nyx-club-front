# Modern landing page design

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/giancarmines-projects/v0-modern-landing-page-design)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/Zwr9rw6JTvN)

## Overview

This repository will stay in sync with your deployed chats on [v0.dev](https://v0.dev).
Any changes you make to your deployed app will be automatically pushed to this repository from [v0.dev](https://v0.dev).

## Deployment

Your project is live at:

**[https://vercel.com/giancarmines-projects/v0-modern-landing-page-design](https://vercel.com/giancarmines-projects/v0-modern-landing-page-design)**

## Build your app

Continue building your app on:

**[https://v0.dev/chat/projects/Zwr9rw6JTvN](https://v0.dev/chat/projects/Zwr9rw6JTvN)**

## How It Works

1. Create and modify your project using [v0.dev](https://v0.dev)
2. Deploy your chats from the v0 interface
3. Changes are automatically pushed to this repository
4. Vercel deploys the latest version from this repository

## Recurring Events

The events page now supports weekly recurring events using the `recurrenceType` and `recurrenceEndDate` fields returned by the API.

How it works:
1. Raw events are fetched from the backend (`/api/events?populate=*`).
2. Each event with `recurrenceType === 'weekly'` and a valid `recurrenceEndDate` is expanded client-side into weekly occurrences (inclusive of the end date) using `expandRecurringEvents` in `lib/utils.ts`.
3. Each generated occurrence keeps the original event data and adds:
	- `occurrenceDate` (Date of this specific instance)
	- `originalEventId` (the master event id)
	- `isOriginal` (true only for the first occurrence)
4. The calendar dots & daily filtering work transparently because each occurrence duplicates its date into the `date` field for compatibility.

Safety: A cap of 260 occurrences (~5 years) prevents infinite loops if data is malformed.

Extending: To add more recurrence types (e.g., monthly), extend `expandRecurringEvents` with a new branch and adjust the `RecurrenceType` union in `types/event.ts`.