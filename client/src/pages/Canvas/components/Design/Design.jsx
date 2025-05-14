import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import URLImage from './URLImage'; // ⚠️ Make sure you default-export URLImage

const Design = ({ onSaveRef, imageUrl }) => {
    const stageRef = useRef(null);

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

    return (
        <Stage width={500} height={500} ref={stageRef}>
            <Layer>
                <Rect x={0} y={0} width={500} height={500} fill="white" listening={false} />
                <Circle x={250} y={250} radius={100} fill="red" />
                {/* ✅ Render uploaded image if exists */}
                {imageUrl && <URLImage src={imageUrl} x={100} y={100} />}
            </Layer>
        </Stage>
    );
};

export default Design;
