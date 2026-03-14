export default function FloatingWorkBackground() {
  const items = [
    { icon: "🎭", cls: "rise rise-1" },
    { icon: "🎤", cls: "rise rise-2" },
    { icon: "📸", cls: "rise rise-3" },
    { icon: "🎬", cls: "rise rise-4" },
    { icon: "⭐", cls: "rise rise-5" },
    { icon: "🎥", cls: "rise rise-6" },
    { icon: "🧑‍💼", cls: "rise rise-7" },
    { icon: "📢", cls: "rise rise-8" },
    { icon: "🕴️", cls: "rise rise-9" },
    { icon: "🎞️", cls: "rise rise-10" },
    { icon: "🎟️", cls: "rise rise-11" },
    { icon: "📷", cls: "rise rise-12" },
    { icon: "🧑‍🎤", cls: "rise rise-13" },
    { icon: "👔", cls: "rise rise-14" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((item, index) => (
        <span key={index} className={item.cls}>
          {item.icon}
        </span>
      ))}

      <div className="absolute -left-20 top-10 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"></div>
      <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-3xl"></div>
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl"></div>
      <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl"></div>
    </div>
  );
}