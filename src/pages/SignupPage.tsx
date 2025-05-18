import React from 'react';
import SignupForm from '../components/auth/SignupForm';

const SignupPage: React.FC = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="mx-auto my-auto w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <SignupForm />
      </div>
    </div>
  );
};

export default SignupPage;