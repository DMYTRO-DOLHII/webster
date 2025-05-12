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
        <div className="flex">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="flex-1 p-4 overflow-auto">
                <h1 className="text-white text-sm font-normal mb-3 capitalize">
                    {activeTab}
                </h1>
                {renderContent()}
            </main>
        </div>
    );
};

export default Workspace;
