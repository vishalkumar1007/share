import { useEffect } from "react";
import { motion as Motion } from "framer-motion";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../hooks/useAuth.js";
import { PortalBackdrop } from "../../components/ui/Primitives.jsx";
import "./Landing.css";

const TextIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ImageIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
    <circle cx="9" cy="9" r="2" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const FileIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const AudioIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const ShieldIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
  </svg>
);

const ZapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);

const ChatIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const ArrowIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" /><path d="m13 6 6 6-6 6" />
  </svg>
);

const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const services = [
  { key: "text", title: "Text workspace", label: "TEXT", desc: "Send notes, links, code, and quick instructions without opening another app.", points: ["Paste or write directly", "Private link + QR code"], icon: <TextIcon /> },
  { key: "image", title: "Image workspace", label: "IMAGE", desc: "Hand over screenshots and visuals with a clean preview for the receiver.", points: ["Drag and drop upload", "Open or download on any device"], icon: <ImageIcon /> },
  { key: "file", title: "File workspace", label: "FILE", desc: "Move documents, PDFs, archives, and other files through a temporary portal.", points: ["Expiry controls included", "One secure share code"], icon: <FileIcon /> },
  { key: "audio", title: "Audio workspace", label: "AUDIO", desc: "Share voice notes, clips, and recordings with a built-in player on receive.", points: ["Audio preview before send", "Mobile-ready listening"], icon: <AudioIcon /> },
  { key: "chat", title: "Live rooms", label: "CHAT", desc: "Create a lightweight private room when a link alone is not enough.", points: ["Invite up to 10 people", "Guests can join by code"], icon: <ChatIcon /> },
];

const pillars = [
  {
    title: "Instant portals",
    desc: "Drop content, get a Multiverse code, link, and QR in one tap — no friction.",
    icon: <ZapIcon />,
  },
  {
    title: "Privacy & expiry",
    desc: "Public or incognito (one view). Choose 1 hour, 24 hours, or 7 days.",
    icon: <ShieldIcon />,
  },
  {
    title: "Live chat",
    desc: "Private rooms for up to 10 people. Guests welcome. Incognito wipe or saved history when signed in.",
    icon: <ChatIcon />,
  },
];

const audiences = [
  { title: "Teams", desc: "Pass snippets and files without Slack clutter." },
  { title: "Creators", desc: "Ship previews and voice notes with a LIVE countdown." },
  { title: "Travelers", desc: "Bridge devices with a QR — phone to laptop in seconds." },
];

const Landing = () => {
  const navigator = useNavigate();
  const { isAuthenticated } = useAuth();
  const [params] = useSearchParams();

  useEffect(() => {
    const code = params.get("multiversecode");
    if (code) {
      navigator(
        `/text?mode=receive&multiversecode=${encodeURIComponent(code)}`,
        { replace: true }
      );
    }
  }, [params, navigator]);

  useEffect(() => {
    const revealEls = document.querySelectorAll("[data-reveal]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const openService = (key) => {
    if (key === "chat") {
      navigator("/chat");
      return;
    }
    navigator(`/${key}`);
  };

  return (
    <div className="landing_main">
      <Navbar />

      <PortalBackdrop>
        <section id="landing-hero" className="landing_hero">
          <div className="landing_hero_content">
            <div className="landing_hero_grid">
              <Motion.div
                className="landing_hero_text"
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75 }}
              >
                <span className="landing_hero_badge">
                  <span className="landing_hero_badge_dot"></span>
                  Secure handoffs, without the account wall
                </span>

                <h1 className="landing_title">Share what matters. <em>Leave nothing behind.</em></h1>

                <p className="landing_subtitle">
                  Multiverse is a focused transfer space for text, media, files, and live conversations. Create a private portal, share its link or QR, and let it close on your terms.
                </p>

                <div className="landing_hero_actions">
                  {isAuthenticated ? (
                    <button
                      className="landing_btn landing_btn--primary"
                      onClick={() => navigator("/dashboard")}
                    >
                      Open workspace
                    </button>
                  ) : (
                    <button
                      className="landing_btn landing_btn--primary"
                      onClick={() => navigator("/text")}
                    >
                      Create a portal
                    </button>
                  )}
                  <button
                    className="landing_btn landing_btn--ghost"
                    onClick={() => scrollToSection("landing-services")}
                  >
                    Explore services
                  </button>
                </div>
                <div className="landing_hero_proof" aria-label="Product benefits">
                  <span><CheckIcon /> No installation</span>
                  <span><CheckIcon /> Link or QR access</span>
                  <span><CheckIcon /> You control expiry</span>
                </div>
              </Motion.div>

              <Motion.div
                className="landing_hero_visual"
                aria-hidden="true"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.85, delay: 0.12 }}
              >
                <div className="landing_hero_card">
                  <div className="hero_card_top">
                    <span className="hero_card_type">
                      <span className="hero_card_type_icon">
                        <TextIcon />
                      </span>
                      Text Multiverse
                    </span>
                    <span className="hero_card_live">LIVE</span>
                  </div>
                  <div className="hero_card_code">#AB12X</div>
                  <div className="hero_card_body">
                    <div className="hero_card_qr">
                      <span className="hero_card_qr_finder hero_card_qr_finder--tl"></span>
                      <span className="hero_card_qr_finder hero_card_qr_finder--tr"></span>
                      <span className="hero_card_qr_finder hero_card_qr_finder--bl"></span>
                    </div>
                    <div className="hero_card_info">
                      <span className="hero_card_label">SHARE LINK</span>
                      <span className="hero_card_link">multiverse.v/AB12X</span>
                      <button type="button" className="hero_card_copy" tabIndex={-1}>
                        Copy link
                      </button>
                    </div>
                  </div>
                </div>
                <span className="hero_card_float hero_card_float--1">
                  <span className="hero_card_float_dot" />
                  Link created
                </span>
                <span className="hero_card_float hero_card_float--2">
                  <span className="hero_card_float_dot" />
                  Scan to receive
                </span>
              </Motion.div>
            </div>
          </div>
        </section>
      </PortalBackdrop>

      <section id="landing-services" className="landing_section" data-reveal>
        <div className="landing_section_head">
          <span className="landing_section_kicker">One app. Five focused spaces.</span>
          <h2 className="landing_section_title">Choose the right workspace for the handoff.</h2>
          <p className="landing_section_desc">
            Every service has its own send and receive experience—so text stays simple, files stay clear, and conversations remain live.
          </p>
        </div>
        <div className="landing_services_grid">
          {services.map((s, i) => (
            <Motion.button
              type="button"
              key={s.key}
              className="landing_service_card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              onClick={() => openService(s.key)}
            >
              <span className="landing_service_card_top">
                <span className="landing_service_icon">{s.icon}</span>
                <span className="landing_service_label">{s.label}</span>
              </span>
              <span className="landing_service_title">{s.title}</span>
              <span className="landing_service_desc">{s.desc}</span>
              <span className="landing_service_points">
                {s.points.map((point) => <span key={point}><CheckIcon />{point}</span>)}
              </span>
              <span className="landing_service_open">Open workspace <ArrowIcon /></span>
            </Motion.button>
          ))}
        </div>
      </section>

      <section id="landing-what" className="landing_section" data-reveal>
        <div className="landing_section_head">
          <span className="landing_section_kicker">Made for the moment between devices</span>
          <h2 className="landing_section_title">The fast lane for content that should not live forever.</h2>
          <p className="landing_section_desc">
            No project setup, no inbox clutter, no forced sign-up for the people receiving your portal.
          </p>
        </div>
        <div className="landing_pillars">
          {pillars.map((p) => (
            <div className="landing_pillar" key={p.title} data-reveal>
              <span className="landing_pillar_icon">{p.icon}</span>
              <h3 className="landing_pillar_title">{p.title}</h3>
              <p className="landing_pillar_desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing_section landing_control_section" data-reveal>
        <div className="landing_control_copy">
          <span className="landing_section_kicker">Control is built in</span>
          <h2 className="landing_section_title">A link that behaves like a private handoff.</h2>
          <p className="landing_section_desc">Decide who can open a portal and how long it stays available before you send it.</p>
          <div className="landing_control_list">
            <span><CheckIcon /><strong>Public portal</strong><small>Anyone with the link or QR can open it during its active window.</small></span>
            <span><CheckIcon /><strong>Incognito portal</strong><small>Designed for one viewing session, then it is no longer available.</small></span>
            <span><CheckIcon /><strong>Expiry choices</strong><small>Set a short handoff window or keep it alive for up to seven days.</small></span>
          </div>
        </div>
        <div className="landing_control_visual" aria-hidden="true">
          <div className="landing_control_window">
            <div className="landing_control_window_head"><span>Portal settings</span><span className="landing_control_status">Ready to share</span></div>
            <div className="landing_control_row"><span>Visibility</span><strong>Incognito</strong></div>
            <div className="landing_control_row"><span>Available for</span><strong>24 hours</strong></div>
            <div className="landing_control_rule" />
            <div className="landing_control_share"><span>Share code</span><strong>#MV28K</strong><span className="landing_control_copy_button">Copy link</span></div>
          </div>
        </div>
      </section>

      <section id="landing-how" className="landing_section" data-reveal>
        <div className="landing_section_head">
          <span className="landing_section_kicker">The handoff, simplified</span>
          <h2 className="landing_section_title">From your screen to theirs in three clear steps.</h2>
          <p className="landing_section_desc">The recipient does not need to make an account or install anything.</p>
        </div>
        <div className="landing_steps">
          <div className="landing_step" data-reveal>
            <span className="landing_step_num">01</span>
            <span className="landing_step_icon"><TextIcon /></span>
            <h3 className="landing_step_title">Create a portal</h3>
            <p className="landing_step_desc">
              Choose a dedicated workspace, add your content, then choose public or incognito access.
            </p>
          </div>
          <div className="landing_step" data-reveal>
            <span className="landing_step_num">02</span>
            <span className="landing_step_icon"><ImageIcon /></span>
            <h3 className="landing_step_title">Share link + QR</h3>
            <p className="landing_step_desc">
              Get one clean URL, a memorable code, and a scannable QR for nearby devices.
            </p>
          </div>
          <div className="landing_step" data-reveal>
            <span className="landing_step_num">03</span>
            <span className="landing_step_icon"><AudioIcon /></span>
            <h3 className="landing_step_title">Receive or chat</h3>
            <p className="landing_step_desc">
              The recipient opens the portal in a browser, downloads or copies, then you are done.
            </p>
          </div>
        </div>
      </section>

      <section id="landing-audience" className="landing_section" data-reveal>
        <div className="landing_section_head">
          <span className="landing_section_kicker">Built for real handoffs</span>
          <h2 className="landing_section_title">Useful at work, on the move, and between your own devices.</h2>
          <p className="landing_section_desc">
            A deliberate alternative to attachments, chat clutter, and permanent public links.
          </p>
        </div>
        <div className="landing_audience" role="list">
          {audiences.map((a) => (
            <div className="landing_audience_item" role="listitem" key={a.title}>
              <h3>{a.title}</h3>
              <p>{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="landing-cta" className="landing_cta_band" data-reveal>
        <div className="landing_cta_inner">
          <h2 className="landing_cta_title">Your next handoff can be simpler.</h2>
          <p className="landing_cta_desc">
            Start with a portal now. Create an account later if you want history and a personal workspace.
          </p>
          <div className="landing_cta_actions">
            <button
              className="landing_btn landing_btn--primary"
              onClick={() => navigator("/text")}
            >
              Create a portal
            </button>
            <button
              className="landing_btn landing_btn--ghost"
              onClick={() => navigator("/chat")}
            >
              Start live chat
            </button>
            <button
              className="landing_btn landing_btn--ghost"
              onClick={() => navigator(isAuthenticated ? "/dashboard" : "/auth")}
            >
              {isAuthenticated ? "Go to dashboard" : "Sign in"}
            </button>
          </div>
        </div>
      </section>

      <footer className="landing_footer" data-reveal>
        <span className="landing_footer_brand">Multiverse · private browser handoffs</span>
        <span className="landing_footer_links">
          <button type="button" onClick={() => scrollToSection("landing-hero")}>
            Back to top
          </button>
          <button type="button" className="landing_footer_admin" onClick={() => navigator("/admin")}>
            Admin login
          </button>
        </span>
      </footer>
    </div>
  );
};

export default Landing;
