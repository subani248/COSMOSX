import { useEffect, useState } from 'react';

function Star({ id, delay, duration, top, left, angle }) {
  return (
    <div
      key={id}
      className="absolute w-[2px] h-[2px] bg-white rounded-full"
      style={{
        top: `${top}%`,
        left: `${left}%`,
        animation: `shootingStar ${duration}s linear ${delay}s infinite`,
        transform: `rotate(${angle}deg)`,
        boxShadow: '0 0 6px 2px rgba(0, 212, 255, 0.6)',
      }}
    >
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 h-[1px]"
        style={{
          width: '80px',
          background: 'linear-gradient(to left, rgba(0,212,255,0.8), transparent)',
        }}
      />
    </div>
  );
}

export default function ShootingStars() {
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const s = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: Math.random() * 10,
      duration: Math.random() * 2 + 2,
      top: Math.random() * 60,
      left: Math.random() * 100 + 20,
      angle: Math.random() * 30 + 20,
    }));
    setStars(s);
  }, []);

  return (
    <div className="fixed inset-0 z-[1] pointer-events-none overflow-hidden">
      {stars.map((s) => (
        <Star key={s.id} {...s} />
      ))}
    </div>
  );
}
