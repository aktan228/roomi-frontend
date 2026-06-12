import { useEffect, useState, useRef, useCallback } from "react";

const JOB_KEY = "roomi.pendingJob";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type JobStatus = "queued" | "analyzing" | "briefing" | "generating" | "done" | "error" | null;

export interface JobState {
  jobId: string | null;
  status: JobStatus;
  progress: number;
  label: string;
  result: Record<string, unknown> | null;
  error: string | null;
}

const EMPTY: JobState = { jobId: null, status: null, progress: 0, label: "", result: null, error: null };

export function storeJob(jobId: string) {
  localStorage.setItem(JOB_KEY, jobId);
}

export function clearJob() {
  localStorage.removeItem(JOB_KEY);
}

export function getStoredJobId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(JOB_KEY);
}

export function useDesignJob(): JobState & { clear: () => void } {
  const [state, setState] = useState<JobState>(EMPTY);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const poll = useCallback(async (jobId: string) => {
    try {
      const res = await fetch(`${BASE}/api/redesign/job/${jobId}`);
      if (!res.ok) { stop(); return; }
      const data = await res.json();
      setState({ jobId, status: data.status, progress: data.progress, label: data.label, result: data.result, error: data.error });
      if (data.status === "done" || data.status === "error") {
        stop();
        if (data.status === "done") {
          // keep job_id in state (caller will navigate), but remove from localStorage
          clearJob();
        }
      }
    } catch { /* network error — keep polling */ }
  }, [stop]);

  useEffect(() => {
    const jobId = getStoredJobId();
    if (!jobId) return;
    setState((s) => ({ ...s, jobId }));
    poll(jobId);
    intervalRef.current = setInterval(() => poll(jobId), 2000);
    return stop;
  }, [poll, stop]);

  const clear = useCallback(() => { stop(); clearJob(); setState(EMPTY); }, [stop]);

  return { ...state, clear };
}
