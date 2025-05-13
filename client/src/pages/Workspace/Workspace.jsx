import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Recents from "./components/Recents";
import Templates from "./components/Templates";
import Trash from "./components/Trash";

const Workspace = () => {
    const [activeTab, setActiveTab] = useState("recents");

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
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-4 relative overflow-clip">
                {/* Fade overlay from bottom to transparent top */}
                <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-transparent to-black" />

                {/* Blurred gradient shapes */}
                <div className="absolute bottom-0 left-[-150px] w-500 h-50 bg-gradient-to-r from-[#9B34BA] to-[#4ab021] blur-[150px] opacity-20 pointer-events-none z-0"></div>

                {/* Content */}
                <div className="relative z-20">
                    <h1 className="text-white text-sm font-normal mb-3 capitalize">
                        {activeTab}
                    </h1>
                    {renderContent()}
                </div>
            </main>

        </div>
    );
};

export default Workspace;
