export type VeroInstallPrompt = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: VeroInstallPrompt | null = null;

export function setInstallPrompt(prompt: VeroInstallPrompt | null) {
  deferredPrompt = prompt;
  if (typeof window !== "undefined") window.dispatchEvent(new Event("vero-install-prompt-change"));
}

export function getInstallPrompt() {
  return deferredPrompt;
}
