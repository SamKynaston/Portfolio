import React, { useEffect, useRef, useState } from 'react';

const Canvas: React.FC<React.ComponentProps<'canvas'>> = (props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [drawing, setDrawing] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) return;

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;

            const context = canvas.getContext('2d');

            if (!context) return;

            context.scale(dpr, dpr);
        };

        const observer = new ResizeObserver(resizeCanvas);

        observer.observe(canvas);
        resizeCanvas();

        return () => observer.disconnect();
    }, []);

    const getPosition = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;

        if (!canvas) return { x: 0, y: 0 };

        const rect = canvas.getBoundingClientRect();

        return {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top,
        };
    }

    const onMouseDown = (event: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (!canvas || !context) return;

        const { x, y } = getPosition(event);

        context.beginPath();
        context.moveTo(x, y);

        setDrawing(true);
    };

    const onMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawing) return;

        const canvas = canvasRef.current;
        const context = canvas?.getContext('2d');

        if (!canvas || !context) return;

        const { x, y } = getPosition(event);

        context.lineWidth = 3;
        context.lineCap = 'round';
        context.lineJoin = 'round';

        context.lineTo(x, y);
        context.stroke();
    };

    const onMouseUp = () => {
        setDrawing(false);
    };

    return <canvas ref={canvasRef} {...props} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} />;
}

export default Canvas;