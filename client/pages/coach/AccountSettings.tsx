import { CoachLayout } from "@/components/CoachLayout";
import { Settings, User, Bell, Lock } from "lucide-react";

export default function CoachAccountSettings() {
  return (
    <CoachLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
          <p className="text-gray-400">Manage your profile and preferences</p>
        </div>

        {/* Settings Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Settings */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-500/20 rounded-lg">
                <User className="w-6 h-6 text-blue-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Update your personal information and coaching profile details
            </p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">
              Edit Profile
            </button>
          </div>

          {/* Notifications */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-purple-500/20 rounded-lg">
                <Bell className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Notifications</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Control how you receive notifications and alerts
            </p>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors">
              Manage Notifications
            </button>
          </div>

          {/* Password & Security */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-red-500/20 rounded-lg">
                <Lock className="w-6 h-6 text-red-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Security</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Change your password and manage security settings
            </p>
            <button className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
              Update Security
            </button>
          </div>

          {/* Preferences */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-green-500/20 rounded-lg">
                <Settings className="w-6 h-6 text-green-400" />
              </div>
              <h2 className="text-xl font-semibold text-white">Preferences</h2>
            </div>
            <p className="text-gray-400 mb-4">
              Customize your app preferences and display settings
            </p>
            <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors">
              Manage Preferences
            </button>
          </div>
        </div>
      </div>
    </CoachLayout>
  );
}
