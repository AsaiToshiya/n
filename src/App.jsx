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

// 変数

const initialNote = createNote();
const storedNotes = JSON.parse(localStorage.getItem(KEY_NOTES)) || [];
const initialNotes = [initialNote, ...storedNotes].slice(0, MAX_NOTE_COUNT);
const menuItems = [
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
];

function App() {
  // ステート フック

  const [isListShow, setListShow] = useState(false);
  const [notes, setNotes] = useState(initialNotes);
  const [selectedKeys, setSelectedKeys] = useState([initialNote.id]);

  // ref フック

  const textarea = useRef(null);

  // メソッド

  const handleGithubClick = () => window.open(REPO_URL);
  const handleListClick = () => setListShow(!isListShow);
  const handleNewClick = () => {
    const note = notes[0].text ? [createNote()] : [];
    const newNotes = [...note, ...notes].slice(0, MAX_NOTE_COUNT);
    setNotes(newNotes);
    setSelectedKeys([newNotes[0].id]);
  };

  // 変数

  const clickHandlers = {
    github: handleGithubClick,
    list: handleListClick,
    new: handleNewClick,
  };
  const listItems = notes.map(({ text, id }) => ({
    label: text ? text : " ",
    key: id,
  }));

  // メモ フック

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
    const index = notes.findIndex((x) => x.id === id);
    const newNote = { id, text: event.target.value };
    const newNotes = [
      newNote,
      ...notes.slice(0, index),
      ...notes.slice(index + 1),
    ];
    setNotes(newNotes);
    localStorage.setItem(KEY_NOTES, JSON.stringify(newNotes));
  };
  const handleSelect = ({ key }) => {
    setNotes(notes.filter(({ text }) => text));
    setSelectedKeys([key]);
  };

  return (
    <div className="App">
      {/* メニュー */}
      <Menu
        className="App-menu"
        inlineCollapsed={true}
        items={menuItems}
        mode="inline"
        onClick={({ key }) => clickHandlers[key]()}
        selectable={false}
      />

      {/* メモ リスト */}
      {isListShow && (
        <div className="App-list">
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
