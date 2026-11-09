# Art Gallery App

An art gallery with four pages (Spotlight, Gallery, Favorites, Details). The art pieces come from `https://example-apis.vercel.app/api/art`. Users can mark favorites and write comments, which are saved in the local storage.

## Stack

- React 19, TypeScript (strict), Vite 5
- React Router (`react-router`), SWR for fetching
- Tailwind CSS 4 (through `@tailwindcss/vite`), styles in `src/styles.css`
- Vitest with React Testing Library and jsdom, coverage with `@vitest/coverage-v8`
- ESLint (`@eslint/js`, `typescript-eslint`, `eslint-plugin-sonarjs`, `eslint-plugin-react-hooks`), Prettier
- GitHub Actions (`ci.yml`, `sonar.yaml`), SonarQube Cloud, Vercel

## Commands

- `npm run dev`: start the development server
- `npm run check`: type-check with TypeScript
- `npm run lint`: check the code with ESLint
- `npm run format`: format the code with Prettier
- `npm run format:check`: check the formatting
- `npm run test:run`: run all tests once
- `npm run coverage`: run all tests once and write `coverage/lcov.info`
- `npm run build`: build the app

Before a change is done, `check`, `lint`, `format:check`, `test:run` and `build` pass.

## Conventions

- One branch and one pull request per issue. Merge only when `ci` and the SonarQube Cloud quality gate are green.
- Components live in `src/components`, one component per file with a default export and a typed `...Props` type.
- The art pieces are fetched once in `App.tsx` with `useSWR` and passed down as props.
- Own information (favorites, comments) is the `ArtPieceInfo[]` state in `App.tsx`, connected to the art pieces by `slug`. The fetched art pieces are never changed. The helpers in `src/artPiecesInfo.ts` return a new list and never change the given one.
- A test file sits next to its file (`Spotlight.tsx` and `Spotlight.test.tsx`). Tests find elements by role and text, not by CSS class. `test`, `expect` and `vi` are globals.
- Tests never call the real API: they mock `fetch`. Components with links are wrapped in a `MemoryRouter`, and `App` tests use an `SWRConfig` with a fresh cache.
- New code is fully covered by tests: the quality gate checks the coverage of new code.
- Styling uses Tailwind utility classes. In CSS, no nesting with `&` (SonarQube Cloud reports it as a bug).
- Accessibility: images have the alt text "title by artist", the favorite button uses `aria-pressed`, and navigation uses links, not buttons.

## Off limits

- Never use `npm test`: it starts the watch mode and does not end. Use `npm run test:run`.
- Never change a test to make it pass. If a test fails, fix the code, or explain why the test is wrong and ask first.
- Never lower a threshold or disable a rule (ESLint, TypeScript, SonarQube Cloud, coverage) to make a check green.
- Only do what the current issue asks for.
- Never commit or push to `main` directly.
- Never write a token or secret into a file or a prompt. `SONAR_TOKEN` exists only as a GitHub secret.
- Never edit `.github/templates`: a change there on `main` creates the issues again.
