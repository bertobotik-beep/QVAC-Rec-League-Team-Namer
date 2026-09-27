// QVAC Rec League Team Namer — core logic.
// completion() suggests team name ideas for a sport/activity + vibe.

import { completion } from "@qvac/sdk";

function looksUnusable(text) {
  if (!text || text.trim().length === 0) return true;
  const bad = ["i cannot", "i can't", "as an ai", "i'm not able", "i am not able"];
  const lower = text.toLowerCase();
  return bad.some((phrase) => lower.includes(phrase));
}

function parseLines(raw) {
  return raw
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^[-*\d.)\s]+/, "")
        .replace(/^["']|["']$/g, "")
        .trim()
    )
    .filter((line) => line.length > 0 && line.length < 60);
}

function fallbackNames(sport, vibe) {
  const s = sport.trim();
  const v = vibe.trim();
  const cap = (w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : "");
  return [
    `The ${cap(v) || "Mighty"} ${cap(s)}ers`,
    `${cap(v) || "Fearless"} Squad`,
    `${cap(s)} Legends`,
    `The ${cap(v) || "Wild"} Wolves`,
    `${cap(s)} All-Stars`,
  ];
}

export async function generateTeamNames(modelId, sport, vibe) {
  const vibeText = vibe ? vibe : "fun and memorable";
  const run = completion({
    modelId,
    history: [
      {
        role: "system",
        content:
          "You brainstorm real-world team name ideas for a recreational sports or activity team. " +
          "Given a sport/activity and a vibe, suggest 5 short, catchy team names that real people " +
          "could actually use for a rec league or club team. Reply with ONLY a plain list, one " +
          "name per line, no numbering, no explanation.",
      },
      { role: "user", content: "Sport/activity: kickball. Vibe: silly" },
      {
        role: "assistant",
        content:
          "Kick-Ass Kickers\nThe Punt Squad\nBall So Hard United\nKickin' It Old School\nThe Diamond Divas",
      },
      { role: "user", content: `Sport/activity: ${sport}. Vibe: ${vibeText}` },
    ],
    stream: true,
    completionOpts: { temperature: 0.9, maxTokens: 150 },
  });

  let raw = "";
  for await (const token of run.tokenStream) raw += token;

  let names = looksUnusable(raw) ? [] : parseLines(raw);

  if (names.length < 3) {
    names = names.concat(fallbackNames(sport, vibe).filter((f) => !names.includes(f)));
  }
  names = [...new Set(names)].slice(0, 5);
  if (names.length < 3) names = fallbackNames(sport, vibe).slice(0, 5);

  return { sport, vibe, names };
}
