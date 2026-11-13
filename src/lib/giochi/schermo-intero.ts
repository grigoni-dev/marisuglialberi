// Full-screen play on phones. The stage covers the whole screen with CSS (works on iPhone too);
// where the browser allows it (Android) the Fullscreen API also hides the browser bars.
let palco: HTMLElement | null = null;
let alUscire: (() => void) | null = null;

const touch = () => matchMedia('(pointer: coarse)').matches;

/** Called on the tap that starts a game. Does nothing with a mouse. */
export function entra(el: HTMLElement, quandoEsce: () => void) {
  if (!touch()) return;
  palco = el;
  alUscire = quandoEsce;
  el.classList.add('a-tutto-schermo');
  document.documentElement.classList.add('gioco-aperto');
  el.requestFullscreen?.({ navigationUI: 'hide' })?.catch(() => {});
}

/** Back to the page (end of the game): the stage returns in place. */
export function esci() {
  if (!palco) return;
  const el = palco;
  palco = null;
  alUscire = null;
  el.classList.remove('a-tutto-schermo');
  document.documentElement.classList.remove('gioco-aperto');
  if (document.fullscreenElement) document.exitFullscreen().catch(() => {});
  el.scrollIntoView({ block: 'start' });
}

/** The player leaves mid-game (close button, or the phone's back gesture). */
export function abbandona() {
  const f = alUscire;
  esci();
  f?.();
}

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement && palco) abbandona();
});
