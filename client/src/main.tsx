import { createRoot } from "react-dom/client";
import React from "react";
import "./index.css";
import App from "./MinimalApp";

// Add title
const title = document.createElement('title');
title.textContent = 'NURD App';
document.head.appendChild(title);

createRoot(document.getElementById("root")!).render(<App />);
