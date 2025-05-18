import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mx-auto my-auto w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;