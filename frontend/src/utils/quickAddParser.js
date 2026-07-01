import * as chrono from "chrono-node";

// Matches http(s) URLs, or bare domains like "leetcode.com" / "github.com/user/repo"
const URL_REGEX =
  /(https?:\/\/[^\s]+)|((?:[a-zA-Z0-9-]+\.)+(?:com|org|net|io|dev|co|app|gg|ai|edu|gov|in|xyz|me|so|sh)(?:\/[^\s]*)?)/i;

// Filler words that sit right before a date phrase and should be swallowed
// along with it, e.g. "...due tomorrow" -> "due" gets removed too.
const FILLER_BEFORE_DATE = /\b(due|on|by|at|for)\s*$/i;

/**
 * Parses a single free-text string into { title, dueDate, link }.
 * Mirrors the shape TodoModal already sends to createTodo().
 *
 * Examples:
 *   "Merge Intervals due tomorrow leetcode.com"
 *     -> { title: "Merge Intervals", dueDate: <ISO tomorrow>, link: "https://leetcode.com" }
 *
 *   "Finish essay due friday"
 *     -> { title: "Finish essay", dueDate: <ISO next friday>, link: "" }
 */
export function parseQuickAdd(rawText) {
  let text = (rawText || "").trim();
  let link = "";
  let dueDate = null;

  // 1. Pull out a link first, so it doesn't confuse the date parser
  //    (e.g. domains with numbers, or dates that look like part of a URL path).
  const urlMatch = text.match(URL_REGEX);
  if (urlMatch) {
    link = urlMatch[0];
    if (!/^https?:\/\//i.test(link)) link = `https://${link}`;
    text = (
      text.slice(0, urlMatch.index) +
      text.slice(urlMatch.index + urlMatch[0].length)
    ).trim();
  }

  // 2. Pull out a date phrase ("tomorrow", "next monday", "30/6", "in 3 days"...)
  const results = chrono.parse(text, new Date(), { forwardDate: true });
  if (results.length) {
    const match = results[0];
    dueDate = match.start.date().toISOString();

    const before = text.slice(0, match.index);
    const after = text.slice(match.index + match.text.length);
    const cleanedBefore = before.replace(FILLER_BEFORE_DATE, "").trim();
    text = `${cleanedBefore} ${after}`.replace(/\s+/g, " ").trim();
  }

  // 3. Whatever's left is the title
  const title = text.replace(/\s+/g, " ").trim();

  return { title, dueDate, link };
}