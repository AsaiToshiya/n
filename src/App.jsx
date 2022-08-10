import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Input } from "antd";
import { PlusOutlined, MenuOutlined, GithubOutlined } from "@ant-design/icons";
import "./App.css";

const { TextArea } = Input;

// 定数

const KEY_NOTES = "notes";
const MAX_NOTE_COUNT = 100;

// 変数

const menuItems = [
  {
    key: "list",
    icon: <MenuOutlined />,
    title: "List",
  },
  {
    key: "new",
    icon: <PlusOutlined />,
    title: "New",
  },
  {
    key: "github",
    icon: <GithubOutlined />,
    title: "GitHub",
  },
];

function App() {
  // ステート フック

  const [isListShow, setListShow] = useState(false);
  const [notes, setNotes] = useState(
    JSON.parse(localStorage.getItem(KEY_NOTES)) || []
  );
  const [selectedKeys, setSelectedKeys] = useState([]);

  // 変数

  const listItems = notes.map((note) => ({
    label: note.text.trim() ? note.text : "Empty",
    key: note.id,
  }));

  // ref フック

  const textarea = useRef(null);

  // メソッド

  const addNote = () => {
    const id = Math.random().toString(36).slice(2);
    const newNote = { id, text: "" };
    setNotes([newNote, ...notes].slice(0, MAX_NOTE_COUNT));
    return newNote;
  };

  const handleGithubClick = () => window.open("https://github.com/AsaiToshiya/n");

  const handleListClick = () => setListShow(!isListShow);

  const handleNewClick = () => {
    notes[0].text.trim() === ""
      ? setSelectedKeys([notes[0].id])
      : setSelectedKeys([addNote().id]);
  };

  // 変数

  const clickHandlers = {
    github: handleGithubClick,
    list: handleListClick,
    new: handleNewClick,
  };

  // メモ フック

  const text = useMemo(() => {
    const id = selectedKeys[0];
    if (!id) {
      return "";
    }
    const note = notes.find((x) => x.id === id);
    return note.text;
  }, [notes, selectedKeys]);

  // 副作用フック

  useEffect(() => setSelectedKeys([addNote().id]), []);

  useEffect(() => textarea.current.focus(), [isListShow, selectedKeys]);

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
            onSelect={({ key }) => setSelectedKeys([key])}
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
