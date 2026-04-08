import { franc } from "franc-min";

/**
 * Определяет язык текста между русским и казахским.
 * Используется только когда пользователь выбрал "auto".
 * @returns "ru" | "kk"
 */
export function detectLanguage(text: string): "ru" | "kk" {
  const lang = franc(text, { only: ["rus", "kaz"], minLength: 10 });
  return lang === "kaz" ? "kk" : "ru";
}