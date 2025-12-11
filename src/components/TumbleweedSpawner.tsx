import { useEffect, useState, useRef, useCallback } from "react";

interface TumbleweedInstance {
  id: number;
  top: number;
}

// 🌿 A tumbleweed that randomly rolls across the screen
const RollingTumbleweed = ({ top }: { top: number }) => (
  <div
    className="fixed pointer-events-none z-50 animate-tumbleweed"
    style={{
      top: `${top}%`,
    }}
  >
    <img
      src="/desert-tumbleweed-landscape-on-transparent-background-png.png"
      alt="Tumbleweed"
      className="animate-spin-slow w-60 h-60 object-contain"
    />
  </div>
);

// 🌿 TumbleweedSpawner - Spawns tumbleweeds that roll across the range
export const TumbleweedSpawner = () => {
  const [activeTumbleweeds, setActiveTumbleweeds] = useState<
    TumbleweedInstance[]
  >([]);
  const [tumbleweedCount, setTumbleweedCount] = useState(1);
  const tumbleweedIdCounter = useRef(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleTumbleweed = useCallback(() => {
    const randomDelay = Math.random() * 60000 + 30000; // 30-90 seconds
    timeoutRef.current = setTimeout(() => {
      // Spawn multiple tumbleweeds based on current count
      const newTumbleweeds: TumbleweedInstance[] = [];
      for (let i = 0; i < tumbleweedCount; i++) {
        tumbleweedIdCounter.current++;
        newTumbleweeds.push({
          id: tumbleweedIdCounter.current,
          top: Math.random() * 60 + 20, // 20-80% from top
        });
      }

      setActiveTumbleweeds((prev) => [...prev, ...newTumbleweeds]);

      // Remove tumbleweeds after animation completes (5 seconds)
      setTimeout(() => {
        setActiveTumbleweeds((prev) =>
          prev.filter((t) => !newTumbleweeds.find((nt) => nt.id === t.id))
        );
        // Increase count for next time (max 10 tumbleweeds)
        setTumbleweedCount((prev) => Math.min(prev + 1, 10));
      }, 5000);
    }, randomDelay);
  }, [tumbleweedCount]);

  useEffect(() => {
    scheduleTumbleweed();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [scheduleTumbleweed]);

  // Re-schedule when count changes (after tumbleweeds are removed)
  useEffect(() => {
    if (activeTumbleweeds.length === 0 && tumbleweedCount > 1) {
      scheduleTumbleweed();
    }
  }, [activeTumbleweeds.length, tumbleweedCount, scheduleTumbleweed]);

  return (
    <>
      {activeTumbleweeds.map((tumbleweed) => (
        <RollingTumbleweed key={tumbleweed.id} top={tumbleweed.top} />
      ))}
    </>
  );
};

export default TumbleweedSpawner;
