import { atom, map } from "nanostores";
import demoConfig from "../config/demo-config.json";

export interface ModalState {
  isOpen: boolean;
  feature: string;
  message: string;
}

// Determine initial state
// 1. Check config (default true)
// 2. Check environment variable PUBLIC_DEMO_MODE (if present)
// 3. Check URL param ?demo=false (override) if on client
const getInitialDemoState = (): boolean => {
  let isEnabled = demoConfig.enabled;

  // Check environment variable
  if (import.meta.env.PUBLIC_DEMO_MODE === "false") {
    isEnabled = false;
  } else if (import.meta.env.PUBLIC_DEMO_MODE === "true") {
    isEnabled = true;
  }

  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const demoParam = params.get("demo");
    if (demoParam === "false") {
      isEnabled = false;
    } else if (demoParam === "true") {
      isEnabled = true;
    }
  }

  return isEnabled;
};

// Global demo mode state
export const isDemoMode = atom<boolean>(getInitialDemoState());

// Modal state
export const modalState = map<ModalState>({
  isOpen: false,
  feature: "",
  message: "",
});

// Actions
export function setDemoMode(enabled: boolean) {
  isDemoMode.set(enabled);
}

export function openDemoModal(feature: string, message: string) {
  modalState.set({
    isOpen: true,
    feature,
    message,
  });
}

export function closeDemoModal() {
  const current = modalState.get();
  modalState.set({
    ...current,
    isOpen: false,
  });
}
