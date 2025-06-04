import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import originalWarn from './utils/warn';
import { Provider } from "react-redux"
import store, { persistor } from "./Redux/store"; // Store aur Persistor import karo
import { PersistGate } from "redux-persist/integration/react";

const root = createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>

    <Provider store={store} >
      <PersistGate loading={null} persistor={persistor}>

        <App />
        <ToastContainer
          position="top-center" // Position of the toasts
          autoClose={5000} // Auto close after 2000ms
          closeOnClick={true} // Close when clicked
          transition={Zoom} // Zoom effect for transitions
          pauseOnHover // Pause timer when hovered
          newestOnTop
          hideProgressBar={true}

        />


      </PersistGate>
    </Provider>


  </React.StrictMode>
);
originalWarn();
reportWebVitals();

