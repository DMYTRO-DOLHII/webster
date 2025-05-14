import { useRef, useEffect, useState } from 'react';
import { Image as KonvaImage } from 'react-konva';

const URLImage = ({ src, x, y }) => {
  const imageRef = useRef(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = "Anonymous";
    img.src = src;
    img.onload = () => setImage(img);
    imageRef.current = img;

    return () => {
      if (img) {
        img.onload = null;
      }
    };
  }, [src]);

  return <KonvaImage x={x} y={y} image={image} />;
};

export default URLImage;
