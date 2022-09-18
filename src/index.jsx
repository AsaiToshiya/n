import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const searchParams = new URLSearchParams(window.location.search);

// テーマ
const theme = searchParams.get("theme");
const isDark = theme === "dark";
document.documentElement.style.colorScheme = isDark ? "dark" : "light";
const head = document.getElementsByTagName("head")[0];
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = isDark ? "/n/antd.dark.min.css" : "/n/antd.min.css";
head.appendChild(link);

// フォント サイズ
const fontSize = searchParams.get("font-size") ?? undefined;

// フォント ファミリー
const fontFamily = searchParams.get("font-family") ?? undefined;

link.onload = () => {
  const root = ReactDOM.createRoot(document.getElementById('app'));
  root.render(
    <React.StrictMode>
      <App options={{ fontSize, fontFamily }} />
    </React.StrictMode>
  );
};
