import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const searchParams = new URLSearchParams(window.location.search);

// オプション
const theme = searchParams.get("theme");
const fontSize = searchParams.get("font-size") ?? undefined;
const fontFamily = searchParams.get("font-family") ?? undefined;

const isDark = theme === "dark";
document.documentElement.style.setProperty(
  "color-scheme",
  isDark ? "dark" : "light"
);
const head = document.getElementsByTagName("head")[0];
const link = Object.assign(document.createElement("link"), {
  rel: "stylesheet",
  href: isDark ? "/n/antd.dark.min.css" : "/n/antd.min.css",
  onload: () => {
    const root = ReactDOM.createRoot(document.getElementById('app'));
    root.render(
      <React.StrictMode>
        <App options={{ fontSize, fontFamily }} />
      </React.StrictMode>
    );
  },
});
head.appendChild(link);
