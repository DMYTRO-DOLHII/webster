import { useState, useRef, useEffect } from 'react'
import Button from '@mui/material/Button'
import Title from './components/Title'
import Pricing from './components/Pricing'
import { Link } from 'react-router-dom'

const DraggableEditable = ({ id, content, position, onUpdate, centered = false }) => {
    const ref = useRef(null)
    const [dragging, setDragging] = useState(false)
    const [offset, setOffset] = useState({ x: 0, y: 0 })
    const [wasDragged, setWasDragged] = useState(true)

    const handleMouseDown = (e) => {
        const rect = ref.current.getBoundingClientRect()
        setOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top })
        setDragging(true)
        if (!wasDragged) setWasDragged(true) // Disable transform on first drag
    }

    const handleMouseMove = (e) => {
        if (dragging) {
            onUpdate(id, {
                top: e.clientY - offset.y,
                left: e.clientX - offset.x,
            })
        }
    }

    const handleMouseUp = () => setDragging(false)

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove)
        document.addEventListener('mouseup', handleMouseUp)
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    })

    return (
        <div
            ref={ref}
            style={{
                position: 'absolute',
                top: position.top,
                left: position.left,
                transform: centered,
                cursor: 'move',
            }}
            onMouseDown={handleMouseDown}
            className="group p-1 border border-transparent hover:border-white/50"
        >
            <div
                contentEditable
                suppressContentEditableWarning
                className="outline-none"
                style={{ userSelect: 'text', cursor: 'text' }}
            >
                {content}
            </div>
        </div>
    )
}

const Main = () => {
    const [positions, setPositions] = useState({
        title: { top: '35%', left: '20%' },
        slogan: { top: '50%', left: '35%' },
    })

    const updatePosition = (id, pos) => {
        setPositions((prev) => ({ ...prev, [id]: pos }))
    }

    return (
        <div className="w-full h-full select-none">
            {/* Section 1: Hero Section */}
            <section className="w-full h-screen relative">
                {/* Blurred shapes */}
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        top: '-150px',
                        left: '-150px',
                        width: 400,
                        height: 400,
                        backgroundColor: '#6C3A72',
                        opacity: 0.28,
                        filter: 'blur(100px)',
                    }}
                />
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        top: '-150px',
                        right: '-150px',
                        width: 400,
                        height: 400,
                        backgroundColor: '#5A873A',
                        opacity: 0.28,
                        filter: 'blur(100px)',
                    }}
                />
                <div
                    className="absolute rounded-full pointer-events-none"
                    style={{
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 500,
                        height: 500,
                        backgroundColor: '#154261',
                        opacity: 0.28,
                        filter: 'blur(120px)',
                    }}
                />

                {/* Editable draggable elements */}
                <DraggableEditable
                    id="title"
                    content={<Title />}
                    position={positions.title}
                    onUpdate={updatePosition}
                    centered
                />

                <DraggableEditable
                    id="slogan"
                    content={
                        <p className="text-2xl text-white/70 text-center">
                            Create, move, and shine without design skills.
                        </p>
                    }
                    position={positions.slogan}
                    onUpdate={updatePosition}
                    centered
                />

                {/* Static buttons below slogan */}
                <div className="absolute left-1/2 top-[62%] transform -translate-x-1/2 flex gap-4">
                    <Link>
                        <Button variant="contained" color="primary" style={{ backgroundColor: '#B52478' }}>
                            Get Started
                        </Button>
                    </Link>
                </div>
            </section>
            
            <section className="w-full">
                <Pricing />
            </section>

            {/* Add more sections as needed */}
        </div>
    )
}

export default Main
