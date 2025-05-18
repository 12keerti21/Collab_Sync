import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [message, setMessage] = useState('');

  const handleSave = async () => {
    setMessage('');
    try {
      // TODO: Implement settings save logic (e.g., update Firestore user settings)
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setMessage('Settings saved successfully.');
    } catch (error) {
      setMessage('Failed to save settings.');
    }
  };

  return (
    <div className="max-w-3xl p-6 mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <div className="space-y-4">
        <div>
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={() => setNotificationsEnabled(!notificationsEnabled)}
              className="form-checkbox h-5 w-5 text-primary-600"
            />
            <span>Enable Notifications</span>
          </label>
        </div>

        {/* Additional settings can be added here */}

        <div>
          <Button onClick={handleSave}>Save Settings</Button>
        </div>

        {message && <p className="text-sm text-green-600">{message}</p>}
      </div>
    </div>
  );
};

export default SettingsPage;
