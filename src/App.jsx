import { useState } from "react";
import axios from 'axios';
const apiKey = import.meta.env.VITE_API_BASE_URL;

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    scrollTo(0, 1e10);

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "You are a CastroSolutions. You can help with all the requests",
            },
            ...chats,
          ],
        },
        {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(response);
      const newMessage = response.data.choices[0].message;
      const updatedChats = [...msgs, { role: "Solutions Bot", content: newMessage }];
      setChats(updatedChats);
      setIsTyping(false);
      scrollTo(0, 1e10);

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container">
      <h1>Solutions Bot</h1>
      <p1>Tell me what you’re working on or what your question is. I'm here to help!</p1>

      <section>
        {
          chats.length > 0 &&
          chats.map((c) => {
            if (c.role === "user") {
              return (<p>{c.role.toUpperCase() + " : " + c.content}</p>)
            } else {
              return (<p>{c.role + " : " + c.content.content}</p>)
            }
          })
        }
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing....." : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here and hit Enter..."
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </div>
  );
}

export default App;
