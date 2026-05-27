# React Native Upgrade Plan

**From:** React Native 0.64.1 (April 2021) + React 17
**To:** React Native 0.85.3 + React 19 (current `latest` on npm as of May 2026)
**Project size:** ~1,500 LOC across ~20 files
**Realistic effort:** 1–2 focused days end-to-end

---

## 1. Why upgrade

Current toolchain (Xcode 26.2, clang 17, Apple Silicon) is incompatible with RN 0.64 native modules (Yoga, Folly, Hermes, boost). Patching individual files works for one error at a time but compounds: every `yarn install` wipes patches unless wrapped in `patch-package`, and several breakages in this combo are hard to patch at all. Upgrading removes the root cause.

---

## 2. Target versions

| Package | Current | Target | Notes |
|---|---|---|---|
| react-native | 0.64.1 | **0.76.x** | New arch enabled by default; well-documented migration path |
| react | 17.0.1 | 18.3.x | RN 0.76 requires React 18 |
| typescript | 3.8 | 5.x | Required by modern @types/react-native |
| @react-navigation/native | 5.9 | 7.x | Two majors of breaking changes |
| @react-navigation/stack | 5.14 | 7.x | Stack API moved |
| react-native-reanimated | 2.3 | 3.x | Babel plugin renamed; worklet rules tightened |
| react-native-screens | 3.4 | 4.x | New arch compatible |
| react-native-gesture-handler | 2.1 | 2.x latest | API stable since 2.0 |
| react-native-safe-area-context | 3.2 | 4.x | New arch compatible |
| @gorhom/bottom-sheet | 4 | 5 | Reanimated 3 hard requirement |
| react-native-pager-view | 5.4 | 6.x | New arch compatible |
| react-native-tab-view | 3.0 | 4.x | Now decoupled from pager-view |
| react-native-vector-icons | 7.1 | 10.x | API stable |
| react-native-progress | 4.1 | 5.x | Minor breaking |
| react-native-fast-image | 8.5 | (decision) | Original repo stale; see §4 |
| axios | 0.21 | 1.x | Multiple CVEs in 0.21 |

> **Note:** Before starting, run `npx react-native@latest --version` to confirm 0.76 is still the right "known-good" target — if 0.77/0.78 are stable by the time you start, adjust. Check [rnu.dev](https://reactnative.directory) for library health.

---

## 3. Hard blockers to resolve before upgrade

These items in the current `package.json` will not survive the upgrade as-is — decide upfront:

### 🚫 `react-navigation-shared-element` + `react-native-shared-element`
- **Status:** unmaintained (last meaningful release 2022; no React Navigation 7 support).
- **Used by:** `src/navigation/index.tsx` and the Pokémon list → detail transition.
- **Replacement:** Reanimated 3's built-in `sharedTransitionTag` API. This is the modern, native-arch-compatible way and lives in libraries you already need to keep. The migration is mostly: remove `<SharedElement id="x">` wrappers, add `sharedTransitionTag="x"` to the wrapped `<Animated.View>` instead, and replace `createSharedElementStackNavigator` with the plain `createNativeStackNavigator`.
- **Fallback if Reanimated 3 transitions don't feel right:** drop shared-element transitions; the project still works as a normal stack.

### 🚫 `reanimated-bottom-sheet` (alpha)
- **Status:** deprecated by the author years ago.
- **Used by:** verify with `grep -r reanimated-bottom-sheet src` — if there are leftover imports, replace them with `@gorhom/bottom-sheet`. The package is already in `dependencies`.
- **Action:** remove `reanimated-bottom-sheet` from `package.json` entirely.

### ⚠️ `react-native-fast-image`
- **Status:** original repo stale since 2023. Several maintained forks exist (`@d11/react-native-fast-image`, etc.).
- **Used by:** `src/components/Image.tsx`.
- **Three options, pick one:**
  1. **Switch to a maintained fork** (lowest risk, same API).
  2. **Replace with `expo-image`** (best long-term — works in bare RN too, supports new arch natively).
  3. **Replace with stock `<Image>`** — fine for a Pokédex; you don't need streaming/caching for static asset URLs.

Decision before starting: **option 2 (expo-image)** unless a fork has clearly taken over by then.

---

## 4. Phased execution

### Phase 0 — Pre-flight (30 min)
- [ ] Create branch: `git checkout -b chore/rn-upgrade`
- [ ] Commit any pending work (currently there are uncommitted `ios/` changes and a deleted `teste.js`)
- [ ] Confirm Node version: install **Node 20 LTS** via `nvm install 20 && nvm use 20`
- [ ] Confirm Ruby version: RN 0.76 uses CocoaPods via `bundle`. Install **Ruby 3.2+** (rbenv recommended)
- [ ] Verify Xcode command-line tools: `xcode-select -p`
- [ ] Verify Android SDK + JDK 17 if you plan to build Android

### Phase 1 — Resolve blockers in the *current* codebase (2–4 hrs)
Goal: get the project to a state where it still builds on RN 0.64 but no longer depends on dead libraries. Doing this **before** the version bump shrinks the surface of the actual upgrade.

- [ ] Remove `reanimated-bottom-sheet` from `package.json`; confirm no imports
- [ ] Rewrite shared-element transitions using Reanimated 2 + Layout Animations (preview of the v3 API). Or, if simpler: temporarily drop shared transitions, restore them in Phase 4
- [ ] Replace `react-native-fast-image` per the §3 decision
- [ ] Commit. Project should still run on RN 0.64.

### Phase 2 — RN core upgrade (3–5 hrs)
- [ ] Use the official upgrade helper: visit [react-native-community/upgrade-helper](https://react-native-community.github.io/upgrade-helper/) and diff `0.64.1` → `0.76.x`. The tool shows every file diff needed in `ios/`, `android/`, `Gemfile`, `metro.config.js`, `babel.config.js`, etc.
- [ ] **Recommended shortcut:** generate a fresh RN 0.76 project alongside (`npx @react-native-community/cli@latest init pokedexNext --version 0.76.0`) and **copy the native shells** (`ios/`, `android/`, `Gemfile`, top-level config files) into this repo, then re-add app-specific tweaks. Faster and less error-prone than diffing.
- [ ] Update `package.json` dependencies in one pass (see table in §2)
- [ ] Update `babel.config.js`: `react-native-reanimated/plugin` → `react-native-worklets/plugin` (RN 0.76 / Reanimated 3.16+)
- [ ] Delete `node_modules`, `yarn.lock`, `ios/Pods`, `ios/Podfile.lock`. Reinstall: `yarn && cd ios && bundle install && bundle exec pod install`
- [ ] Commit native-shell regeneration as a single commit

### Phase 3 — Code migration (3–6 hrs)
Per-file work. Probable touchpoints:

- **`src/navigation/index.tsx`**
  - `createSharedElementStackNavigator` → `createNativeStackNavigator` from `@react-navigation/native-stack`
  - Drop `react-navigation-shared-element` imports
  - `@react-navigation/stack` v5 → `@react-navigation/native-stack` v7 (note the package change — native-stack is preferred on new arch)

- **`src/pages/**` and `src/components/**`**
  - `<SharedElement id="x">` → add `sharedTransitionTag="x"` to the underlying `<Animated.View>`
  - Verify `useNavigation` / `useRoute` typings still work (React Navigation 7 has better TS support)

- **Reanimated 2 → 3**
  - `useSharedValue`, `useAnimatedStyle`, `interpolate` API unchanged
  - The Babel plugin name changed (see Phase 2)
  - Strict mode is on by default — `'worklet'` directives are still optional but recommended in inline workers

- **Animated (legacy) usage**
  - The legacy `Animated.timing` / `Animated.Value` calls in `home/` still work in RN 0.76. No action needed unless you want to consolidate on Reanimated.

- **`@gorhom/bottom-sheet` 4 → 5**
  - `BottomSheet` API mostly unchanged
  - Snap points must now be memoized (`useMemo`) — likely already done
  - Some prop renames; consult v5 migration doc

- **TypeScript bump 3.8 → 5.x**
  - `tsconfig.json` will need `"jsx": "react-jsx"` (was `"react"`)
  - `@types/react` 17 → 18 — fix any `ReactNode` / FC children prop errors (children is no longer implicit on `FC`)

- **axios 0.21 → 1.x**
  - `axios.create({ baseURL })` unchanged
  - Error shape unchanged for normal usage; revisit only if you read `error.response.config`

### Phase 4 — Restore shared-element transitions (1–2 hrs)
If Phase 1 dropped them temporarily, reintroduce using Reanimated 3 `sharedTransitionTag`. Test the home → detail screen transition feels smooth.

### Phase 5 — Validation (1–2 hrs)
- [ ] `yarn ios` builds clean (Xcode 26)
- [ ] `yarn android` builds clean (JDK 17, Android SDK 35)
- [ ] Hot reload works
- [ ] Cold start — list loads from PokeAPI
- [ ] Tap a Pokémon — detail screen opens with transition
- [ ] Swipe between detail tabs (pager view)
- [ ] Bottom sheet opens / drags / dismisses
- [ ] Image caching behaves (whichever lib you chose)
- [ ] No red-box warnings; check Metro logs for deprecations
- [ ] `yarn lint` passes (ESLint config may need bump to `@react-native/eslint-config`)
- [ ] `yarn test` passes (Jest config will need a touch — `preset: "react-native"` still works but the snapshot baseline will change)

---

## 5. Risk register

| Risk | Likelihood | Mitigation |
|---|---|---|
| Shared-element library has no clean replacement → visual regression | Medium | Reanimated 3 `sharedTransitionTag` is genuinely good; have a "no transition" fallback |
| New arch (Fabric/TurboModules) exposes a bug in a small lib | Medium | RN 0.76 supports both archs; set `newArchEnabled=false` in `gradle.properties` and the Podfile if blocked, ship that way first |
| Native modules' iOS deployment target mismatch | Low | RN 0.76 requires iOS 15.1+; bump in Podfile |
| Android Gradle plugin version mismatch | Low | Phase 2 regen approach side-steps this |
| Jest snapshots churn | Low | Delete and regenerate after manual visual check |
| Hidden runtime crashes from React 17 → 18 effects double-invocation in StrictMode | Low | Project has minimal effects; spot-fix as found |

---

## 6. Alternative: switch to Expo (worth considering)

For a personal project this size, **Expo (bare or managed)** would eliminate most of the iOS/Android toolchain pain — no Xcode-version surprises, no pod headaches, EAS handles native builds in the cloud. The migration cost is similar to a bare RN upgrade, and most of the libraries you're already using (`react-native-reanimated`, `react-native-gesture-handler`, `react-native-screens`, `@gorhom/bottom-sheet`, `react-navigation`, `expo-image`) are first-class in Expo.

**Recommendation:** if you choose this path, do `npx create-expo-app pokedexNext --template` at Phase 2 instead of the bare-RN regeneration, and port `src/` directly. Phases 3–5 are nearly identical.

---

## 7. Out of scope (deliberately)

- Migrating from Context (`src/store/context.tsx`) to Zustand/Redux — works fine as-is
- Adding tests beyond what's there
- Rewriting the legacy `Animated` usage to Reanimated — only do this if it breaks
- Visual redesign

---

## 8. Definition of done

- App builds on Xcode 26 with no patches to `node_modules`
- App builds on Android with current Gradle/JDK
- All screens functional; transitions feel right
- `package.json` contains zero unmaintained packages
- `RN_UPGRADE_PLAN.md` deleted or moved to `docs/` once shipped
