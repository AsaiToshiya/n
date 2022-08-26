import { useEffect, useMemo, useRef, useState } from "react";
import { Menu, Input } from "antd";
import { PlusOutlined, MenuOutlined, GithubOutlined } from "@ant-design/icons";
import "./App.css";

const { TextArea } = Input;

// 定数

const KEY_NOTES = "notes";
const MAX_NOTE_COUNT = 100;
const REPO_URL = "https://github.com/AsaiToshiya/n";

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

  // ref フック

  const textarea = useRef(null);

  // メソッド

  const prependNote = () => {
    const id = Math.random().toString(36).slice(2);
    const newNote = { id, text: "" };
    setNotes([newNote, ...notes].slice(0, MAX_NOTE_COUNT));
    return newNote;
  };

  const handleGithubClick = () => window.open(REPO_URL);

  const handleListClick = () => setListShow(!isListShow);

  const handleNewClick = () => {
    const firstNote = notes[0];
    const note = !firstNote.text ? firstNote : prependNote();
    setSelectedKeys([note.id]);
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
    if (!id) {
      return "";
    }
    const note = notes.find((x) => x.id === id);
    return note.text;
  }, [notes, selectedKeys]);

  // 副作用フック

  useEffect(() => {
    const note = prependNote();
    setSelectedKeys([note.id]);
  }, []);

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
