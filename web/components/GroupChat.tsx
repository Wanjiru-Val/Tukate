import { chat } from "@/lib/content";

// The group chat that lets you down. Messages arrive one by one on load.
export function GroupChat() {
  return (
    <div
      className="w-full max-w-sm rotate-2 rounded-2xl border-2 border-usiku bg-white shadow-[8px_8px_0_var(--color-usiku)]"
      style={{ fontFamily: "var(--font-ui)" }}
      role="img"
      aria-label="A group chat. You ask what the plan is tonight. Kev has a deadline, Shiko is at a family ceremony, Mwas never finishes typing. You reply: fine then."
    >
      <div className="flex items-center gap-3 rounded-t-[14px] border-b-2 border-usiku bg-usiku px-4 py-3 text-cream">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-mango text-sm font-bold text-usiku">
          FM
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-[15px] font-semibold">Friday Mbogi</span>
          <span className="text-xs text-cream/60">Kev, Shiko, Mwas, You</span>
        </span>
      </div>
      <div className="flex flex-col gap-2.5 px-3 py-4 text-[15px] leading-snug text-usiku" aria-hidden="true">
        {chat.map((msg, i) => {
          const mine = msg.from === "me";
          const delay = `${0.5 + i * 1.05}s`;
          return (
            <div
              key={i}
              className={`chat-msg flex max-w-[82%] flex-col gap-0.5 rounded-2xl px-3.5 py-2 ${
                mine ? "self-end rounded-br-sm bg-sukuma" : "self-start rounded-bl-sm bg-[#efe9df]"
              }`}
              style={{ ["--d" as string]: delay }}
            >
              {!mine && <span className="text-xs font-bold text-cup-ridge">{msg.from}</span>}
              {"typing" in msg ? (
                <span className="typing flex items-center gap-1 py-1.5 text-usiku" aria-label="typing">
                  <i />
                  <i />
                  <i />
                </span>
              ) : (
                <>
                  <span>{msg.text}</span>
                  <span className="self-end text-[10px] text-usiku/75">{msg.time}</span>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
