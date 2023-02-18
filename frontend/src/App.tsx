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
  const [newWeather, setNewWeather] = useState("");
  const [newVisibility, setNewVisibility] = useState("");
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
      weather: newWeather as Weather,
      visibility: newVisibility as Visibility,
      comment: newComment.value,
    };
    createDiary(diaryToAdd)
      .then((res) => {
        if (checkDiaryResponse(res)) {
          setDiaries(diaries.concat(res));
          dateReset();
          setNewWeather("sunny");
          setNewVisibility("great");
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
        <input type="date" {...newDate} /> <br />
        <strong>weather</strong>
        <input
          type="radio"
          name="weather"
          value="sunny"
          defaultChecked
          onChange={() => setNewWeather("sunny")}
        />
        sunny
        <input
          type="radio"
          name="weather"
          value="rainy"
          onChange={() => setNewWeather("rainy")}
        />
        rainy
        <input
          type="radio"
          name="weather"
          value="cloudy"
          onChange={() => setNewWeather("cloudy")}
        />
        cloudy
        <input
          type="radio"
          name="weather"
          value="stormy"
          onChange={() => setNewWeather("stormy")}
        />
        stormy
        <input
          type="radio"
          name="weather"
          value="windy"
          onChange={() => setNewWeather("windy")}
        />
        windy
        <br />
        <strong>visibility</strong>
        <input
          type="radio"
          name="visibility"
          value="great"
          defaultChecked
          onChange={() => setNewVisibility("great")}
        />
        great
        <input
          type="radio"
          name="visibility"
          value="good"
          onChange={() => setNewVisibility("good")}
        />
        good
        <input
          type="radio"
          name="visibility"
          value="ok"
          onChange={() => setNewVisibility("ok")}
        />
        ok
        <input
          type="radio"
          name="visibility"
          value="poor"
          onChange={() => setNewVisibility("poor")}
        />
        poor
        <br />
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
