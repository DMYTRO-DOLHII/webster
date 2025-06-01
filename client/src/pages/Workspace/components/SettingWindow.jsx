import React, { useState, useEffect } from "react";
import { api } from '../../../services/api';
import { userStore } from '../../../store/userStore';
import { observer } from 'mobx-react-lite';

const SettingWindow = observer(({ onClose }) => {
    const [userData, setUserData] = useState({
        fullName: userStore.user?.fullName,
        login: userStore.user?.login,
        profilePicture: userStore.user?.profilePicture,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    // Keep local state in sync with userStore
    useEffect(() => {
        if (userStore.user) {
            setUserData({
                fullName: userStore.user.fullName,
                login: userStore.user.login,
                profilePicture: userStore.user.profilePicture,
            });
        }
    }, [userStore.user]);

    const handleClose = () => {
        setIsEditing(false);
        setError("");
        if (userStore.user) {
            setUserData({
                fullName: userStore.user.fullName,
                login: userStore.user.login,
                profilePicture: userStore.user.profilePicture,
            });
        }
        onClose();
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setError("Invalid file type. Only JPEG, PNG, GIF and WEBP are allowed.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            setError("File size too large. Maximum size is 5MB.");
            return;
        }

        try {
            setIsUploading(true);
            setError("");

            const formData = new FormData();
            formData.append('avatar', file);

            const response = await api.post(`/users/${userStore.user.id}/avatar`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedUser = {
                ...userStore.user,
                profilePicture: response.data.profilePicture
            };

            userStore.setUser(updatedUser);
            
            setUserData(prev => ({
                ...prev,
                profilePicture: response.data.profilePicture
            }));

        } catch (err) {
            setError("Failed to upload image");
            console.error('Image upload error:', err);
        } finally {
            setIsUploading(false);
        }
    };

    const handleSave = async () => {
        try {
            // Only send necessary fields
            const updateData = {
                fullName: userData.fullName,
                login: userData.login
            };

            const response = await api.patch(`/users/${userStore.user.id}`, updateData);
            
            // Update the store with the complete user data
            const updatedUser = {
                ...userStore.user,
                ...response.data
            };
            
            userStore.setUser(updatedUser);
            setIsEditing(false);
            setError("");
        } catch (err) {
            console.error('Update error:', err);
            setError("Failed to update profile");
        }
    };

    const handleDeleteAccount = async () => {
        if (!userStore.user?.id) return;
        
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await api.delete(`/users/${userStore.user.id}`);
                userStore.logout();
                onClose();
            } catch (err) {
                setError("Failed to delete account");
            }
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/40 backdrop-blur-sm">
            <div className="relative w-[500px] max-w-[95vw] rounded-xl p-6 bg-black/30 text-white shadow-xl border border-white/10 backdrop-blur-2xl">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold">Profile Settings</h2>
                    <button
                        className="text-white text-xl hover:text-gray-300"
                        onClick={handleClose}
                    >
                        ✕
                    </button>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-sm">
                        {error}
                    </div>
                )}

                {/* Profile Picture */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-700 flex items-center justify-center">
                            {userData.profilePicture ? (
                                <img 
                                    src={userData.profilePicture} 
                                    alt="Profile" 
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <span className="text-4xl font-bold">
                                    {userData.fullName?.charAt(0)}
                                </span>
                            )}
                            {isUploading && (
                                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                </div>
                            )}
                        </div>
                        <label className="absolute bottom-1 right-1 bg-white p-2 rounded-full cursor-pointer hover:bg-gray-200 transition-colors">
                            <input
                                type="file"
                                className="hidden"
                                accept="image/jpeg,image/png,image/gif,image/webp"
                                onChange={handleImageUpload}
                                disabled={!isEditing || isUploading}
                            />
                            <span className="text-black text-xs">✎</span>
                        </label>
                    </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Full Name</label>
                        <input
                            type="text"
                            name="fullName"
                            value={userData.fullName || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none disabled:opacity-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-gray-300 mb-1">Login Name</label>
                        <input
                            type="text"
                            name="login"
                            value={userData.login || ''}
                            onChange={handleInputChange}
                            disabled={!isEditing}
                            className="w-full p-2 rounded-md border border-white/20 bg-white/10 text-white focus:outline-none disabled:opacity-50"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-between items-center">
                    <button
                        onClick={handleDeleteAccount}
                        className="px-4 py-2 text-sm text-red-500 hover:text-white hover:bg-red-500 rounded-md border border-red-500 transition-colors"
                    >
                        Delete Account
                    </button>

                    <div className="flex gap-3">
                        {isEditing ? (
                            <>
                                <button
                                    onClick={handleClose}
                                    className="px-4 py-2 rounded-md border border-white/20 hover:bg-white/10"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700"
                                >
                                    Save
                                </button>
                            </>
                        ) : (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 rounded-md bg-purple-600 hover:bg-purple-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
});

export default SettingWindow;
