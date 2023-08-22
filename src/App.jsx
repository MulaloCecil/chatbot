import { useState } from "react";
import "./App.css";
import OpenAI from 'openai';


const apiKey = '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';

const openai = new OpenAI({
  apiKey,
  dangerouslyAllowBrowser: true,
});

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message) return;
    setIsTyping(true);
    scrollTo(0,1e10)

    let msgs = chats;
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");
    console.log(openai); 
    await openai
    .createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a CastroSolutions. You can help with graphic design tasks",
        },
        ...chats,
      ],
    })
    .then((res) => {
      console.log(res);
      const newMessage = res.data.choices[0].message;
      const updatedChats = [...msgs, { role: "AI", content: newMessage }];
      setChats(updatedChats);
      setIsTyping(false);
      scrollTo(0, 1e10);
    })
  
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <main>
      <h1>Chat AI Tutorial</h1>

      <section>
        {chats && chats.length
          ? chats.map((chat, index) => (
              <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
                <span>
                  <b>{chat.role.toUpperCase()}</b>
                </span>
                <span>:</span>
                <span>{chat.content}</span>
              </p>
            ))
          : ""}
      </section>

      <div className={isTyping ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : ""}</i>
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
    </main>
  );
}

export default App;