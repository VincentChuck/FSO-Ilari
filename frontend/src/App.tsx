import { useEffect, useState } from "react";
import { getAllDiaries, createDiary } from "./diaryService";
import { DiaryEntry, NewDiaryEntry, Visibility, Weather } from "./types";

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

  const diaryCreation = (event: React.SyntheticEvent) => {
    event.preventDefault();
    const diaryToAdd: NewDiaryEntry = {
      date: newDate.value,
      weather: newWeather.value as Weather,
      visibility: newVisibility.value as Visibility,
      comment: newComment.value,
    };
    createDiary(diaryToAdd).then((data) => {
      setDiaries([...diaries, data]);
      dateReset();
      visibilityReset();
      weatherReset();
      commentReset();
    });
  };
  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  return (
    <div>
      <h3>Add new entry</h3>
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
