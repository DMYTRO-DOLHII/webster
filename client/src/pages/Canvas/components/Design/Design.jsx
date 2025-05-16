import { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import Konva from 'konva';

const Design = ({ onSaveRef }) => {
    const stageRef = useRef(null);
    const [isStageReady, setIsStageReady] = useState(false);

    // Save JSON function
    useEffect(() => {
        if (onSaveRef) {
            onSaveRef(() => {
                if (stageRef.current) {
                    return stageRef.current.toJSON();
                }
                return null;
            });
        }
    }, [onSaveRef]);

    // Wait for stage to be ready
    useEffect(() => {
        if (!isStageReady || !stageRef.current) return;

        const savedJson = localStorage.getItem("designData");

        if (savedJson) {
            try {
                const node = Konva.Node.create(savedJson); // ← removed 2nd arg
                stageRef.current.destroyChildren();

                // If top node is a Stage, add its children
                if (node.getClassName() === "Stage") {
                    const children = node.getChildren();
                    children.forEach(child => stageRef.current.add(child));
                } else {
                    // Otherwise just add the node
                    stageRef.current.add(node);
                }

                stageRef.current.draw();
            } catch (err) {
                console.error("Error loading saved design:", err);
            }
        }

        const json = stageRef.current.toJSON();
        localStorage.setItem("designData", json);
    }, [isStageReady]);


    return (
        <Stage
            width={500}
            height={500}
            ref={(node) => {
                stageRef.current = node;
                if (node) setIsStageReady(true);
            }}
        >
            <Layer>
                <Rect x={0} y={0} width={500} height={500} fill="white" listening={false} />
                <Circle x={250} y={250} radius={100} fill="red" />
            </Layer>
        </Stage>
    );
};

export default Design;
