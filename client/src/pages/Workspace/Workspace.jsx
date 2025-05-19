import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Recents from "./components/Recents";
import Templates from "./components/Templates";
import Trash from "./components/Trash";
import SettingWindow from "./components/SettingWindow";
import ImageChat from "./components/ImageChat";
import { userStore } from "../../store/userStore";

const Workspace = () => {
    const [activeTab, setActiveTab] = useState("recents");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case "templates":
                console.log(userStore.user);
                return <Templates />;
            case "trash":
                return <Trash />;
            case "recents":
            default:
                return <Recents />;
        }
    };

    return (
        <div className="relative flex overflow-hidden h-screen">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <main className="relative flex-1 p-4 overflow-clip h-full">
                {/* Fade overlay from bottom to transparent top */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-transparent to-black animated-fade" />

                {/* Blurred gradient shapes */}
                <div className="absolute bottom-0 left-[-150px] w-500 h-50 bg-gradient-to-r from-[#9B34BA] to-[#4ab021] blur-[150px] opacity-20 pointer-events-none z-0 animated-circles"></div>

                <div className="relative z-20 h-full">
                    <h1 className="mb-3 text-sm font-normal text-white capitalize">
                        {activeTab}
                    </h1>
                    {renderContent()}
                </div>
            </main>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <SettingWindow onClose={() => setIsSettingsOpen(false)} />
            )}

            {/* Chat Button */}
            {/* Chat Button */}
            {!isChatOpen && (
                <button
                    className="fixed bottom-6 right-6 z-50 bg-purple-600 text-white px-4 py-2 rounded-full shadow-md hover:bg-purple-700 transition-all"
                    onClick={() => setIsChatOpen(true)}
                >
                    Chat 🎨
                </button>
            )}

            {/* Image Chat */}
            {isChatOpen && (
                <div className="fixed bottom-6 right-6 z-50">
                    <ImageChat onClose={() => setIsChatOpen(false)} />
                </div>
            )}
        </div>
    );
};

export default Workspace;
