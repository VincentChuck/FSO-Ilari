import { DiaryEntry } from "./types";

export const checkDiaryResponse = (object: unknown): object is DiaryEntry => {
  if (!object || typeof object !== "object") {
    return false;
  }
  return (
    "comment" in object &&
    "date" in object &&
    "weather" in object &&
    "visibility" in object
  );
};
