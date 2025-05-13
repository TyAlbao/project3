import { useEffect } from "react";
import { useRef, useState } from "react";
import mouse from "../Assets/Mouse.png";

const Mouse = ({ speed }: { speed: number }) => {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const angleRef = useRef(0);
  const speedRef = useRef({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const angle = Math.random() * 2 * Math.PI;
    speedRef.current = { x: Math.cos(angle) * speed, y: Math.sin(angle) * speed };
    angleRef.current = angle;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setPos((prev) => {
        const newX = prev.x + speedRef.current.x;
        const newY = prev.y + speedRef.current.y;
        
        const scaledWidth = (imgRef.current?.width || 0) * 0.6;
        const scaledHeight = (imgRef.current?.height || 0) * 0.6;
        const maxX = window.innerWidth - scaledWidth;
        const maxY = window.innerHeight - scaledHeight;

        // Check for collisions with edges and bounce
        if (newX <= -scaledWidth * 0.6 || newX >= maxX) {
          speedRef.current.x *= -1;
          const randomIncrement = (Math.random() * 2 - 1) * 0.5;
          angleRef.current = Math.atan2(speedRef.current.y, speedRef.current.x) + randomIncrement;
          // Update speed vector based on new angle
          speedRef.current = {
            x: Math.cos(angleRef.current) * speed,
            y: Math.sin(angleRef.current) * speed
          };
        }
        if (newY <= -scaledHeight * 0.6 || newY >= maxY) {
          speedRef.current.y *= -1;
          const randomIncrement = (Math.random() * 2 - 1) * 0.5;
          angleRef.current = Math.atan2(speedRef.current.y, speedRef.current.x) + randomIncrement;
          // Update speed vector based on new angle
          speedRef.current = {
            x: Math.cos(angleRef.current) * speed,
            y: Math.sin(angleRef.current) * speed
          };
        }

        // Ensure position stays within bounds
        return {
          x: Math.max(-scaledWidth * 0.6, Math.min(newX, maxX)),
          y: Math.max(-scaledHeight * 0.6, Math.min(newY, maxY)),
        };
      });
    }, 1000 / 60);

    return () => clearInterval(interval);
  }, []);

  return (
    <img
      ref={imgRef}
      src={mouse}
      onError={(e) => (e.currentTarget.style.display = "none")}
      className="absolute -z-1 scale-[0.3]"
      style={{
        transform: `rotate(${angleRef.current + Math.PI / 2}rad)`,
        left: pos.x,
        top: pos.y,
      }}
    />
  );
};

export default Mouse;
