export default function ChatSkeleton() {
  const skeletonItems = Array.from({ length: 6 });

  return (
    <div className="chat-skeleton">
      {skeletonItems.map((_, i) => (
        <div
          key={i}
          className={`bubble-skeleton ${i % 2 === 0 ? "left" : "right"}`}
        >
          <div className="line" />
        </div>
      ))}
    </div>
  );
}
