import { useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle } from 'react-konva';
import { editorStore } from '../../../../store/editorStore';
import { userStore } from '../../../../store/userStore';

const Design = ({ onSaveRef }) => {
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

    if (!editorStore.project) {
		return <div className='text-white'>No project.</div>;
	}

    return (
        <Stage
            width={editorStore.project.width}
            height={editorStore.project.height}
            ref={stageRef}
        >
            <Layer>
            </Layer>
        </Stage>
    );
};

export default Design;
