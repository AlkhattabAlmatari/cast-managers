"use client";

const items = [
  { icon: "🎬", label: "ممثل", x: "6%", delay: "0s", duration: "16s", size: "56px" },
  { icon: "🎤", label: "مقدم", x: "16%", delay: "2s", duration: "18s", size: "54px" },
  { icon: "📸", label: "موديل", x: "28%", delay: "4s", duration: "17s", size: "52px" },
  { icon: "🎪", label: "منظم", x: "38%", delay: "1s", duration: "19s", size: "58px" },
  { icon: "✨", label: "إعلان", x: "48%", delay: "3s", duration: "15s", size: "48px" },
  { icon: "🎥", label: "تصوير", x: "58%", delay: "5s", duration: "20s", size: "54px" },
  { icon: "📢", label: "بروموتر", x: "68%", delay: "2.5s", duration: "16s", size: "52px" },
  { icon: "🕴️", label: "كومبارس", x: "78%", delay: "6s", duration: "18s", size: "50px" },
  { icon: "🌟", label: "موهبة", x: "88%", delay: "1.5s", duration: "17s", size: "46px" },
];

export default function FloatingWorkBackground() {
  return (
    <div className="floating-work-bg" aria-hidden="true">
      {items.map((item, index) => (
        <div
          key={index}
          className="floating-work-item"
          style={{
            left: item.x,
            animationDelay: item.delay,
            animationDuration: item.duration,
          }}
        >
          <div
            className="floating-work-bubble"
            style={{ width: item.size, height: item.size }}
          >
            <span className="floating-work-icon">{item.icon}</span>
          </div>
          <span className="floating-work-label">{item.label}</span>
        </div>
      ))}
    </div>
  );
}