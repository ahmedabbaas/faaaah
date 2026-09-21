"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

function formatTime(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat(undefined, {
    weekday: "short",
    day: "2-digit",
    month: "short",
  }).format(date);
}

export default function AccountHud() {
  const { user, isLoaded } = useUser();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  if (!isLoaded) {
    return <div className="accountHud accountLoading"><span className="accountPulse" /></div>;
  }

  if (!user) {
    return <a className="signButton" href="/sign-in">Sign In</a>;
  }

  const name = user.fullName || user.firstName || "GlobalPedia User";
  const email = user.primaryEmailAddress?.emailAddress || "Account";

  return (
    <div className="accountHud">
      <div className="accountIdentity">
        <div className="accountAvatar">
          <img src={user.imageUrl} alt="" />
        </div>
        <div className="accountText">
          <strong>{name}</strong>
          <span>{email}</span>
        </div>
      </div>
      <div className="accountClock">
        <strong>{formatTime(now)}</strong>
        <span>{formatDate(now)} · Local</span>
      </div>
      <UserButton />    </div>
  );
}
