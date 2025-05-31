import React, { useState } from "react";
import { Tabs, Tab, Box, Divider } from "@mui/material";
import Layers from "./Layers";
import Properties from "./Properties";
import History from "./History";

const RightSidebar = ({ layers, setShapes }) => {
    const [selectedLayerId, setSelectedLayerId] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    return (
        <Box
            sx={{
                pb: '90px',
                width: '20rem',
                bgcolor: '#1a1a1a',
                borderLeft: '1px solid #2a2a2a',
                color: 'white',
                height: '100vh',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                zIndex: '8'
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
    );
};

export default RightSidebar;
