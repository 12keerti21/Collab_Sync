# CollabSync

CollabSync is a full-fledged client service management web application designed for service providers and clients. It streamlines task management, communication, and analytics to improve productivity and collaboration.

## Features

- **Role-Based Access:** Separate dashboards and permissions for service providers and clients.
- **Task Management:** Create, assign, and track tasks with deadlines, priorities, and status updates.
- **Client Assignment:** Service providers can assign tasks to clients dynamically.
- **Analytics Dashboard:** Visualize task status, priority distribution, completion rates, and recent activity.
- **Profile and Settings:** Manage user profiles and application settings.
- **Authentication:** Secure login, signup, and logout with Firebase Authentication.
- **Responsive UI:** Built with React, TypeScript, Tailwind CSS, and Chart.js for charts.
- **Seamless Navigation:** Logout redirects users to the landing page.

## Project Structure

- `src/pages/` - Contains page components like LandingPage, AnalyticsPage, TasksPage, ProfilePage, SettingsPage, etc.
- `src/components/` - Reusable UI components including tasks, analytics, auth forms, common UI elements like Header, Sidebar, Button, etc.
- `src/contexts/` - React context providers for authentication (`AuthContext`) and task management (`TaskContext`).
- `src/firebase.ts` - Firebase configuration and initialization.
- `public/lg.png` - Application logo used across the UI.

## Setup and Running

1. Clone the repository.
2. Install dependencies:
   ```
   npm install
   ```
3. Configure Firebase in `src/firebase.ts`.
4. Run the development server:
   ```
   npm run dev
   ```
5. Open the app in your browser at `http://localhost:5176`.

## Usage

- Service providers can sign up, create tasks, assign them to clients, and track progress.
- Clients can view assigned tasks, update status, and communicate via comments.
- Both roles have access to analytics and profile management.
- Logout redirects to the landing page.

## Technologies Used

- React with TypeScript
- Firebase Authentication, Firestore, and Analytics
- Tailwind CSS for styling
- Chart.js for data visualization
- React Router for navigation

## Testing

Thorough testing should cover:

- Authentication flows (login, signup, logout)
- Role-based task filtering and assignment
- Profile and settings updates
- Analytics data accuracy and display
- UI responsiveness and navigation

## License

This project is licensed under the MIT License.

---

For any questions or contributions, please contact the project maintainer.
