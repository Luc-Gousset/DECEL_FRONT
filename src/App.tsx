import React, { useEffect, memo } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { SocketInterface, Card_config } from './components/interface';


import Root from '@/components/root';
import Card_view from '@/components/cardview';
import Card_edit_view from '@/components/card_edit';

import './App.css'


const WEBSOCKET_ADDRESS = "ws://192.168.137.2:8080";

export var socket = new WebSocket(WEBSOCKET_ADDRESS);

socket.onopen = () => {
  console.log('Connected to the websocket');
};

//On socket disconect, try reco every 5 seconds

socket.onclose = () => {
  console.log('Disconnected from the websocket');
  setTimeout(() => {
    socket = new WebSocket(WEBSOCKET_ADDRESS);
  }, 5000);
};


// Function to attempt reconnection
const reconnectSocket = () => {
  return new Promise<void>((resolve, reject) => {
    // Logic to reconnect the socket
    // This can vary depending on how you manage your WebSocket instance
    try {
      socket = new WebSocket(WEBSOCKET_ADDRESS); // replace with your WebSocket URL
      socket.onopen = () => resolve();
      socket.onerror = (error) => reject(error);
    } catch (error) {
      reject(error);
    }

    // Optional: Add a timeout for reconnection attempt
    setTimeout(() => {
      if (socket.readyState !== WebSocket.OPEN) {
        reject(new Error('Failed to reconnect to the socket.'));
      }
    }, 5000); // Adjust timeout as needed
  });
};



const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "card/:cardId",
    element: <Card_view />,
    loader: async ({ params }) => {
      // Check if socket is connected, attempt to reconnect if not
      if (socket.readyState !== WebSocket.OPEN) {
        await reconnectSocket();
      }
      return new Promise<Card_config>((resolve, reject) => {
        socket.onmessage = (event) => {
          try {
            if (params.cardId === undefined)
              reject(new Error("No card ID"));
            else {
              const msg: SocketInterface = JSON.parse(event.data.toString());
              console.log(msg)
              if (msg.message_header === "card_config" && msg.card_id === parseInt(params.cardId)) {
                const card_config: Card_config = msg.data;
                console.log(card_config)
                resolve(card_config);
              }
            }

          } catch (error) {
            reject(error); // in case there's an error, e.g., parsing
          }
        };
        console.log("test", params.cardId)
        // Send a request to get the card configuration
        var request: SocketInterface = { message_header: "get_card_config", card_id: Number(params.cardId), data: null };
        socket.send(JSON.stringify(request));

        // Optional: Add a timeout for the request, reject if no response within given time
        setTimeout(() => {
          reject(new Error('Timeout while waiting for card configuration.'));
        }, 5000); // waiting for 5 seconds, adjust as needed
      });

    },
  },
  {
    path: "card/:cardId/edit",
    element: <Card_edit_view />,
    loader: async ({ params }) => {
      // Check if socket is connected, attempt to reconnect if not
      if (socket.readyState !== WebSocket.OPEN) {
        await reconnectSocket();
      }

      return new Promise<Card_config>((resolve, reject) => {
        socket.onmessage = (event) => {
          try {
            if (params.cardId === undefined)
              reject(new Error("No card ID"));
            else {
              const msg: SocketInterface = JSON.parse(event.data.toString());
              console.log(msg)
              if (msg.message_header === "card_config" && msg.card_id === parseInt(params.cardId)) {
                const card_config: Card_config = msg.data;
                console.log(card_config)
                resolve(card_config);
              }
            }

          } catch (error) {
            reject(error); // in case there's an error, e.g., parsing
          }
        };
        console.log("test", params.cardId)
        // Send a request to get the card configuration
        var request: SocketInterface = { message_header: "get_card_config", card_id: Number(params.cardId), data: null };
        socket.send(JSON.stringify(request));

        // Optional: Add a timeout for the request, reject if no response within given time
        setTimeout(() => {
          reject(new Error('Timeout while waiting for card configuration.'));
        }, 5000); // waiting for 5 seconds, adjust as needed
      });

    },
  },

]);


function App() {

  return (
    <body className='select-none'>
      <React.StrictMode>
        <RouterProvider router={router} />
      </React.StrictMode>
    </body>

  );

};

export default App;
