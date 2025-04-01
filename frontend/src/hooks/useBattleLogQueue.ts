import { useEffect, useRef, useState } from "react";
import { Species } from "../../../data/species";

interface UseBattleLogQueueOptions {
  battleState: any; // see your typed interface if desired
  parseLineForAnimations?: (line: string) => void;
  resetAnimations?: () => void;
  // Delay in ms between showing lines
  lineDelay?: number;
  // Delay in ms after showing a line to reset animations
  resetDelay?: number;
}

/**
 * This custom hook manages pending and displayed logs with a queue-based approach.
 *
 * - It compares the server's logs with previously processed logs to find new lines.
 * - Each new line is added to a "pendingLogs" array. We display them one by one, with a delay.
 * - parseLineForAnimations is called for each line to handle ephemeral effects like shaking.
 */
export function useBattleLogQueue({
  battleState,
  parseLineForAnimations,
  resetAnimations,
  lineDelay = 2000,
  resetDelay = 500,
}: UseBattleLogQueueOptions) {
  const [displayedLogs, setDisplayedLogs] = useState<string[]>([]);
  const [pendingLogs, setPendingLogs] = useState<string[]>([]);
  const [animating, setAnimating] = useState(false);

  const queueRef = useRef(false);

  // On new battleState, check for new logs
  useEffect(() => {
    if (!battleState || !battleState.battleLog) return;

    const serverLogs = battleState.battleLog as string[];
    if (!Array.isArray(serverLogs)) return;

    // Get all logs we've already processed
    const processedLogs = [...displayedLogs, ...pendingLogs];

    // Count occurrences in processed logs
    const processedCounts: Record<string, number> = {};
    for (const log of processedLogs) {
      processedCounts[log] = (processedCounts[log] || 0) + 1;
    }

    // Count occurrences in server logs
    const serverCounts: Record<string, number> = {};
    for (const log of serverLogs) {
      serverCounts[log] = (serverCounts[log] || 0) + 1;
    }

    // Figure out which logs are new by comparing counts
    const newLogs: string[] = [];
    for (const log of serverLogs) {
      const processedCount = processedCounts[log] || 0;
      const serverCount = serverCounts[log] || 0;
      if (processedCount < serverCount) {
        const countToAdd = serverCount - processedCount;
        for (let i = 0; i < countToAdd; i++) {
          newLogs.push(log);
        }
      }
    }

    if (newLogs.length > 0) {
      setPendingLogs((prev) => [...prev, ...newLogs]);
    }
  }, [battleState, displayedLogs, pendingLogs]);

  // Process the queue
  useEffect(() => {
    if (queueRef.current) return;

    const processNext = () => {
      if (pendingLogs.length === 0) {
        queueRef.current = false;
        return;
      }
      queueRef.current = true;
      setAnimating(true);

      const line = pendingLogs[0];
      const remainder = pendingLogs.slice(1);

      // If we have a parse function, do it
      if (parseLineForAnimations) {
        parseLineForAnimations(line);
      }

      // Show this line in lineDelay ms
      setTimeout(() => {
        setDisplayedLogs((dl) => [...dl, line]);
        setPendingLogs(remainder);
        setAnimating(false);

        // Optionally reset animations after a bit
        setTimeout(() => {
          if (resetAnimations) resetAnimations();
          queueRef.current = false;
          processNext();
        }, resetDelay);
      }, lineDelay);
    };

    if (!animating && pendingLogs.length > 0) {
      processNext();
    }
  }, [pendingLogs, animating, parseLineForAnimations, resetAnimations, lineDelay, resetDelay]);

  return {
    displayedLogs,
    pendingLogs,
  };
}