import { useEffect, useRef, useState, type TouchEvent } from "react";
import { useLocation, useNavigate } from "react-router";

// phones: several menu items share one slot that rolls to the next one every few seconds.
// Starts on the page you landed on (or a random one), holds while you're on one of them,
// swipe up/down on the slot for the next/previous item.
//
//   const flip = useFlipMenu(["/database", "/security"]);
//   flip.isShowing(href)  -> is this item the one in the slot right now
//   flip.className        -> "menu-flip menu-flip-up|down" (roll animation in menu.css)
//   flip.bind(href)       -> touch handlers to spread on the item
type Options = { interval?: number; media?: string };

const TAP = 12; // px: moved less than this = a tap
const SWIPE = 24; // px: vertical move needed to count as a swipe

export function useFlipMenu(
  hrefs: string[],
  { interval = 5000, media = "(max-width: 768px)" }: Options = {}
) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const count = hrefs.length;

  const [slot, setSlot] = useState(() => {
    const landed = hrefs.indexOf(pathname);
    return landed >= 0 ? landed : Math.floor(Math.random() * count);
  });
  const [dir, setDir] = useState<"up" | "down">("up");

  // page the user swiped on: lets them flip away from a held page; reset on navigation
  const [swipedOn, setSwipedOn] = useState<string | null>(null);
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setSwipedOn(null);
  }

  // on one of the flip pages? hold it so the active tab stays visible
  const held = hrefs.includes(pathname) && swipedOn !== pathname;
  const showing = held ? pathname : hrefs[slot];

  // restarts on every flip, so a manual swipe gets the full interval before the next roll
  useEffect(() => {
    if (held || count < 2) return;
    const id = setInterval(() => {
      if (document.hidden || !matchMedia(media).matches) return;
      setDir("up");
      setSlot((n) => (n + 1) % count);
    }, interval);
    return () => clearInterval(id);
  }, [held, slot, count, interval, media]);

  const touch = useRef<{ x: number; y: number } | null>(null);

  const onTouchEnd = (e: TouchEvent, href: string) => {
    const start = touch.current;
    touch.current = null;
    if (!start) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;

    // tap: navigate here instead of waiting for the synthetic click, which phones
    // drop when the slot flips under the finger (preventDefault skips that click)
    if (Math.abs(dx) < TAP && Math.abs(dy) < TAP) {
      e.preventDefault();
      navigate(href);
      return;
    }
    if (Math.abs(dy) < SWIPE || Math.abs(dy) < Math.abs(dx)) return; // sideways drag

    e.preventDefault(); // swallow the click so a swipe never navigates
    const step = dy < 0 ? 1 : -1;
    setDir(dy < 0 ? "up" : "down");
    setSlot((hrefs.indexOf(showing) + step + count) % count);
    setSwipedOn(pathname);
  };

  return {
    isShowing: (href: string) => href === showing,
    className: `menu-flip menu-flip-${dir}`,
    bind: (href: string) => ({
      onTouchStart: (e: TouchEvent) => {
        const t = e.touches[0];
        touch.current = { x: t.clientX, y: t.clientY };
      },
      onTouchCancel: () => {
        touch.current = null;
      },
      onTouchEnd: (e: TouchEvent) => onTouchEnd(e, href),
    }),
  };
}
