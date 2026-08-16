/**
 * Audio ambiental — SPEC-009 / D-021.
 * Autoplay Policy + WCAG 1.4.2: silencio hasta gesto; sin src hasta play.
 * Preferencia lb-ambient-audio no implica autoplay en carga nueva.
 */

const STORAGE_KEY = 'lb-ambient-audio';
const FADE_MS = 200;

type Pref = 'on' | 'off';

function getPref(): Pref {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'on' ? 'on' : 'off';
  } catch {
    return 'off';
  }
}

function setPref(value: Pref) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    /* private mode */
  }
}

function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function rampVolume(
  audio: HTMLAudioElement,
  from: number,
  to: number,
  ms: number,
): Promise<void> {
  if (prefersReducedMotion() || ms <= 0) {
    audio.volume = to;
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      audio.volume = from + (to - from) * t;
      if (t < 1) requestAnimationFrame(tick);
      else resolve();
    };
    requestAnimationFrame(tick);
  });
}

function initAmbientAudio(root: HTMLElement) {
  const audio = root.querySelector<HTMLAudioElement>('[data-ambient-audio-el]');
  const toggle = root.querySelector<HTMLButtonElement>('[data-ambient-audio-toggle]');
  const iconOn = root.querySelector<HTMLElement>('[data-icon-on]');
  const iconOff = root.querySelector<HTMLElement>('[data-icon-off]');
  const src = root.dataset.src;
  if (!audio || !toggle || !src) return;

  const targetVolume = Number(root.dataset.volume ?? '0.32') || 0.32;
  let sessionWantsPlay = false;
  let busy = false;

  const syncUi = (playing: boolean) => {
    toggle.setAttribute('aria-pressed', playing ? 'true' : 'false');
    toggle.setAttribute(
      'aria-label',
      playing ? 'Silenciar música ambiental' : 'Activar música ambiental',
    );
    iconOn?.classList.toggle('hidden', !playing);
    iconOff?.classList.toggle('hidden', playing);
  };

  const play = async () => {
    if (busy) return;
    busy = true;
    try {
      if (!audio.src) {
        audio.src = src;
      }
      audio.volume = 0;
      await audio.play();
      sessionWantsPlay = true;
      setPref('on');
      syncUi(true);
      await rampVolume(audio, 0, targetVolume, FADE_MS);
    } catch {
      sessionWantsPlay = false;
      setPref('off');
      syncUi(false);
      root.hidden = true;
    } finally {
      busy = false;
    }
  };

  const pause = async () => {
    if (busy) return;
    busy = true;
    try {
      sessionWantsPlay = false;
      setPref('off');
      await rampVolume(audio, audio.volume, 0, FADE_MS);
      audio.pause();
      syncUi(false);
    } finally {
      busy = false;
    }
  };

  toggle.addEventListener('click', () => {
    if (audio.paused) void play();
    else void pause();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (!audio.paused) audio.pause();
      return;
    }
    if (sessionWantsPlay && audio.paused) {
      void audio.play().then(() => {
        audio.volume = targetVolume;
        syncUi(true);
      });
    }
  });

  void getPref();
  syncUi(false);
}

const root = document.querySelector<HTMLElement>('[data-ambient-audio]');
if (root) initAmbientAudio(root);
