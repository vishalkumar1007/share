import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { api, buildChatUrl } from "../../api/client.js";
import { GlassCard, LiveBadge } from "../../components/ui/Primitives.jsx";
import "./LiveChat.css";

const LS = {
  remember: "mv_chat_remember",
  guestToken: "mv_chat_guest_token",
  displayName: "mv_chat_display_name",
  room: "mv_chat_room",
};

const readRemembered = () => localStorage.getItem(LS.remember) === "1";

const ensureSession = async (displayName) => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) return { kind: "user", token: authToken };

  const stored = readRemembered()
    ? localStorage.getItem(LS.guestToken)
    : sessionStorage.getItem("chatGuestToken");
  if (stored) return { kind: "guest", token: stored };

  const { ok, data } = await api.createChatSession({
    displayName: displayName || undefined,
  });
  if (!ok || !data?.token) {
    throw new Error(data?.msg || data?.message || "Could not start session");
  }
  if (readRemembered()) {
    localStorage.setItem(LS.guestToken, data.token);
    if (data.displayName) localStorage.setItem(LS.displayName, data.displayName);
  } else {
    sessionStorage.setItem("chatGuestToken", data.token);
  }
  return { kind: "guest", token: data.token, displayName: data.displayName };
};

const LiveChat = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const prefill = (params.get("room") || "").toUpperCase();

  const [displayName, setDisplayName] = useState(
    () => localStorage.getItem(LS.displayName) || ""
  );
  const [remember, setRemember] = useState(readRemembered);
  const [mode, setMode] = useState("incognito");
  const [title, setTitle] = useState("");
  const [joinCode, setJoinCode] = useState(prefill);
  const [roomCode, setRoomCode] = useState("");
  const [roomMeta, setRoomMeta] = useState({
    title: "",
    mode: "incognito",
    isCreator: false,
  });
  const [members, setMembers] = useState([]);
  const [maxMembers, setMaxMembers] = useState(10);
  const [messages, setMessages] = useState([]);
  const [selfId, setSelfId] = useState("");
  const [draft, setDraft] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [emails, setEmails] = useState([]);
  const [busy, setBusy] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const sinceRef = useRef("");
  const listRef = useRef(null);
  const composerRef = useRef(null);
  const pollInFlight = useRef(false);
  const sendingRef = useRef(false);

  const inRoom = Boolean(roomCode);

  useEffect(() => {
    if (!prefill) return;
    (async () => {
      try {
        await ensureSession(displayName);
        await joinRoom(prefill);
      } catch (error) {
        toast.error(error?.message || "Could not join");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!roomCode) return undefined;
    let cancelled = false;

    const tick = async () => {
      if (cancelled || pollInFlight.current) return;
      pollInFlight.current = true;
      try {
        const { ok, data, status } = await api.listChatMessages(
          roomCode,
          sinceRef.current || undefined
        );
        if (cancelled) return;
        if (status === 404) {
          toast("Room ended");
          resetRoom();
          return;
        }
        if (status === 429) return;
        if (!ok) return;

        const incoming = data.messages || [];
        if (incoming.length) {
          setMessages((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            const next = [...prev];
            incoming.forEach((m) => {
              if (m?.id && !ids.has(m.id)) next.push(m);
            });
            return next;
          });
          const last = incoming[incoming.length - 1];
          if (last?.createdAt) sinceRef.current = last.createdAt;
        }
        if (data.members) setMembers(data.members);
        if (data.maxMembers) setMaxMembers(data.maxMembers);
        if (typeof data.isCreator === "boolean") {
          setRoomMeta((m) => ({
            ...m,
            isCreator: data.isCreator,
            mode: data.mode || m.mode,
            title: data.title || m.title,
          }));
        }
      } finally {
        pollInFlight.current = false;
      }
    };

    tick();
    const id = setInterval(tick, 3000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomCode]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
  }, [messages]);

  const seatsLabel = useMemo(
    () => `${members.length}/${maxMembers}`,
    [members.length, maxMembers]
  );

  const applyRemember = () => {
    if (remember) {
      localStorage.setItem(LS.remember, "1");
      if (displayName) localStorage.setItem(LS.displayName, displayName);
    } else {
      localStorage.removeItem(LS.remember);
      localStorage.removeItem(LS.guestToken);
      localStorage.removeItem(LS.displayName);
      localStorage.removeItem(LS.room);
    }
  };

  const resetRoom = () => {
    setRoomCode("");
    setMembers([]);
    setMessages([]);
    setSelfId("");
    sinceRef.current = "";
    localStorage.removeItem(LS.room);
    setShowInvite(false);
  };

  const createRoom = async () => {
    if (mode === "saved" && !localStorage.getItem("authToken")) {
      toast.error("Sign in to save chat history");
      navigate(`/auth?next=${encodeURIComponent("/chat")}`);
      return;
    }
    setBusy(true);
    try {
      applyRemember();
      await ensureSession(displayName.trim());
      const { ok, data } = await api.createChatRoom({
        title: title.trim(),
        mode,
      });
      if (!ok) {
        toast.error(data?.msg || data?.message || "Create failed");
        return;
      }
      const code = data.roomCode;
      const joined = await api.joinChatRoom(code);
      if (!joined.ok) {
        toast.error(joined.data?.msg || "Could not enter room");
        return;
      }
      enterFromAck(joined.data);
      setShowInvite(true);
      toast.success(`Room ${code} ready`);
    } catch (error) {
      toast.error(error?.message || "Create failed");
    } finally {
      setBusy(false);
    }
  };

  const enterFromAck = (data) => {
    setRoomCode(data.roomCode);
    setMembers(data.members || []);
    setMessages(data.messages || []);
    setMaxMembers(data.maxMembers || 10);
    setSelfId(data.participantId || "");
    setRoomMeta({
      title: data.title || "",
      mode: data.mode || "incognito",
      isCreator: Boolean(data.isCreator),
    });
    const last = (data.messages || [])[data.messages.length - 1];
    sinceRef.current = last?.createdAt || "";
    if (readRemembered()) localStorage.setItem(LS.room, data.roomCode);
  };

  const joinRoom = async (codeArg) => {
    const code = String(codeArg || joinCode || "")
      .toUpperCase()
      .trim();
    if (!code) {
      toast.error("Enter a room code");
      return;
    }
    setBusy(true);
    try {
      applyRemember();
      await ensureSession(displayName.trim());
      const { ok, data } = await api.joinChatRoom(code);
      if (!ok) {
        toast.error(data?.msg || data?.message || "Join failed");
        return;
      }
      enterFromAck(data);
      toast.success(`Joined ${code}`);
    } catch (error) {
      toast.error(error?.message || "Join failed");
    } finally {
      setBusy(false);
    }
  };

  const send = async () => {
    if (!draft.trim() || !roomCode || sendingRef.current) return;
    const text = draft.trim();
    sendingRef.current = true;
    setDraft("");
    if (composerRef.current) composerRef.current.style.height = "";
    try {
      const { ok, data, status } = await api.sendChatMessage(roomCode, text);
      if (!ok) {
        toast.error(
          status === 429
            ? "Sending too fast — wait a moment"
            : data?.msg || data?.message || "Send failed"
        );
        setDraft(text);
        return;
      }
      const message = data.message || data.data?.message;
      if (message) {
        setMessages((prev) => {
          if (prev.some((m) => m.id === message.id)) return prev;
          return [...prev, message];
        });
        sinceRef.current = message.createdAt || sinceRef.current;
        if (message.userId) setSelfId(String(message.userId));
      }
    } finally {
      sendingRef.current = false;
    }
  };

  const leave = async () => {
    if (roomCode) await api.leaveChatRoom(roomCode);
    resetRoom();
  };

  const endRoom = async () => {
    if (!roomCode) return;
    const { ok, data } = await api.endChatRoom(roomCode);
    if (!ok) {
      toast.error(data?.msg || "Could not end room");
      return;
    }
    toast.success("Room ended — data wiped");
    resetRoom();
  };

  const addEmail = () => {
    const value = emailInput.trim().toLowerCase();
    if (!value.includes("@")) {
      toast.error("Enter a valid email");
      return;
    }
    if (!emails.includes(value) && emails.length < 10) {
      setEmails((prev) => [...prev, value]);
    }
    setEmailInput("");
  };

  const sendInvites = async () => {
    if (!emails.length) return;
    const { ok, data } = await api.inviteChat({ roomCode, emails });
    if (!ok) {
      toast.error(data?.msg || "Invite failed — copy the link instead");
      return;
    }
    toast.success(data.msg || "Invites sent");
  };

  const copyCode = async () => {
    await navigator.clipboard.writeText(roomCode);
    toast.success("Code copied");
  };

  const copyLink = async () => {
    await navigator.clipboard.writeText(buildChatUrl(roomCode));
    toast.success("Link copied");
  };

  if (!inRoom) {
    return (
      <div className="chat_quick">
        <GlassCard className="chat_wizard_panel ws_board">
          <h2>Live chat</h2>
          <p className="chat_wizard_sub">
            Create a room or join with a code. Up to 10 people. No login required.
          </p>

          <label className="chat_field">
            Your name
            <input
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value.slice(0, 28))}
              placeholder="Alex"
              maxLength={28}
            />
          </label>
          <label className="chat_check">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me on this device
          </label>

          <div className="chat_quick_split">
            <div className="chat_quick_col">
              <h3>Create</h3>
              <label className="chat_field">
                Room title (optional)
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                  placeholder="Quick sync"
                />
              </label>
              <div className="chat_mode_grid">
                <button
                  type="button"
                  className={`chat_mode ${mode === "incognito" ? "is-active" : ""}`}
                  onClick={() => setMode("incognito")}
                >
                  <strong>Incognito</strong>
                  <span>Wipe when creator ends</span>
                </button>
                <button
                  type="button"
                  className={`chat_mode ${mode === "saved" ? "is-active" : ""}`}
                  onClick={() => setMode("saved")}
                >
                  <strong>Save</strong>
                  <span>Needs login</span>
                </button>
              </div>
              <button
                type="button"
                className="dash_btn dash_btn--primary"
                disabled={busy}
                onClick={createRoom}
              >
                {busy ? "Creating…" : "Create room"}
              </button>
            </div>

            <div className="chat_quick_col">
              <h3>Join</h3>
              <label className="chat_field">
                Room code
                <input
                  value={joinCode}
                  onChange={(e) =>
                    setJoinCode(
                      e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)
                    )
                  }
                  placeholder="CODE"
                  maxLength={8}
                />
              </label>
              <button
                type="button"
                className="dash_btn dash_btn--primary"
                disabled={busy || !joinCode.trim()}
                onClick={() => joinRoom()}
              >
                {busy ? "Joining…" : "Join room"}
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="chat_layout">
      <GlassCard className="chat_side ws_board">
        <div className="chat_side_head">
          <div>
            <strong>Room controls</strong>
            <p className="chat_side_sub">Invite people or leave the room when you are finished.</p>
          </div>
        </div>
        <button
          type="button"
          className="dash_btn dash_btn--ghost chat_invite_toggle"
          onClick={() => setShowInvite((v) => !v)}
        >
          {showInvite ? "Close invite" : "Invite people"}
        </button>

        {showInvite ? (
          <div className="chat_invite_box">
            <div className="chat_invite_row">
              <input
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addEmail())}
                placeholder="email@example.com"
              />
              <button type="button" className="dash_btn dash_btn--ghost" onClick={addEmail}>
                Add
              </button>
            </div>
            <div className="chat_email_chips">
              {emails.map((email) => (
                <button
                  key={email}
                  type="button"
                  className="chat_chip"
                  onClick={() => setEmails((prev) => prev.filter((e) => e !== email))}
                >
                  {email} ×
                </button>
              ))}
            </div>
            <button
              type="button"
              className="dash_btn dash_btn--primary"
              onClick={sendInvites}
              disabled={!emails.length}
            >
              Send invites
            </button>
          </div>
        ) : null}

        <div className="chat_members">
          <span className="dash_panel_kicker">Members</span>
          {members.map((m) => (
            <div key={String(m.userId)} className="chat_member">
              <span className="chat_member_dot" />
              <span>{m.displayName}</span>
            </div>
          ))}
        </div>

        <div className="chat_wizard_actions">
          <button type="button" className="dash_btn dash_btn--ghost" onClick={leave}>
            Leave
          </button>
          {roomMeta.isCreator ? (
            <button type="button" className="dash_btn dash_btn--danger" onClick={endRoom}>
              End & wipe
            </button>
          ) : null}
        </div>
      </GlassCard>

      <GlassCard className="chat_thread ws_board">
        <header className="chat_room_header">
          <div>
            <div className="chat_room_title_row">
              <h2>{roomMeta.title || "Live room"}</h2>
              <LiveBadge />
            </div>
            <p>#{roomCode} · {roomMeta.mode} · {seatsLabel} in room</p>
          </div>
          <div className="chat_room_actions">
            <button type="button" className="dash_btn dash_btn--ghost" onClick={copyCode}>Copy code</button>
            <button type="button" className="dash_btn dash_btn--primary" onClick={copyLink}>Copy invite link</button>
          </div>
        </header>
        <div className="chat_messages" ref={listRef}>
          {messages.length === 0 ? (
            <div className="chat_empty chat_empty--inline">Say hello — messages sync from the room every few seconds.</div>
          ) : (
            messages.map((m) => {
              const mine = selfId && String(m.userId) === String(selfId);
              return (
                <div key={m.id} className={`chat_bubble ${mine ? "chat_bubble--mine" : ""}`}>
                  <span className="chat_bubble_name">{m.displayName}</span>
                  <p>{m.text}</p>
                </div>
              );
            })
          )}
        </div>
        <form
          className="chat_composer"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <label className="chat_composer_field">
            <textarea
              ref={composerRef}
              aria-label="Message"
              value={draft}
              rows={1}
              onChange={(e) => {
                setDraft(e.target.value);
                const el = e.target;
                el.style.height = "0px";
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              placeholder="Write a message…"
              maxLength={2000}
            />
          </label>
          <button type="submit" className="dash_btn dash_btn--primary chat_composer_send" disabled={!draft.trim()}>
            Send
          </button>
        </form>
      </GlassCard>
    </div>
  );
};

export default LiveChat;
