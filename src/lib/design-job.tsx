"use client";

import {
  createContext, useContext, useEffect, useState, useRef, useCallback,
} from "react";

const JOB_KEY = "roomi.pendingJob";
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type JobStatus =
  | "queued" | "analyzing" | "briefing" | "generating" | "done" | "error" | null;

interface JobState {
  jobId: string | null;
  status: JobStatus;
  progress: number;
  label: string;
  result: Record<string, unknown> | null;
  error: string | null;
  minimized: boolean;
  originalPreview: string | null;  // object URL of the uploaded photo (the "before")
}

interface JobContextValue extends JobState {
  active: boolean;                 // a job is running or finished but not dismissed
  startJob: (jobId: string, originalPreview?: string) => void;
  minimize: () => void;
  expand: () => void;
  dismiss: () => void;             // cancel / clear entirely
}

const EMPTY: JobState = {
  jobId: null, status: null, progress: 0, label: "",
  result: null, error: null, minimized: false, originalPreview: null,
};

const Ctx = createContext<JobContextValue | null>(null);

export function useDesignJob(): JobContextValue {
  const c = useContext(Ctx);
  if (!c) throw new Error("useDesignJob must be used inside <DesignJobProvider>");
  return c;
}

export function DesignJobProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<JobState>(EMPTY);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  const poll = useCallback(async (jobId: string) => {
    try {
      const res = await fetch(`${BASE}/api/redesign/job/${jobId}`);
      if (!res.ok) { stop(); return; }
      const d = await res.json();
      setState((s) => ({
        ...s, jobId, status: d.status, progress: d.progress,
        label: d.label, result: d.result, error: d.error,
      }));
      if (d.status === "done" || d.status === "error") {
        stop();
        localStorage.removeItem(JOB_KEY);
      }
    } catch { /* network hiccup — keep polling */ }
  }, [stop]);

  const begin = useCallback((jobId: string) => {
    stop();
    poll(jobId);
    intervalRef.current = setInterval(() => poll(jobId), 2000);
  }, [poll, stop]);

  // Resume an in-flight job after reload / navigation.
  // We don't setState here directly (React 19 disallows it in effect bodies) —
  // begin() kicks off polling and the first response populates the state.
  useEffect(() => {
    const jobId = typeof window !== "undefined" ? localStorage.getItem(JOB_KEY) : null;
    // begin() only schedules polling; the setState inside poll() runs after an
    // awaited fetch, so it's not a synchronous effect-body update.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (jobId) begin(jobId);
    return stop;
  }, [begin, stop]);

  const startJob = useCallback((jobId: string, originalPreview?: string) => {
    localStorage.setItem(JOB_KEY, jobId);
    setState({ ...EMPTY, jobId, status: "queued", label: "В очереди...", originalPreview: originalPreview ?? null });
    begin(jobId);
  }, [begin]);

  const minimize = useCallback(() => setState((s) => ({ ...s, minimized: true })), []);
  const expand   = useCallback(() => setState((s) => ({ ...s, minimized: false })), []);
  const dismiss  = useCallback(() => {
    stop();
    localStorage.removeItem(JOB_KEY);
    setState(EMPTY);
  }, [stop]);

  return (
    <Ctx.Provider value={{
      ...state, active: state.status !== null,
      startJob, minimize, expand, dismiss,
    }}>
      {children}
    </Ctx.Provider>
  );
}
