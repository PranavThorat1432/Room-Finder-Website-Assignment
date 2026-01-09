# Room Finder Website

A web application that allows users to find rental rooms and enables room owners to add and manage room listings.

## Live Demo
🔗 [Room-Finder-Website](https://room-finder-website-assignment-qcoo.vercel.app/)

## Features

### Authentication
- Email-based signup and login using Supabase Auth

### Room Finder (User)
- View available rooms
- Search rooms by location
- Filter rooms by:
  - Property type
  - Price range
  - Tenant preference

### Room Owner
- Add new room listings
- Upload room images
- Edit and delete own listings
- View all rooms added by the owner

## Tech Stack
- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Supabase
  - Authentication
  - PostgreSQL Database
  - Storage (image uploads)
- **Security**: Row Level Security (RLS) for database and storage
- **Deployment**: Vercel

## Environment Variables
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
