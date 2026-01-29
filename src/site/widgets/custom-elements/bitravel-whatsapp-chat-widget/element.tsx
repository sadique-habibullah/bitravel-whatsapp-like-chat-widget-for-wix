import React, { useEffect, useState, useRef, type FC } from "react";
import ReactDOM from "react-dom";
import reactToWebComponent from "react-to-webcomponent";
import ChatSkeleton from "./components/ChatSkeleton/ChatSkeleton";
// import styles from './element.module.css';
import "./style.css";
import styles from "./elementStyles";

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
  const removeSessionFromUiButton = useRef(null);

  const handleSend = () => {
    // console.log("Sending message:", inputValue);
  };

  const handleRemoveSessionFromUi = (conversationData) => {
    // console.log("cross button Clicked ->", conversationData);
    const eventDispatchRes = removeSessionFromUiButton.current.dispatchEvent(
      new CustomEvent("event_removeSessionFromUi", {
        detail: { sessionId },
        bubbles: true,
        composed: true,
      }),
    );
    console.log("eventDispatchRes ->>", eventDispatchRes);
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
    return <ChatSkeleton />;
  }

  const {
    sessionId,
    assistantName,
    firstName,
    conversations: chat,
    customerPhoto,
    agentPicture,
    assistantPicture,
    state,
    stateDescription,
  } = JSON.parse(conversationData);

  // console.log("👉👉👉👉", assistantName, firstName, chat, agentPicture);
  console.log("--------start---------");
  console.log("assistantName", assistantName);
  console.log("firstName", firstName);
  console.log("chat", chat);
  console.log("agentPicture", agentPicture);
  console.log("state", state);
  console.log("stateDescription", stateDescription);
  console.log("--------end---------");

  const allConversations = chat.map((item) => {
    // console.log("👉 conversation item ->>", item);
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
  //   assistantName: "Bob",
  //   firstName: "Sadique",
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

  return (
    <div style={styles.container}>
      <div className="custom-scroll" style={styles.chatContainer}>
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.avatar}>
              <img
                style={styles.photo}
                src={customerPhoto}
                alt="customer photo"
              />
            </div>
            <div style={styles.headerTextContainer}>
              <p style={styles.headerTitle}>
                {firstName} |{" "}
                <span style={styles.headerTitle2ndPart}>Amdocs</span>
              </p>
              <p style={styles.headerSubtitle}>
                {chat.length} Messages in the past 7 days
              </p>
              <p style={styles.sessionInfo}>{state}</p>
            </div>
          </div>
          <button
            ref={removeSessionFromUiButton}
            style={styles.closeBtn}
            onClick={() => handleRemoveSessionFromUi(sessionId)}
          >
            ×
          </button>
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
                  style={styles.participantPhoto}
                  src={
                    message.type === "sent" ? customerPhoto : assistantPicture
                  }
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
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={styles.inputContainer}>
          <label style={styles.inputLabel}>AI Message</label>
          <textarea
            // type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Add your message here..."
            style={styles.input}
          />
          <div style={styles.inputFooter}>
            <button onClick={handleSend} style={styles.sendBtn}>
              SEND{" "}
              {/* <span>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                  <path d="M566.6 342.6C579.1 330.1 579.1 309.8 566.6 297.3L406.6 137.3C394.1 124.8 373.8 124.8 361.3 137.3C348.8 149.8 348.8 170.1 361.3 182.6L466.7 288L96 288C78.3 288 64 302.3 64 320C64 337.7 78.3 352 96 352L466.7 352L361.3 457.4C348.8 469.9 348.8 490.2 361.3 502.7C373.8 515.2 394.1 515.2 406.6 502.7L566.6 342.7z" />
                </svg>
              </span> */}
            </button>
            <div style={styles.senderType}>
              <span style={styles.senderTypeText}>AI</span>
            </div>
            <div style={styles.statusIndicator}>
              {/* <div style={styles.statusDot}>✓</div> */}
              <div className="toggleSwitch">
                <input type="checkbox" id="switch" />
                <label for="switch">Toggle</label>
              </div>
              {/* <div>
                {" "}
                <input type="checkbox" name="" id="" />
              </div> */}
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
  },
);

export default customElement;
