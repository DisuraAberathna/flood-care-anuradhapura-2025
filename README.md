# Flood Care Anuradhapura 2025

A Next.js application to store and manage data of isolated people from floods. This application allows you to record names, ages, number of family members, addresses, and house states.

## Features

- ✅ **Public Data Entry** - Main page for adding new person records
- ✅ **Admin Authentication** - Secure login system for administrators
- ✅ **Admin Dashboard** - View all registered people in a table
- ✅ **Advanced Filtering** - Filter by name, address, or house state
- ✅ **Sorting** - Sort by name, age, members, house state, or date
- ✅ **Edit Records** - Update existing person information
- ✅ **Delete Records** - Remove person records
- ✅ **Eye-friendly light theme UI** - Modern and clean interface
- ✅ **Responsive design** - Works on desktop and mobile devices

## Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **MySQL** - Database
- **mysql2** - MySQL client for Node.js

## Prerequisites

- Node.js 18+ installed
- MySQL server running
- npm or yarn package manager

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Create a `.env.local` file in the root directory
   - Add your MySQL credentials and admin credentials:
     ```
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_password
     DB_NAME=flood_data
     ADMIN_USERNAME=admin
     ADMIN_PASSWORD=admin123
     ```

3. **Create database:**
   - Connect to your MySQL server
   - Create the database:
     ```sql
     CREATE DATABASE flood_data;
     ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Navigate to `http://localhost:3000`
   - The database table will be created automatically on first use

## Database Schema

The application uses a table called `isolated_people` with the following structure:

- `id` - Auto-increment primary key
- `name` - Person's full name
- `age` - Person's age
- `number_of_members` - Number of family members
- `address` - Full address
- `house_state` - State of the house (Safe, Partially Damaged, Severely Damaged, Destroyed)
- `created_at` - Timestamp of record creation
- `updated_at` - Timestamp of last update

## Usage

### Public Data Entry (Main Page)

1. **Add a new person:**
   - Navigate to the home page (`http://localhost:3000`)
   - Fill in all required fields (name, age, number of members, address, house state)
   - Click "Add Person"
   - A success message will appear when the record is added

### Admin Dashboard

1. **Login as admin:**
   - Click "Admin Login" on the home page or navigate to `/admin/login`
   - Enter admin credentials (default: username: `admin`, password: `admin123`)
   - You'll be redirected to the admin dashboard

2. **View and manage records:**
   - View all registered people in a sortable table
   - Use the search box to filter by name, address, or house state
   - Filter by house state using the dropdown
   - Sort by clicking on column headers (Name, Age, Members, House State, Date Added)
   - Click "Clear Filters" to reset all filters and sorting

3. **Edit a person:**
   - Click the "Edit" button next to any record
   - Modify the information in the form
   - Click "Update" to save changes

4. **Delete a person:**
   - Click the "Delete" button next to any record
   - Confirm the deletion in the popup

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── login/route.ts    # Admin login endpoint
│   │   │   ├── logout/route.ts   # Admin logout endpoint
│   │   │   └── check/route.ts     # Authentication check endpoint
│   │   └── people/
│   │       ├── route.ts          # GET and POST endpoints
│   │       └── [id]/
│   │           └── route.ts      # GET, PUT, DELETE endpoints
│   ├── admin/
│   │   ├── login/page.tsx        # Admin login page
│   │   └── dashboard/page.tsx    # Admin dashboard
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page (data entry)
├── components/
│   ├── PersonForm.tsx            # Form component
│   ├── PersonList.tsx            # List/Table component (public)
│   └── AdminPersonList.tsx       # Admin list with filters and sorting
├── lib/
│   ├── db.ts                     # Database connection
│   └── auth.ts                   # Authentication utilities
└── package.json
```

## Environment Variables

Create a `.env.local` file with:

```
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=flood_data

# Admin Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

**Note:** Change the admin credentials in production for security!

## Building for Production

```bash
npm run build
npm start
```

## License

MIT

