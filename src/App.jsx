import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Input } from "antd";
import { GithubOutlined, MenuOutlined, PlusOutlined } from "@ant-design/icons";
import "./App.css";

const { TextArea } = Input;

// 定数
const KEY_NOTES = "notes";
const MAX_NOTE_COUNT = 100;
const REPO_URL = "https://github.com/AsaiToshiya/n";

// メソッド
const createNote = () => {
  const id = Math.random().toString(36).slice(2);
  return { id, text: "" };
};
const prependNote = (notes, note) =>
  [note, ...notes.filter((x) => x.id !== note.id)].slice(0, MAX_NOTE_COUNT);
const removeEmptyNotes = (notes) => notes.filter(({ text }) => text);

// 変数
const initialNote = createNote();
const storedNotes = JSON.parse(localStorage.getItem(KEY_NOTES)) || [];
const initialNotes = [initialNote, ...storedNotes].slice(0, MAX_NOTE_COUNT);

function App() {
  // ステート フック、ref フック、メモ フック
  const [isListShow, setListShow] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [selectedKeys, setSelectedKeys] = useState([initialNote.id]);
  const list = useRef(null);
  const textarea = useRef(null);
  const text = useMemo(() => {
    const id = selectedKeys[0];
    const note = notes.find((x) => x.id === id);
    return note.text;
  }, [notes, selectedKeys]);

  // 副作用フック
  useEffect(() => textarea.current.focus(), [isListShow, selectedKeys]);
  useEffect(() => {
    const element = textarea.current.resizableTextArea.textArea;
    element.scrollTop = 0;
    element.setSelectionRange(0, 0);
  }, [selectedKeys]);

  // イベント ハンドラー
  const handleChange = (event) => {
    const id = selectedKeys[0];
    const note = { id, text: event.target.value };
    const newNotes = prependNote(notes, note);
    setNotes(newNotes);
    localStorage.setItem(KEY_NOTES, JSON.stringify(newNotes));
  };
  const handleGithubClick = () => window.open(REPO_URL);
  const handleListClick = () => setListShow(!isListShow);
  const handleNewClick = () => {
    const firstNote = notes[0];
    const note = firstNote.text === "" ? firstNote : createNote();
    const newNotes = prependNote(notes, note);
    setNotes(newNotes);
    setSelectedKeys([note.id]);
    list.current.scrollTop = 0;
  };
  const handleSelect = ({ key }) => {
    setNotes(removeEmptyNotes);
    setSelectedKeys([key]);
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
            selectedKeys={selectedKeys}
          />
        </div>
      )}

      {/* テキスト エリア */}
      <TextArea
        bordered={false}
        className="App-text"
        onChange={handleChange}
        ref={textarea}
        value={text}
      />
    </div>
  );
}

export default App;
