import React, { useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Tabs, Tab, Box, Typography, Divider } from "@mui/material";
import Layers from "./Layers";
import Properties from "./Properties";
import History from "./History";

const RightSidebar = ({ layers, setShapes }) => {
    const [selectedLayerId, setSelectedLayerId] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <DndProvider backend={HTML5Backend}>
            <Box
                sx={{
                    pt: '48px',
                    width: '20rem',
                    bgcolor: '#1a1a1a',
                    borderLeft: '1px solid #2a2a2a',
                    color: 'white',
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Tabs
                    value={tabIndex}
                    onChange={(e, newValue) => setTabIndex(newValue)}
                    variant="fullWidth"
                    textColor="inherit"
                    indicatorColor="secondary"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'capitalize',
                        },
                    }}
                >
                    <Tab label="Layers & Properties" />
                    <Tab label="History" />
                </Tabs>

                <Divider sx={{ bgcolor: '#333' }} />

                <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    {tabIndex === 0 && (
                        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Box
                                sx={{
                                    height: '50%',
                                    overflowY: 'auto',
                                    borderBottom: '1px solid #333',
                                    padding: 1,
                                }}
                            >
                                <Layers
                                    layers={layers}
                                    setShapes={setShapes}
                                    setSelectedLayerId={setSelectedLayerId}
                                    selectedLayerId={selectedLayerId}
                                />
                            </Box>
                            <Box
                                sx={{
                                    height: '50%',
                                    overflowY: 'auto',
                                    padding: 1,
                                }}
                            >
                                <Properties
                                    selectedLayerId={selectedLayerId}
                                    layers={layers}
                                    setShapes={setShapes}
                                />
                            </Box>
                        </Box>
                    )}
                    {tabIndex === 1 && (
                        <Box sx={{ padding: 2, height: '100%', overflowY: 'auto' }}>
                            <History />
                        </Box>
                    )}
                </Box>
            </Box>
        </DndProvider>
    );
};

export default RightSidebar;
