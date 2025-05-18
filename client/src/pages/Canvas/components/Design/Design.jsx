import { editorStore } from '../../../../store/editorStore';
import { userStore } from '../../../../store/userStore';
import { Stage, Layer, Circle, Rect, Line, Text } from 'react-konva';
import { useEffect, useState, useRef, useMemo } from 'react';

const Design = ({ onSaveRef, zoom, containerSize }) => {
    const stageRef = useRef(null);
    const [konvaJson, setKonvaJson] = useState(null);
    const [fitZoom, setFitZoom] = useState(1);

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

        const children = node.children?.map((child, i) => renderNode(child, i, node));

        return (
            <Component
                key={index}
                {...node.attrs}
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

    const handleWheel = (e) => {
        e.evt.preventDefault();

        const stage = stageRef.current;
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
            x: (pointer.x - stage.x()) / oldScale,
            y: (pointer.y - stage.y()) / oldScale,
        };

        let direction = e.evt.deltaY > 0 ? 1 : -1;
        if (e.evt.ctrlKey) {
            direction = -direction;
        }

        const scaleBy = 1.05;
        const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
            x: pointer.x - mousePointTo.x * newScale,
            y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
    };

    // Load JSON from localStorage
    useEffect(() => {
        const jsonString = localStorage.getItem("designData");
        if (jsonString) {
            const data = JSON.parse(jsonString);
            setKonvaJson(data);
        }
    }, []);

    // Autosave
    useEffect(() => {
        const interval = setInterval(() => {
            const json = getDesignJson();
            if (json) {
                localStorage.setItem("designData", json);
            }
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // Expose save function
    useEffect(() => {
        if (onSaveRef) {
            onSaveRef(getDesignJson);
        }
    }, [onSaveRef]);

    // Calculate fit zoom
    useEffect(() => {
        if (!konvaJson || !konvaJson.attrs || !containerSize.width || !containerSize.height) return;

        const designWidth = konvaJson.attrs.width;
        const designHeight = konvaJson.attrs.height;

        const scaleX = containerSize.width / designWidth;
        const scaleY = containerSize.height / designHeight;

        const scale = Math.min(scaleX, scaleY, 1); // don’t scale up if design is smaller
        setFitZoom(scale);
    }, [konvaJson, containerSize]);

    if (!konvaJson) return <div>Loading...</div>;

    const finalZoom = zoom * fitZoom;
    const width = konvaJson.attrs.width;
    const height = konvaJson.attrs.height;

    return (
        <Stage
            ref={stageRef}
            width={width * finalZoom}
            height={height * finalZoom}
            scale={finalZoom}
            scaleX={finalZoom}
            scaleY={finalZoom}
            className="border-red-400 border-4"
            onWheel={handleWheel}
        >
            {konvaJson.children.map((child, i) => renderNode(child, i))}
        </Stage>
    );
};

export default Design;
