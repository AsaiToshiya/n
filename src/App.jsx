import { useEffect, useMemo, useRef, useState } from "react";
import "antd/dist/antd.css";
import { Menu } from "antd";
import Icon from "@ant-design/icons";
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
    if(notes.length >0){
      if (notes[0].noteName === "Empty"){
        textarea.current.focus();
        return;
      }
    }
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
            icon: (
              <Icon
                component={() => (
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M3,6V22H21V24H3A2,2 0 0,1 1,22V6H3M16,9H21.5L16,3.5V9M7,2H17L23,8V18A2,2 0 0,1 21,20H7C5.89,20 5,19.1 5,18V4A2,2 0 0,1 7,2M7,4V18H21V11H14V4H7Z"
                    />
                  </svg>
                )}
              />
            ),
          },
          {
            key: "new",
            icon: (
              <Icon
                component={() => (
                  <svg viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M19,1L17.74,3.75L15,5L17.74,6.26L19,9L20.25,6.26L23,5L20.25,3.75M9,4L6.5,9.5L1,12L6.5,14.5L9,20L11.5,14.5L17,12L11.5,9.5M19,15L17.74,17.74L15,19L17.74,20.25L19,23L20.25,20.25L23,19L20.25,17.74"
                    />
                  </svg>
                )}
              />
            ),
          },
          {
            icon: (
              <a href="https://github.com/AsaiToshiya/n" target="_blank">
                <Icon
                  component={() => (
                    <svg viewBox="0 0 24 24">
                      <path
                        fill="currentColor"
                        d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                      />
                    </svg>
                  )}
                />
              </a>
            ),
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
