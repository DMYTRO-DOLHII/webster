import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Recents from "./components/Recents";
import Templates from "./components/Templates";
import Trash from "./components/Trash";
import SettingWindow from "./components/SettingWindow";

const Workspace = () => {
    const [activeTab, setActiveTab] = useState("recents");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const renderContent = () => {
        switch (activeTab) {
            case "templates":
                return <Templates />;
            case "trash":
                return <Trash />;
            case "recents":
            default:
                return <Recents />;
        }
    };

    return (
        <div className="flex overflow-hidden relative">
            <Sidebar
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onOpenSettings={() => setIsSettingsOpen(true)}
            />
            <main className="flex-1 p-4 relative overflow-clip">
                <div className="absolute bottom-0 left-[-150px] w-500 h-50 bg-gradient-to-r from-[#9B34BA] to-[#4ab021] blur-[150px] opacity-20 pointer-events-none z-0 animate-shape"></div>

                <div className="relative z-20">
                    <h1 className="text-white text-sm font-normal mb-3 capitalize">
                        {activeTab}
                    </h1>
                    {renderContent()}
                </div>
            </main>

            {/* Settings Modal */}
            {isSettingsOpen && (
                <SettingWindow onClose={() => setIsSettingsOpen(false)} />
            )}
        </div>
    );
};

export default Workspace;
