import classes from "./ChatSkeleton.module.css";

export default function ChatSkeleton() {
  const items = Array.from({ length: 6 });

  return (
    <div className={classes.container}>
      {/* HEADER */}
      <div className={classes.header}>
        <div className={classes.avatar}></div>

        <div className={classes.headerText}>
          <div className={`${classes.line} ${classes.short}`}></div>
          <div className={`${classes.line} ${classes.tiny}`}></div>
        </div>
      </div>

      {/* MESSAGES */}
      <div className={classes.messages}>
        {items.map((_, i) => (
          <div
            key={i}
            className={`${classes.messageBlock} ${
              i % 2 === 0 ? classes.received : classes.sent
            }`}
          >
            {/* LEFT avatar on received */}
            {i % 2 === 0 && (
              <div className={`${classes.avatar} ${classes.small}`}></div>
            )}

            <div className={classes.bubble}>
              <div className={`${classes.line} ${classes.long}`}></div>
              <div className={`${classes.line} ${classes.medium}`}></div>
            </div>

            {/* RIGHT avatar on sent */}
            {i % 2 !== 0 && (
              <div className={`${classes.avatar} ${classes.small}`}></div>
            )}
          </div>
        ))}
      </div>

      {/* INPUT BAR */}
      <div className={classes.input}>
        <div className={classes.inputLine}></div>
        <div className={classes.sendButton}></div>
      </div>
    </div>
  );
}
