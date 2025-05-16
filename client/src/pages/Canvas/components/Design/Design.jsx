import { editorStore } from '../../../../store/editorStore';
import { userStore } from '../../../../store/userStore';
import { Stage, Layer, Circle, Rect, Line, Text } from 'react-konva';
import { useEffect, useState, useRef } from 'react';

const Design = ({ onSaveRef }) => {
    const stageRef = useRef(null);
    const [konvaJson, setKonvaJson] = useState(null);

    const COMPONENT_MAP = {
        Stage,
        Layer,
        Circle,
        Rect,
        Line,
        Text,
    };

    function renderNode(node, index, parentNode) {
        const Component = COMPONENT_MAP[node.className];
        if (!Component) return null;

        // Handle Circle click
        const handleClick = () => {
            if (node.className === 'Circle') {
                // Generate random color
                const randomColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
                node.attrs.fill = randomColor;

                // Force update
                setKonvaJson({ ...konvaJson }); // trigger re-render
                localStorage.setItem("designData", JSON.stringify(konvaJson));
            }
        };

        const children = node.children?.map((child, i) => renderNode(child, i, node));

        return (
            <Component
                key={index}
                {...node.attrs}
                onClick={node.className === 'Circle' ? handleClick : undefined}
            >
                {children}
            </Component>
        );
    }


    const getDesignJson = () => {
        if (stageRef.current) {
            return stageRef.current.toJSON();
        }
        return null;
    };

    useEffect(() => {
        const jsonString = localStorage.getItem("designData");

        const data = JSON.parse(jsonString);
        setKonvaJson(data);
    }, []);

    useEffect(() => {
        if (onSaveRef) {
            onSaveRef(getDesignJson); // allow parent to call save
        }
    }, [onSaveRef]);

    useEffect(() => {
        // Autosave on changes
        const interval = setInterval(() => {
            const json = getDesignJson();
            if (json) {
                localStorage.setItem("designData", json);
            }
        }, 1000); // every 1s

        return () => clearInterval(interval);
    }, []);

    if (!konvaJson) return <div>Loading...</div>;

    return (
        <Stage ref={stageRef} width={konvaJson.attrs.width} height={konvaJson.attrs.height}>
            {konvaJson.children.map((child, i) => renderNode(child, i))}
        </Stage>
    );
};


export default Design;