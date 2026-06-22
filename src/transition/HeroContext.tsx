import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {Image} from 'react-native';
import Reanimated, {
  Easing,
  runOnJS,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

export type Rect = {x: number; y: number; width: number; height: number};

const EMPTY_RECT: Rect = {x: 0, y: 0, width: 0, height: 0};

const ENTER_DURATION = 340;

interface HeroValue {
  /** Start a transition: snapshot the source element and the image to fly. */
  begin: (uri: string, source: Rect) => void;
  /** Provide the destination rect (from the target screen) and play the fly. */
  arrive: (target: Rect) => void;
  /** Reveal the destination element and tear the overlay down (also a safety net). */
  settle: () => void;
  /** Clear all transition state, e.g. when the destination screen unmounts. */
  reset: () => void;
  /**
   * Fly the avatar back from where it landed to the original source, reusing the
   * rects captured during begin()/arrive(). Returns false if there's nothing to
   * reverse (no entrance happened), so the caller can fall back to a plain close.
   */
  reverse: () => boolean;
  /** 0 while the hero is flying, 1 once it has landed. Drive the destination opacity with this. */
  settled: SharedValue<number>;
}

const HeroContext = createContext<HeroValue | null>(null);

export const useHero = (): HeroValue => {
  const ctx = useContext(HeroContext);
  if (!ctx) {
    throw new Error('useHero must be used within a HeroProvider');
  }
  return ctx;
};

export const HeroProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const source = useSharedValue<Rect>(EMPTY_RECT);
  const target = useSharedValue<Rect>(EMPTY_RECT);
  const progress = useSharedValue(0);
  // 1 = destination element fully visible (default so screens render normally
  // when no transition is in flight); 0 = hidden while the overlay flies.
  const settled = useSharedValue(1);

  const [uri, setUri] = useState<string | null>(null);
  const [active, setActive] = useState(false);
  // True while a reverse fly is animating, so unmount-time reset() doesn't tear
  // the overlay down before it lands.
  const reversingRef = useRef(false);

  const settle = useCallback(() => {
    // Reveal the destination element and unmount the overlay, but keep `uri` and
    // the captured rects around so reverse() can replay the flight on close.
    settled.value = 1;
    setActive(false);
  }, [settled]);

  const begin = useCallback(
    (nextUri: string, sourceRect: Rect) => {
      source.value = sourceRect;
      target.value = sourceRect; // hold at source until arrive() runs
      progress.value = 0;
      settled.value = 0;
      setUri(nextUri);
      setActive(true);
    },
    [source, target, progress, settled],
  );

  const arrive = useCallback(
    (targetRect: Rect) => {
      target.value = targetRect;
      progress.value = withTiming(
        1,
        {duration: ENTER_DURATION, easing: Easing.out(Easing.cubic)},
        finished => {
          if (finished) {
            runOnJS(settle)();
          }
        },
      );
    },
    [target, progress, settle],
  );

  const endReverse = useCallback(() => {
    reversingRef.current = false;
    progress.value = 0;
    settled.value = 1;
    setActive(false);
    setUri(null);
  }, [progress, settled]);

  const reverse = useCallback(() => {
    // Nothing was flown in (or the rects were never captured): let the caller
    // close the screen normally.
    if (!uri || !target.value.width) {
      return false;
    }
    reversingRef.current = true;
    settled.value = 0; // hide the destination element behind the overlay again
    setActive(true); // overlay mounts at progress === 1, i.e. the landed position
    progress.value = withTiming(
      0, // fly back to the source rect
      {duration: ENTER_DURATION, easing: Easing.in(Easing.cubic)},
      finished => {
        if (finished) {
          runOnJS(endReverse)();
        }
      },
    );
    return true;
  }, [uri, target, progress, settled, endReverse]);

  const reset = useCallback(() => {
    // Don't yank the overlay while a reverse fly is still playing; endReverse
    // will clean up once it lands.
    if (reversingRef.current) {
      return;
    }
    progress.value = 0;
    settled.value = 1;
    setActive(false);
    setUri(null);
  }, [progress, settled]);

  const overlayStyle = useAnimatedStyle(() => {
    const s = source.value;
    const t = target.value;
    const p = progress.value;
    return {
      left: s.x + (t.x - s.x) * p,
      top: s.y + (t.y - s.y) * p,
      width: s.width + (t.width - s.width) * p,
      height: s.height + (t.height - s.height) * p,
    };
  });

  const value = useMemo<HeroValue>(
    () => ({begin, arrive, settle, reset, reverse, settled}),
    [begin, arrive, settle, reset, reverse, settled],
  );

  return (
    <HeroContext.Provider value={value}>
      {children}
      {active && uri ? (
        <Reanimated.View
          pointerEvents="none"
          style={[{position: 'absolute'}, overlayStyle]}>
          <Image
            source={{uri}}
            resizeMode="contain"
            style={{width: '100%', height: '100%'}}
          />
        </Reanimated.View>
      ) : null}
    </HeroContext.Provider>
  );
};
