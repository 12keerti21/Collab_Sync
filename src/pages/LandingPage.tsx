import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import {
  CheckCircle,
  Users,
  MessageSquare,
  BarChart3,
  Clock,
  Layout,
} from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="mx-auto flex min-h-screen flex-col">
      {/* Navigation */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xl font-bold text-primary-800">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
              <img src="/lg.png" alt="CollabSync Logo" className="h-6 w-6 object-contain" />
            </div>
            <span>CollabSync</span>
          </div>
          <nav className="hidden space-x-8 md:flex">
            <a href="#features" className="text-gray-600 hover:text-primary-600">Features</a>
            <a href="#how-it-works" className="text-gray-600 hover:text-primary-600">How It Works</a>

          </nav>
          <div className="flex items-center space-x-3">
            <Link to="/login">
              <Button variant="outline" size="sm">
                Log in
              </Button>
            </Link>
            <Link to="/signup">
              <Button size="sm">Sign up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-white">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="max-w-xl">
              <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                Streamline Your <span className="text-primary-600">Client Service</span> Management
              </h1>
                <p className="mb-8 text-xl text-gray-600">
                  CollabSync helps service providers manage client tasks, communication, and deadlines all in one place.
                </p>
                <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
                  <Link to="/signup">
                    <Button size="lg">Get Started</Button>
                  </Link>
                  <a href="#how-it-works">
                    <Button variant="outline" size="lg">
                      Learn More
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative rounded-lg bg-gray-100 shadow-xl">
                <img
                  src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                  alt="Team collaborating on tasks"
                  className="h-full w-full rounded-lg object-cover"
                />
              </div>
            </div>
          </div>
        </section>

      {/* Features Section */}
      <section id="features" className="bg-gray-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Powerful Features for Service Providers & Clients
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Everything you need to manage your client services efficiently.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-primary-100 text-primary-600">
                <CheckCircle size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Task Management</h3>
              <p className="text-gray-600">
                Create, assign, and track tasks with deadlines, priorities, and status updates.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-secondary-100 text-secondary-600">
                <Users size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Role-Based Access</h3>
              <p className="text-gray-600">
                Separate dashboards and permissions for service providers and clients.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-accent-100 text-accent-600">
                <MessageSquare size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Communication</h3>
              <p className="text-gray-600">
                Comment threads on tasks for clear, contextual communication.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-success-100 text-success-600">
                <BarChart3 size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Analytics</h3>
              <p className="text-gray-600">
                Track productivity, task completion rates, and client engagement.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-warning-100 text-warning-600">
                <Clock size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Deadline Tracking</h3>
              <p className="text-gray-600">
                Never miss a deadline with clear visual indicators and notifications.
              </p>
            </div>

            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm transition-all hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-md bg-error-100 text-error-600">
                <Layout size={24} />
              </div>
              <h3 className="mb-3 text-xl font-semibold">Customizable Dashboard</h3>
              <p className="text-gray-600">
                Personalized views for different roles and preferences.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-white py-20">
<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
  <div className="mb-16 text-center">
    <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
      How CollabSync Works
    </h2>
    <p className="mt-4 text-xl text-gray-600">
      A simple process for both service providers and clients.
    </p>
  </div>

  <div className="relative px-4 md:px-16">
    {/* Vertical center line */}
    <div className="absolute left-1/2 top-0 h-full w-1 -translate-x-1/2 bg-gray-200 hidden md:block"></div>

    <div className="space-y-16">
      {[
        {
          title: 'Service Provider Sign Up',
          description: 'Create an account as a service provider and set up your profile.',
        },
        {
          title: 'Invite Clients',
          description: 'Send invitations to your clients to join your workspace.',
        },
        {
          title: 'Create & Assign Tasks',
          description: 'Create tasks, set deadlines, and assign them to clients.',
        },
        {
          title: 'Clients Update Progress',
          description: 'Clients can view tasks, add comments, and update task status.',
        },
        {
          title: 'Track & Analyze',
          description: 'Monitor progress, generate reports, and analyze performance.',
        },
        {
          title: 'Improve Continuously',
          description: 'Use feedback and analytics to improve task efficiency.',
        },
      ].map((step, index) => {
        const isLeft = index % 2 === 0;
        return (
          <div key={index} className="relative flex flex-col md:flex-row items-center">
            {/* Left content */}
            <div className={`md:w-1/2 ${isLeft ? 'md:pr-8' : 'md:order-2 md:pl-8'}`}>
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md">
                <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>

            {/* Circle number */}
            <div className="z-10 flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-primary-600 text-white shadow-md md:absolute md:left-1/2 md:-translate-x-1/2">
              {index + 1}
            </div>

            {/* Spacer for vertical alignment */}
            <div className="hidden md:block md:w-1/2"></div>
          </div>
        );
      })}
    </div>
  </div>
</div>

      </section>

      {/* CTA Section */}
      <section className="bg-primary-800 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
            <div className="lg:w-2/3">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to streamline your client service workflow?
              </h2>
              <p className="mt-4 text-xl text-primary-100">
                Join thousands of service providers who've improved their client management with TaskFlow.
              </p>
            </div>
            <div>
              <Link to="/signup">

              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12 text-gray-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2 text-xl font-bold text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 13h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1zm0-10h16a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" fill="currentColor"/>
                  </svg>
                </div>
                <span>CollabSync</span>
              </div>
              <p className="mb-4">
                Streamline your client service management with our powerful platform.
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">Enterprise</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Community</a></li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold text-white">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 border-t border-gray-800 pt-8 text-sm">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <p>&copy; 2025 CollabSync. All rights reserved.</p>
              <div className="flex space-x-6">
                <a href="#" className="hover:text-white">Terms of Service</a>
                <a href="#" className="hover:text-white">Privacy Policy</a>
                <a href="#" className="hover:text-white">Cookies</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;