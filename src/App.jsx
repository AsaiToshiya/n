import { useEffect, useMemo, useRef, useState } from "react";
import { Input, Menu } from "antd";
import { GithubOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons";
import "./App.css";

const { TextArea } = Input;

// 定数
const KEY_NOTES = "notes";
const KEY_IS_LIST_SHOW = "isListShow";
const MAX_NOTE_COUNT = 100;
const REPO_URL = "https://github.com/AsaiToshiya/n";

// メソッド
const createNote = () => {
  const id = Math.random().toString(36).slice(2);
  return { id, text: "" };
};
const prependEmptyNote = (notes) => {
  const firstNote = notes[0];
  const note = firstNote.text === "" ? firstNote : createNote();
  return prependNote(notes, note);
};
const prependNote = (notes, note) => {
  const uniqueNotes = [note, ...notes.filter((x) => x.id !== note.id)];
  return uniqueNotes.slice(0, MAX_NOTE_COUNT);
};
const removeEmptyNotes = (notes) => notes.filter(({ text }) => text);

// 変数
const initialListShow = localStorage.getItem(KEY_IS_LIST_SHOW) === "true";
const initialNote = createNote();
const storedNotes = JSON.parse(localStorage.getItem(KEY_NOTES)) || [];
const initialNotes = prependNote(storedNotes, initialNote);

function App({ options }) {
  // ステート フック、ref フック、メモ フック
  const [isListShow, setListShow] = useState(initialListShow);
  const [notes, setNotes] = useState(initialNotes);
  const [selectedNoteId, setSelectedNoteId] = useState(initialNote.id);
  const list = useRef(null);
  const textarea = useRef(null);
  const text = useMemo(() => {
    const note = notes.find((x) => x.id === selectedNoteId);
    return note.text;
  }, [notes, selectedNoteId]);

  // 副作用フック
  useEffect(() => textarea.current.focus());
  useEffect(() => {
    const element = textarea.current.resizableTextArea.textArea;
    element.scrollTo(0, 0);
    element.setSelectionRange(0, 0);
  }, [selectedNoteId]);

  // イベント ハンドラー
  const handleChange = (event) => {
    const note = { id: selectedNoteId, text: event.target.value };
    const newNotes = prependNote(notes, note);
    setNotes(newNotes);
    list.current?.scrollTo({ top: 0 });
    localStorage.setItem(KEY_NOTES, JSON.stringify(newNotes));
  };
  const handleGithubClick = () => window.open(REPO_URL);
  const handleListClick = () => {
    const newListShow = !isListShow;
    setListShow(newListShow);
    localStorage.setItem(KEY_IS_LIST_SHOW, newListShow);
  };
  const handleNewClick = () => {
    const newNotes = prependEmptyNote(notes);
    setNotes(newNotes);
    setSelectedNoteId(newNotes[0].id);
    list.current?.scrollTo({ top: 0 });
  };
  const handleSelect = ({ key }) => {
    setNotes(removeEmptyNotes);
    setSelectedNoteId(key);
  };

  // 変数
  const clickHandlers = {
    github: handleGithubClick,
    list: handleListClick,
    new: handleNewClick,
  };
  const listItems = notes.map(({ text, id }) => ({
    label: text,
    key: id,
  }));

  return (
    <div className="App">
      {/* メニュー */}
      <Menu
        className="App-menu"
        inlineCollapsed={true}
        items={[
          {
            icon: <MenuOutlined />,
            key: "list",
            title: "List",
          },
          {
            icon: <PlusOutlined />,
            key: "new",
            title: "New",
          },
          {
            icon: <GithubOutlined />,
            key: "github",
            title: "GitHub",
          },
        ]}
        mode="inline"
        onClick={({ key }) => clickHandlers[key]()}
        selectable={false}
      />

      {/* メモ リスト */}
      {isListShow && (
        <div className="App-list" ref={list}>
          <Menu
            className="App-list-menu"
            items={listItems}
            mode="inline"
            onSelect={handleSelect}
            selectedKeys={[selectedNoteId]}
          />
        </div>
      )}

      {/* テキスト エリア */}
      <TextArea
        bordered={false}
        className="App-text"
        onChange={handleChange}
        ref={textarea}
        style={options}
        value={text}
      />
    </div>
  );
}

export default App;
