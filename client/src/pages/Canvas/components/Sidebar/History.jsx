import React from 'react';
import { observer } from 'mobx-react-lite';
import { editorStore } from '../../../../store/editorStore';

const History = observer(() => {
    const handleHistoryClick = (index) => {
        const history = editorStore.projectHistory;
        if (!history.length) return;

        // Get the state we want to go to
        const targetState = history[index];

        // Load the target state
        localStorage.setItem('designData', JSON.stringify(targetState));
        editorStore.setProjectJSON(targetState);

        // Set current active index but keep all history
        editorStore.setCurrentHistoryIndex(index);
    };

    const currentIndex = editorStore.currentHistoryIndex ?? editorStore.projectHistory.length - 1;

    return (
        <div>
            <h2 className="text-sm font-semibold mb-2 border-b border-[#333] pb-1">History</h2>
            {editorStore.projectHistory && editorStore.projectHistory.length > 0 ? (
                <div className="flex flex-col gap-1">
                    {editorStore.projectHistory.map((historyItem, index) => (
                        <div
                            key={index}
                            className={`flex justify-between items-center text-xs px-2 py-2 rounded cursor-pointer 
                                ${index === currentIndex
                                    ? 'bg-blue-600'
                                    : index > currentIndex
                                        ? 'opacity-30 hover:bg-[#2a2a2a]'
                                        : 'opacity-70 hover:bg-[#2a2a2a]'}`}
                            onClick={() => handleHistoryClick(index)}
                        >
                            <span className="truncate">
                                Action {index + 1}
                            </span>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-xs opacity-70">No history available</div>
            )}
        </div>
    );
});

export default History;