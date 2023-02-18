import { useEffect, useState } from "react";
import { getAllDiaries, createDiary } from "./diaryService";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";
import { checkDiaryResponse } from "./utils";

const useField = (name: string) => {
  const [value, setValue] = useState("");

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const placeholder = name;
  const reset = () => {
    setValue("");
  };

  return [
    {
      placeholder,
      value,
      onChange,
    },
    reset,
  ] as const;
};

function App() {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  const [newDate, dateReset] = useField("date");
  const [newWeather, weatherReset] = useField("weather");
  const [newVisibility, visibilityReset] = useField("visibility");
  const [newComment, commentReset] = useField("comment");
  const [notification, setNotification] = useState("");

  let timeoutID: ReturnType<typeof setTimeout>;
  const notify = (message: string) => {
    setNotification(message);
    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
      setNotification("");
    }, 4000);
  };

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryToAdd: NewDiaryEntry = {
      date: newDate.value,
      weather: newWeather.value as Weather,
      visibility: newVisibility.value as Visibility,
      comment: newComment.value,
    };
    createDiary(diaryToAdd)
      .then((res) => {
        if (checkDiaryResponse(res)) {
          setDiaries(diaries.concat(res));
          dateReset();
          visibilityReset();
          weatherReset();
          commentReset();
        } else {
          notify(res);
        }
      })
      .catch();
  };

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  return (
    <div>
      <h3>Add new entry</h3>
      {notification && (
        <p style={{ color: "rgb(220, 38, 38)" }}>{notification}</p>
      )}
      <form onSubmit={diaryCreation}>
        <input {...newDate} /> <br />
        <input {...newWeather} /> <br />
        <input {...newVisibility} /> <br />
        <input {...newComment} /> <br />
        <button type="submit">add</button>
      </form>
      <h3>Diary entries</h3>
      {diaries.map((diary) => (
        <div key={diary.id}>
          <p>
            <b>{diary.date}</b>
          </p>
          <p>
            visibility: {diary.visibility} <br />
            weather: {diary.weather}
          </p>
        </div>
      ))}
    </div>
  );
}

export default App;
