import React, { useEffect, useState, useRef, type FC } from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";
// import styles from './element.module.css';

interface Props {
  // displayName?: string;
  conversations?: string;
}

function formatDate(input) {
  const date = new Date(input);
  const now = new Date();

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // --- Helper: get start of week (Monday as first day) ---
  function getStartOfWeek(d) {
    const dateCopy = new Date(d);
    const day = dateCopy.getDay();
    const diff = dateCopy.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(dateCopy.setDate(diff));
  }

  const startOfThisWeek = getStartOfWeek(now);

  const isSameWeek = date >= startOfThisWeek;
  const isSameYear = date.getFullYear() === now.getFullYear();

  const time = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  // 1️⃣ If it’s this week → "Wed, 22:03"
  if (isSameWeek && isSameYear) {
    return `${daysOfWeek[date.getDay()]}, ${time}`;
  }

  // 2️⃣ Same year, not same week → "Jan 1, 22:03"
  if (isSameYear) {
    return `${months[date.getMonth()]} ${date.getDate()}, ${time}`;
  }

  // 3️⃣ Different year → "Jan 1, 2024"
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

function generateId(timestamp, status) {
  return `${timestamp}-${status}`;
  // const chars =
  //   "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // let id = "";
  // for (let i = 0; i < length; i++) {
  //   id += chars.charAt(Math.floor(Math.random() * chars.length));
  // }
  // return id;
}

// function addIdsToObjects(arr) {
//   return arr.map((obj) => ({
//     ...obj,
//     _id: generateId(),
//   }));
// }

function concatenateStrings(arr) {
  // console.log("👉 array to concatenate ->", arr);
  let result = "";
  for (let i = 0; i < arr.length; i++) {
    result += arr[i];
  }
  return result;
}

const CustomElement: FC<Props> = ({ conversations }) => {
  // console.log("👉 conversation main data ->", conversations);
  // conversation is received as json string
  const [conversationData, setConversationData] = useState(conversations);
  const [inputValue, setInputValue] = useState("");
  // const isFirstRender = useRef(true);

  const handleSend = () => {
    // console.log("Sending message:", inputValue);
  };

  // console.log("data outside of useEffect ->", data);

  useEffect(() => {
    // console.log("conversation data received ->", conversationData);
    setConversationData(conversations);
    // if (conversationData) {
    //   setData(JSON.parse(conversationData));
    // }
    // console.log("data inside useEffect ->", data);
    // check how the rendering works in custom element
    // if (isFirstRender.current) {
    //   console.log("First render");
    //   isFirstRender.current = false;
    // } else {
    //   console.log("Subsequent render");
    // }
  }, [conversations]);

  if (!conversationData) {
    return <h2>Loading...</h2>;
  }

  const {
    assistant_name,
    first_name,
    conversations: chat,
    customerPhoto,
    agentPicture,
  } = JSON.parse(conversationData);

  // console.log("👉👉👉👉", assistant_name, first_name, chat, agentPicture);

  const allConversations = chat.map((item) => {
    console.log("👉 conversation item ->>", item);
    return [
      {
        id: generateId(item.timestamp, "sent"),
        type: "sent",
        text: item.user,
        timestamp: item.timestamp,
      },
      {
        id: generateId(item.timestamp, "received"),
        type: "received",
        text: Array.isArray(item.assistant)
          ? concatenateStrings(item.assistant[0].text)
          : concatenateStrings(item.assistant.text), // data format inconsistency
        timestamp: item.timestamp,
      },
    ];
  });
  // console.log("allConversations ->", allConversations);

  const newConversations = [].concat(...allConversations);
  // console.log("newConversations ->", newConversations);

  // const data2 = {
  //   assistant_name: "Bob",
  //   first_name: "Sadique",
  //   conversation: [
  //     {
  //       user: "I am looking for a flight from Madrid to Tel Aviv on Friday",
  //       assistant: {
  //         text: [
  //           "Top option with high likelihood and shortest flight duration.\nDirect Iberia flight departing Friday night.\n\nYour trip offers 1 itinerary (USD 242.0) 1 traveler. (ECONOMY / OPTIMA) with checked bag (1).\n\n",
  //         ],
  //       },
  //     },
  //     {
  //       user: "I am looking for a flight from Madrid to Tel Aviv on Friday",
  //       assistant: {
  //         text: [
  //           "Top option with high likelihood and shortest flight duration.\nDirect Iberia flight departing Friday night.\n\nYour trip offers 1 itinerary (USD 242.0) 1 traveler. (ECONOMY / OPTIMA) with checked bag (1).\n\n",
  //         ],
  //       },
  //     },
  //   ],
  // };

  // const [c] = useState(data2.conversation);

  // const [inputValue, setInputValue] = useState("");

  const styles = {
    container: {
      fontFamily:
        '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      background: "#e5ddd5",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      minHeight: "80vh",
      padding: "20px",
    },
    chatContainer: {
      width: "100%",
      maxWidth: "360px",
      background: "white",
      borderRadius: "8px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      overflow: "hidden",
    },
    header: {
      background: "#f0f0f0",
      padding: "12px 16px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottom: "1px solid #ddd",
    },
    headerLeft: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      background: "#ccc",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "18px",
      color: "white",
      fontWeight: "600",
    },
    headerTitle: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#000",
      marginBottom: "2px",
    },
    headerSubtitle: {
      fontSize: "12px",
      color: "#666",
    },
    sessionInfo: {
      fontSize: "11px",
      color: "#0066cc",
      marginTop: "2px",
    },
    closeBtn: {
      width: "24px",
      height: "24px",
      border: "none",
      background: "none",
      fontSize: "20px",
      color: "#666",
      cursor: "pointer",
    },
    messagesContainer: {
      padding: "16px",
      height: "400px",
      overflowY: "auto",
      background: "#f5f5f5",
    },
    message: {
      display: "flex",
      gap: "10px",
      marginBottom: "16px",
    },
    messageSent: {
      display: "flex",
      gap: "10px",
      marginBottom: "16px",
      flexDirection: "row-reverse",
    },
    messageAvatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "#ccc",
      flexShrink: 0,
    },
    photo: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      objectFit: "cover",
    },
    messageContent: {
      maxWidth: "75%",
    },
    messageBubbleReceived: {
      padding: "10px 14px",
      borderRadius: "0 8px 8px 8px",
      fontSize: "14px",
      lineHeight: "1.4",
      background: "white",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
    },
    messageBubbleSent: {
      padding: "10px 14px",
      borderRadius: "8px 0 8px 8px",
      fontSize: "14px",
      lineHeight: "1.4",
      background: "#dcf8c6",
      wordWrap: "break-word",
      whiteSpace: "pre-wrap",
      overflowWrap: "break-word",
    },
    messageTime: {
      fontSize: "11px",
      color: "#999",
      marginTop: "4px",
    },
    menuDots: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "#f0f0f0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#666",
      fontSize: "20px",
      cursor: "pointer",
    },
    inputContainer: {
      background: "white",
      padding: "16px",
      borderTop: "1px solid #e0e0e0",
    },
    inputLabel: {
      fontSize: "12px",
      color: "#666",
      marginBottom: "8px",
      display: "block",
    },
    input: {
      flex: 1,
      padding: "12px 16px",
      border: "1px solid #ddd",
      borderRadius: "22px",
      fontSize: "14px",
      outline: "none",
      width: "100%",
    },
    inputFooter: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: "8px",
    },
    sendBtn: {
      background: "#e91e63",
      color: "white",
      border: "none",
      padding: "10px 20px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      gap: "6px",
    },
    statusIndicator: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      fontSize: "12px",
      color: "#666",
    },
    statusDot: {
      width: "20px",
      height: "20px",
      borderRadius: "50%",
      border: "2px solid #e91e63",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#e91e63",
      fontSize: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.chatContainer}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>
              <img
                style={styles.photo}
                src={customerPhoto}
                alt="customer photo"
              />
            </div>
            <div>
              <h3 style={styles.headerTitle}>{first_name}</h3>
              <p style={styles.headerSubtitle}>
                {chat.length} Messages in the past 7 days
              </p>
              <div style={styles.sessionInfo}>Session started ⓘ</div>
            </div>
          </div>
          <button style={styles.closeBtn}>×</button>
        </div>

        <div style={styles.messagesContainer}>
          {newConversations.map((message) => (
            <div
              key={message.id}
              // key={message.text}
              style={
                message.type === "sent" ? styles.messageSent : styles.message
              }
            >
              <div style={styles.messageAvatar}>
                <img
                  style={styles.photo}
                  src={message.type === "sent" ? customerPhoto : agentPicture}
                  alt="customer photo"
                />
              </div>

              {message.isMenu ? (
                <div style={styles.menuDots}>⋯</div>
              ) : (
                <div style={styles.messageContent}>
                  <div
                    style={
                      message.type === "sent"
                        ? styles.messageBubbleSent
                        : styles.messageBubbleReceived
                    }
                  >
                    {message.text}
                  </div>
                  <div
                    style={{
                      ...styles.messageTime,
                      textAlign: message.type === "sent" ? "right" : "left",
                    }}
                  >
                    {formatDate(message.timestamp)}
                    {/*{message.type === "sent" && (
                      <span style={{ color: "#4fc3f7" }}> ✓</span>
                    )}*/}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <label style={styles.inputLabel}>AI Message</label>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Would you like to book this flight?"
            style={styles.input}
          />
          <div style={styles.inputFooter}>
            <button onClick={handleSend} style={styles.sendBtn}>
              SEND <span>⊙</span>
            </button>
            <div style={styles.statusIndicator}>
              <span>AI</span>
              <div style={styles.statusDot}>✓</div>
              <span>Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const customElement = reactToWebComponent(
  CustomElement,
  React,
  ReactDOM as any,
  {
    props: {
      conversations: "string",
    },
  }
);

export default customElement;
