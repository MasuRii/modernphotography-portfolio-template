import { atom, map } from 'nanostores';

export interface ModalState {
  isOpen: boolean;
  feature: string;
  message: string;
}

// Global demo mode state (default true, can be toggled)
export const isDemoMode = atom<boolean>(true);

// Modal state
export const modalState = map<ModalState>({
  isOpen: false,
  feature: '',
  message: '',
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
