import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@fontsource-variable/manrope';
import { LazyLoadImage } from "react-lazy-load-image-component";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LazyLoadImage/>
    <App />
  </React.StrictMode>,
)
