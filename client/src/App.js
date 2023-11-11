import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { socket } from './socket';
import './App.css'

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {   
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    function onNotificationEvent(value) {
      setNotifications((prevNotifications) => [...prevNotifications, value]);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('notification', onNotificationEvent);
    

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('notification', onNotificationEvent);
    };

  }, []);

  const sendNotification = () => {
    const notificationData = {
      message: 'New Notification!',
      timestamp: new Date().toLocaleTimeString(),
    };

    socket.emit('sendNotification', notificationData);
  };

  return (
    <div className="App">
      <h1>Real-Time Notifications</h1>
      <button onClick={sendNotification}>Send Notification</button>
      <div>
        <hr/>
        <h2>Notifications:</h2>
        <ul>
          {notifications.map((notification, index) => (
            <li key={index}>
              {notification.message} - {notification.timestamp}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
