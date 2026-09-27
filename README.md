# QVAC Rec League Team Namer

Enter a sport or activity (e.g. "softball", "trivia night", "kickball") plus a vibe or theme (e.g. "silly", "intimidating"), and an on-device AI suggests real-world team name ideas for your rec league, pickup game, or club team. No cloud call, no API key.

## Run

```bash
npm install
npm start
```

Then open http://localhost:31007

## QVAC SDK version

`@qvac/sdk` ^0.19.0 (see `package.json`).

## How it works

Built on [Tether's QVAC SDK](https://www.npmjs.com/package/@qvac/sdk) — all inference runs on-device, no cloud call, no API key. The app loads `LLAMA_3_2_1B_INST_Q4_0` locally with `loadModel()`, generates with `completion()` (streamed via `tokenStream`), and releases the model with `unloadModel()` on shutdown.

`src/logic.js` sends a one-shot example conversation (a real "kickball, silly" -> name list exchange) in the `completion()` history so the small 1B model reliably returns a plain list instead of prose. The response is split into lines, numbering/quotes are stripped, and results are deduplicated and capped at 5. If the model returns fewer than 3 usable names (or refuses), deterministic fallback names built from the sport and vibe words are used to top up the list.

## Example

- **Sport/activity:** `kickball`, **Vibe:** `silly`
- **Names returned:** something like `Kick-Ass Kickers`, `The Punt Squad`, `Ball So Hard United`, `Kickin' It Old School`, `The Diamond Divas`.

## Setup

Requires Node.js and a machine that can run the QVAC on-device runtime (see the QVAC SDK docs for platform support). `npm install` pulls in `@qvac/sdk`; `npm start` loads the `LLAMA_3_2_1B_INST_Q4_0` model on first run, which can take a moment.

## License

MIT
