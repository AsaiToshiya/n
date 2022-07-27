import { useEffect, useMemo, useRef, useState } from "react";
import "antd/dist/antd.css";
import { Menu } from "antd";
import { PlusOutlined, MenuOutlined, GithubOutlined } from "@ant-design/icons";
import "./App.css";

function App() {
  // 定数

  const KEY_NOTES = "notes";
  const MAX_NOTE_COUNT = 100;

  // リアクティブ変数

  const [isListShow, setListShow] = useState(false);
  const [notes, setNotes] = useState(
    (JSON.parse(localStorage.getItem(KEY_NOTES)) || []).map(({ id, text }) => ({
      id,
      text,
      noteName: text.trim() ? text : "Empty",
    }))
  );
  const [selected, setSelected] = useState([]);
  const textarea = useRef(null);

  // 算出プロパティ

  const text = useMemo(() => {
    const id = selected[0];
    if (!id) {
      return "";
    }
    const note = notes.find((x) => x.id === id);
    return note.text;
  }, [notes, selected]);
  const handleChange = (event) => {
    const id = selected[0];
    const index = notes.findIndex((x) => x.id === id);
    const newNote = {
      id,
      text: event.target.value,
      noteName: event.target.value.trim() ? event.target.value : "Empty",
    };
    const newNotes = [
      newNote,
      ...notes.slice(0, index),
      ...notes.slice(index + 1),
    ];
    setNotes(newNotes);
    localStorage.setItem(
      KEY_NOTES,
      JSON.stringify(
        newNotes.map(({ id, text }) => ({
          id,
          text,
        }))
      )
    );
  };

  // ウォッチャー

  useEffect(() => textarea.current.focus(), [isListShow, selected]);

  // メソッド ハンドラー

  const addNote = () => {
    const id = Math.random().toString(36).slice(2);
    const newNote = { id, text: "", noteName: "Empty" };
    setNotes([newNote, ...notes].slice(0, MAX_NOTE_COUNT));
    setSelected([id]);
  };

  const toggleList = () => setListShow(!isListShow);

  // ライフサイクル フック

  useEffect(() => addNote(), []);

  return (
    <div className="d-flex h-100">
      {/* ナビゲーション メニュー */}
      <Menu
        className="d-flex flex-column h-100"
        inlineCollapsed={true}
        items={[
          {
            key: "list",
            icon: <MenuOutlined />,
          },
          {
            key: "new",
            icon: <PlusOutlined />,
          },
          {
            icon: <GithubOutlined />,
          },
        ]}
        mode="inline"
        onClick={({ key }) => {
          switch (key) {
            case "list":
              toggleList();
              break;
            case "new":
              addNote();
              break;
          }
        }}
        selectable={false}
        style={{
          minWidth: 56,
          width: 56,
        }}
      />

      {/* メモ リスト */}
      {isListShow && (
        <div className="list" style={{ minWidth: 300, overflow: "auto" }}>
          <Menu
            className="d-flex flex-column"
            items={notes.map((note) => ({
              label: note.noteName,
              key: note.id,
            }))}
            mode="inline"
            onSelect={({ key }) => setSelected([key])}
            selectedKeys={selected}
          />
        </div>
      )}

      {/* テキスト エリア */}
      <textarea
        className="px-2 text w-100"
        onChange={handleChange}
        ref={textarea}
        style={{ border: "initial" }}
        value={text}
      />
    </div>
  );
}

export default App;
