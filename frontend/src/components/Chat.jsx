import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addMessage, addFile } from "../redux/actions";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:4000");

const Chat = () => {
  const dispatch = useDispatch();
  const messages = useSelector((state) => state.messages);
  const files = useSelector((state) => state.files);

  useEffect(() => {
    socket.on("message", (message) => {
      dispatch(addMessage(message));
    });

    socket.on("file", async (file) => {
      const response = await axios.post("http://localhost:4000/upload", file);
      dispatch(addFile(response.data));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    const input = event.target.message;
    const message = {
      text: input.value,
      timestamp: Date.now(),
    };
    input.value = "";
    socket.emit("message", message);
  };

  const handleFileSubmit = (event) => {
    event.preventDefault();
    const input = event.target.file;
    const file = input.files[0];
    const formData = new FormData();
    formData.append("file", file);
    socket.emit("file", formData);
  };

  return (
    <div className="Chat">
      <div className="Messages">
        {messages.map((message) => (
          <div key={message.timestamp} className="Message">
            {message.text}
          </div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit}>
        <input type="text" name="message" placeholder="Type a message..." />
        <button type="submit">Send</button>
      </form>
      <form onSubmit={handleFileSubmit}>
        <input type="file" name="file" />
        <button type="submit">Send File</button>
      </form>
      <div className="Files">
        {files.map((file) => (
          <div key={file.filename} className="File">
            <a
              href={`http://localhost:4000/files/${file.filename}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {file.originalname}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
