import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ContactCTA from "@/components/ContactCTA";
import { trackFunnelAction } from "@/lib/analytics";
import "./VideoSection.css";

const VideoSection = () => {
  const { t } = useTranslation();
  const video = useRef<HTMLVideoElement>(null);
  const startedEvent = useRef(false);
  const completedEvent = useRef(false);
  const [started, setStarted] = useState(false);
  const [failed, setFailed] = useState(false);
  const play = () => {
    const player = video.current;
    if (!player) return;
    setFailed(false);
    if (!player.getAttribute("src")) player.src = "/video/overview-ro.mp4";
    player.play().then(() => { setStarted(true); player.focus(); }).catch(() => setFailed(true));
  };
  return (
    <div className="leads-block" id="presentation">
      <header className="leads-head">
        <h2 className="leads-title">{t("vsl.title")}</h2>
        <p className="leads-sub">{t("vsl.lead")}</p>
      </header>
      <div className="vsl-frame">
        <video ref={video} controls={started} playsInline preload="none" poster="/video/overview-poster.webp"
          width={1280} height={720} aria-label={t("vsl.label")} tabIndex={started ? 0 : -1}
          onPlay={() => { if (!startedEvent.current) { trackFunnelAction("video_start"); startedEvent.current = true; } }}
          onEnded={() => { if (!completedEvent.current) { trackFunnelAction("video_complete"); completedEvent.current = true; } }}
          onError={() => setFailed(true)}>
          <track kind="captions" src="/video/overview-ro.vtt" srcLang="ro" label="Română" default />
        </video>
        {!started && <button className="vsl-play" type="button" onClick={play} aria-label={t("vsl.play")}>
          <span className="vsl-play-icon" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="m9 5 11 7-11 7z" /></svg></span>
          <span>{t("vsl.play")}<small>{t("vsl.duration")}</small></span>
        </button>}
      </div>
      {failed && <p className="funnel-note vsl-error" role="status">{t("vsl.error")}</p>}
      <div className="vsl-followup">
        <details className="vsl-transcript">
          <summary>{t("vsl.transcript_label")}</summary>
          <div lang="ro">{(t("vsl.transcript", { returnObjects: true }) as string[]).map(line => <p key={line}>{line}</p>)}</div>
        </details>
        <ContactCTA mode="modal"><button className="btn btn-primary" type="button">{t("offer.cta")}</button></ContactCTA>
      </div>
    </div>
  );
};
export default VideoSection;
