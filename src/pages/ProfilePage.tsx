import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [email] = useState(user?.email || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Placeholder for update profile function
  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');
    try {
      // TODO: Implement profile update logic (e.g., update Firestore user document)
      // For now, simulate save delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage('Profile updated successfully.');
    } catch (error) {
      setMessage('Failed to update profile.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email (read-only)</label>
          <Input type="email" value={email} readOnly />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Avatar URL</label>
          <Input
            type="text"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Avatar image URL"
          />
        </div>
        <div>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default ProfilePage;
