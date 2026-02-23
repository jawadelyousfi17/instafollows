"use client";

import { useState, useEffect } from "react";
import { Slider } from "@/components/ui/slider";
import { Progress } from "@/components/ui/progress";
import confetti from "canvas-confetti";

export default function Home() {
  const [username, setUsername] = useState("");
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [profile, setProfile] = useState<{ username: string } | null>(null);
  const [error, setError] = useState("");

  const [followersAmount, setFollowersAmount] = useState([1000]); // 1k default
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostProgress, setBoostProgress] = useState(0);
  const [boostComplete, setBoostComplete] = useState(false);
  const [verificationState, setVerificationState] = useState<
    "idle" | "verifying" | "failed"
  >("idle");

  const isInstagramInAppBrowser = () => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent || navigator.vendor || (window as any).opera;
    return ua.indexOf("Instagram") > -1;
  };

  const openInExternalBrowser = (url: string) => {
    if (typeof window === "undefined") return;

    const ua = navigator.userAgent || "";
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua);

    if (isAndroid) {
      const cleanUrl = url.replace(/^https?:\/\//, "");
      const fallback = encodeURIComponent(url);
      window.location.href = `intent://${cleanUrl}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
      return;
    }

    if (isIOS) {
      const cleanUrl = url.replace(/^https?:\/\//, "");
      window.location.href = `googlechrome://${cleanUrl}`;
      setTimeout(() => {
        window.location.href = `x-safari-https://${cleanUrl}`;
      }, 250);
      setTimeout(() => {
        window.location.href = url;
      }, 1200);
      return;
    }

    const opened = window.open(url, "_blank", "noopener,noreferrer");
    if (!opened || opened.closed || typeof opened.closed === "undefined") {
      window.location.href = url;
    }
  };

  useEffect(() => {
    if (isInstagramInAppBrowser()) {
      openInExternalBrowser(window.location.href);
    }
  }, []);

  const handleSearch = async () => {
    if (!username.trim()) return;

    setLoadingProfile(true);
    setError("");
    setProfile(null);
    setBoostComplete(false);
    setFollowersAmount([1000]);
    setIsBoosting(false);
    setBoostProgress(0);
    setVerificationState("idle");

    try {
      // Simulate network request
      await new Promise((resolve) => setTimeout(resolve, 800));
      setProfile({ username });
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoadingProfile(false);
    }
  };

  const handleBoost = () => {
    if (!profile) return;
    setIsBoosting(true);
    setBoostProgress(0);
  };

  // Progress simulation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isBoosting && verificationState === "idle") {
      interval = setInterval(() => {
        setBoostProgress((prev) => {
          // Non-linear progress simulation
          const increment = prev > 85 ? 0.5 : prev > 60 ? 1 : 3;
          const next = prev + increment;

          if (next >= 95) {
            clearInterval(interval);
            setVerificationState("verifying");
            return 95;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isBoosting, verificationState]);

  useEffect(() => {
    if (verificationState === "verifying") {
      const timer = setTimeout(() => {
        setVerificationState("failed");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [verificationState]);

  const triggerConfetti = () => {
    const end = Date.now() + 3 * 1000;
    const colors = ["#0df259", "#ffffff"];

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(num);
  };

  return (
    <div className="flex flex-col min-h-screen font-display overflow-x-hidden bg-[#f5f8f6] dark:bg-[#102216]">
      {/* Top Navigation */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-[#22492f] px-4 py-3 md:px-6 md:py-4 lg:px-10 sticky top-0 z-50 bg-[#f5f8f6]/80 dark:bg-[#102216]/80 backdrop-blur-md">
        <div className="flex items-center gap-2 md:gap-4">
          <div className="size-6 md:size-8 text-[#0df259]">
            <span className="material-symbols-outlined text-3xl md:text-4xl">
              rocket_launch
            </span>
          </div>
          <h2 className="text-slate-900 dark:text-white text-lg md:text-xl font-bold leading-tight tracking-[-0.015em]">
            Account Booster
          </h2>
        </div>
        <div className="hidden md:flex flex-1 justify-end gap-8 items-center text-sm font-medium">
          <div className="flex items-center gap-9">
            <a
              href="#"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0df259] dark:hover:text-[#0df259] transition-colors"
            >
              Features
            </a>
            <a
              href="#"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0df259] dark:hover:text-[#0df259] transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-slate-600 dark:text-slate-300 hover:text-[#0df259] dark:hover:text-[#0df259] transition-colors"
            >
              Login
            </a>
          </div>
          <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-[#0df259] hover:bg-[#0df259]/90 transition-colors text-[#102316] font-bold tracking-[0.015em]">
            <span className="truncate">Get Started</span>
          </button>
        </div>
        {/* Mobile Menu Icon */}
        <button className="md:hidden text-slate-900 dark:text-white">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col items-center justify-center px-0 py-6 md:py-10 lg:py-20 relative">
        {/* Abstract Background Glows */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#0df259]/10 rounded-full blur-[128px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] pointer-events-none"></div>

        <div className="w-full max-w-[960px] flex flex-col items-center gap-8 md:gap-12 z-10">
          {!profile && !boostComplete && (
            /* STAGE 1: SEARCH */
            <>
              {/* Hero Text */}
              <div className="flex flex-col gap-2 md:gap-6 text-center max-w-3xl animate-fade-in-up">
                <div className="inline-flex items-center justify-center gap-1.5 md:gap-2 px-2.5 py-1 md:px-4 md:py-2 rounded-full bg-[#183422] border border-[#22492f] w-fit mx-auto mb-1 md:mb-2">
                  <span className="relative flex h-2 w-2 md:h-2.5 md:w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0df259] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 md:h-2.5 md:w-2.5 bg-[#0df259]"></span>
                  </span>
                  <span className="text-[#0df259] text-[9px] md:text-xs font-bold uppercase tracking-wide">
                    System Operational
                  </span>
                </div>
                <h1 className="text-slate-900 dark:text-white text-3xl md:text-5xl lg:text-7xl font-black leading-[1.1] tracking-[-0.033em]">
                  Grow your audience{" "}
                  <span className="text-[#0df259]">exponentially</span>
                </h1>
                <p className="text-slate-600 dark:text-slate-300 text-sm md:text-lg lg:text-xl font-normal leading-relaxed max-w-xl md:max-w-2xl mx-auto px-4">
                  The safest, most advanced engine for Instagram growth. 100%
                  risk-free analysis.
                </p>
              </div>

              {/* Search Component */}
              <div className="w-full max-w-[90%] md:max-w-[580px] relative group">
                {/* Glowing border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-[#0df259] to-blue-500 rounded-full opacity-30 group-hover:opacity-70 transition duration-500 blur"></div>
                <div className="relative flex items-center bg-white dark:bg-[#183422] border border-slate-200 dark:border-[#22492f] rounded-full shadow-2xl p-1 md:p-2 transition-all duration-300 focus-within:ring-2 focus-within:ring-[#0df259]/50 focus-within:border-[#0df259]">
                  <div className="pl-3 pr-1 md:pl-4 md:pr-2 text-slate-400 dark:text-slate-500">
                    <span className="material-symbols-outlined text-xl md:text-2xl">
                      alternate_email
                    </span>
                  </div>
                  <input
                    aria-label="Instagram Username"
                    className="w-full bg-transparent border-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-0 text-base md:text-lg py-2 px-1 md:py-3 md:px-2 font-medium"
                    placeholder="Enter Instagram Username..."
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    disabled={loadingProfile}
                  />
                  <button
                    onClick={handleSearch}
                    disabled={loadingProfile || !username.trim()}
                    className="hidden sm:flex shrink-0 items-center gap-2 bg-[#0df259] hover:bg-[#0df259]/90 disabled:opacity-70 text-[#102316] px-8 py-3 rounded-full font-bold transition-transform hover:scale-105 active:scale-95"
                  >
                    {loadingProfile ? (
                      <span className="material-symbols-outlined animate-spin text-xl">
                        progress_activity
                      </span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-xl">
                          search
                        </span>
                        <span>Start Boosting</span>
                      </>
                    )}
                  </button>
                  {/* Mobile Search Button (Icon Only) */}
                  <button
                    onClick={handleSearch}
                    disabled={loadingProfile || !username.trim()}
                    className="flex sm:hidden shrink-0 items-center justify-center bg-[#0df259] hover:bg-[#0df259]/90 disabled:opacity-70 text-[#102316] w-10 h-10 rounded-full font-bold transition-transform hover:scale-105 active:scale-95"
                  >
                    {loadingProfile ? (
                      <span className="material-symbols-outlined animate-spin text-lg">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-lg">
                        search
                      </span>
                    )}
                  </button>
                </div>
                {error && (
                  <div className="absolute top-full mt-4 w-full text-center p-3 rounded bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold animate-fade-in-up">
                    ⚠️ {error}
                  </div>
                )}
              </div>

              {/* Trust Signals */}
              <div className="flex flex-col items-center gap-4 text-center">
                <p className="text-slate-500 dark:text-[#90cba4] text-sm font-medium">
                  <span className="inline-block align-middle mr-1">
                    <span className="material-symbols-outlined text-base align-text-bottom">
                      verified_user
                    </span>
                  </span>
                  Trusted by 50,000+ accounts boosted today
                </p>
                {/* Social Proof Avatars */}
                <div className="flex items-center -space-x-3">
                  <img
                    alt="User Avatar 1"
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-[#102216]"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=64&h=64&fit=crop&crop=faces"
                  />
                  <img
                    alt="User Avatar 2"
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-[#102216]"
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=64&h=64&fit=crop&crop=faces"
                  />
                  <img
                    alt="User Avatar 3"
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-[#102216]"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=faces"
                  />
                  <img
                    alt="User Avatar 4"
                    className="w-10 h-10 rounded-full border-2 border-white dark:border-[#102216]"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=64&h=64&fit=crop&crop=faces"
                  />
                  <div className="w-10 h-10 rounded-full border-2 border-white dark:border-[#102216] bg-[#183422] flex items-center justify-center text-xs font-bold text-[#0df259]">
                    +5k
                  </div>
                </div>
              </div>
            </>
          )}

          {!boostComplete && profile && (
            /* STAGE 2: PROFILE & BOOST */
            <div className="flex flex-col items-center justify-center p-4 md:p-8 w-full max-w-4xl animate-fade-in-up">
              <div className="w-full flex flex-col gap-6 md:gap-8">
                {/* Breadcrumbs / Steps */}
                <div className="flex items-center justify-center gap-2 md:gap-3 text-xs md:text-sm font-medium text-slate-400 mb-2 md:mb-4">
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] md:text-xs">
                      1
                    </span>
                    <span>Search</span>
                  </div>
                  <span className="w-4 md:w-8 h-px bg-[#22492f]"></span>
                  <div className="flex items-center gap-1.5 md:gap-2 text-primary">
                    <span className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-primary text-[#102316] text-[10px] md:text-xs font-bold">
                      2
                    </span>
                    <span>Selection</span>
                  </div>
                  <span className="w-4 md:w-8 h-px bg-[#22492f]"></span>
                  <div className="flex items-center gap-1.5 md:gap-2">
                    <span className="flex h-5 w-5 md:h-6 md:w-6 items-center justify-center rounded-full bg-[#22492f] text-slate-400 text-[10px] md:text-xs">
                      3
                    </span>
                    <span>Processing</span>
                  </div>
                </div>

                {/* Profile Card */}
                <div className="relative overflow-hidden rounded bg-[#1a2e21] border border-[#22492f] p-5 md:p-10 shadow-2xl">
                  {/* Background decorative elements */}
                  <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>
                  <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-3xl pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col items-center gap-6 md:gap-8">
                    {!isBoosting ? (
                      <>
                        {/* Profile Header */}
                        <div className="flex flex-col items-center gap-3 md:gap-4 text-center">
                          <div className="flex flex-col items-center">
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
                              @{profile.username}
                            </h1>
                            <div className="mt-1 flex items-center gap-2 rounded-full bg-[#22492f]/50 px-3 py-1 backdrop-blur-sm">
                              <span className="h-1.5 w-1.5 md:h-2 md:w-2 rounded-full bg-primary animate-pulse"></span>
                              <span className="text-[10px] md:text-xs font-medium text-primary">
                                Profile Verified & Ready
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Follower Selector */}
                        <div className="w-full flex flex-col gap-6 pt-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-slate-300">
                              Target Growth
                            </span>
                            <span className="rounded-lg bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                              INSTANT DELIVERY
                            </span>
                          </div>

                          <div className="relative w-full px-2">
                            <Slider
                              defaultValue={[1000]}
                              max={100000}
                              min={1000}
                              step={1000}
                              value={followersAmount}
                              onValueChange={setFollowersAmount}
                              className="cursor-pointer"
                            />
                            <div className="mt-4 flex justify-between text-xs font-medium text-slate-500">
                              <span>1k</span>
                              <span>25k</span>
                              <span>50k</span>
                              <span>75k</span>
                              <span>100k</span>
                            </div>
                          </div>

                          <div className="flex flex-col items-center justify-center gap-1 py-2">
                            <span className="text-lg text-primary/80 font-medium">
                              Add approximately
                            </span>
                            <h2 className="text-5xl md:text-6xl font-bold text-primary drop-shadow-[0_0_15px_rgba(13,242,89,0.5)] tracking-tighter text-center leading-none">
                              +{(followersAmount[0] / 1000).toFixed(0)}k
                            </h2>
                            <span className="text-lg text-primary/80 font-medium uppercase tracking-widest mt-1">
                              Followers
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex w-full flex-col gap-4 pt-4">
                          <button
                            onClick={handleBoost}
                            className="group relative flex h-14 w-full items-center justify-center gap-3 rounded-full bg-primary text-lg font-bold text-[#102316] transition-all hover:bg-[#00ff55] hover:shadow-[0_0_30px_rgba(13,242,89,0.4)] hover:-translate-y-0.5 active:translate-y-0"
                          >
                            <span className="material-symbols-outlined filled">
                              bolt
                            </span>
                            <span>Start Boosting Now</span>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100 -translate-x-2">
                              <span className="material-symbols-outlined">
                                arrow_forward
                              </span>
                            </div>
                          </button>

                          <div className="flex items-center justify-center gap-6 text-xs text-slate-400">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-primary text-base">
                                lock
                              </span>
                              <span>No Password Required</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-primary text-base">
                                verified_user
                              </span>
                              <span>100% Safe</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              setProfile(null);
                              setUsername("");
                              setError("");
                            }}
                            className="mt-2 text-sm font-medium text-slate-400 hover:text-white transition-colors flex items-center justify-center gap-2"
                          >
                            <span className="material-symbols-outlined text-base">
                              arrow_back
                            </span>
                            <span>Change Username</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      /* LOADING STATE - STEP 3 DESIGN */
                      <div className="w-full flex flex-col items-center gap-6 md:gap-12 animate-fade-in-up">
                        {/* Central Processing Unit */}
                        <div className="relative w-full">
                          {/* Verification Error Card (Moved to Top) */}
                          {verificationState === "failed" && (
                            <div className="mb-6 p-4 md:p-6 rounded bg-red-500/10 border border-red-500/30 flex flex-col items-center text-center gap-4 animate-fade-in-up">
                              <span className="material-symbols-outlined text-4xl text-red-500">
                                warning
                              </span>
                              <h3 className="text-xl font-bold text-white">
                                Verification Required
                              </h3>
                              <p className="text-sm text-slate-300">
                                We need to verify that you are human first
                                please follow those steps.
                              </p>
                              <a
                                href="https://crn77.com/4/8978669"
                                // target="_blank"
                                rel="noopener noreferrer"
                                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full font-bold transition-colors"
                              >
                                Verify Now
                              </a>
                            </div>
                          )}

                          {/* Status Header */}
                          <div className="flex flex-col md:flex-row justify-between md:items-end mb-4 md:mb-6 px-1 md:px-2 gap-4 md:gap-0">
                            <div className="flex flex-col gap-1">
                              <span className="text-primary text-[10px] md:text-sm font-bold uppercase tracking-widest opacity-80">
                                Current Status
                              </span>
                              <div className="flex items-center gap-2 md:gap-3">
                                <span className="material-symbols-outlined text-primary text-xl md:text-2xl animate-spin">
                                  sync
                                </span>
                                <h2 className="text-xl md:text-4xl font-bold text-white drop-shadow-[0_0_20px_rgba(13,242,89,0.5)]">
                                  {boostProgress < 30
                                    ? "Analyzing Profile..."
                                    : boostProgress < 70
                                      ? "Queueing Resources..."
                                      : verificationState === "verifying"
                                        ? "Human Verification..."
                                        : verificationState === "failed"
                                          ? "Verification Failed"
                                          : "Injecting Followers..."}
                                </h2>
                              </div>
                            </div>
                            <div className="text-right self-end md:self-auto">
                              <span className="text-5xl md:text-7xl font-bold text-primary tabular-nums tracking-tighter drop-shadow-[0_0_20px_rgba(13,242,89,0.5)]">
                                {Math.round(boostProgress)}%
                              </span>
                            </div>
                          </div>

                          {/* Progress Bar Container */}
                          <div className="h-4 md:h-8 w-full bg-[#1a3322] rounded-full overflow-hidden border border-primary/20 relative shadow-inner">
                            {/* Moving Progress Fill */}
                            <div
                              className="h-full bg-primary relative rounded-full shadow-[0_0_20px_rgba(13,242,89,0.6)] flex items-center justify-end pr-2 overflow-hidden transition-all duration-300 ease-out"
                              style={{ width: `${boostProgress}%` }}
                            >
                              {/* Stripes pattern inside bar */}
                              <div
                                className="absolute inset-0 w-full h-full"
                                style={{
                                  backgroundImage:
                                    "linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent)",
                                  backgroundSize: "1rem 1rem",
                                }}
                              ></div>
                              {/* Leading edge highlight */}
                              <div className="h-full w-2 bg-white/50 blur-[2px] rounded-full"></div>
                            </div>
                          </div>

                          {/* Detailed Metrics / Steps */}
                          <div className="mt-4 md:mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 text-center md:text-left">
                            {/* Step 1: Analysis */}
                            <div
                              className={`p-3 md:p-5 rounded border border-primary/30 flex flex-col gap-1 md:gap-2 relative overflow-hidden group transition-all duration-500 ${boostProgress > 30 ? "bg-primary/10 opacity-50" : "bg-primary/20 shadow-[0_0_15px_rgba(13,242,89,0.15)]"}`}
                            >
                              <div className="flex items-center justify-between mb-0 md:mb-1">
                                <span className="text-[10px] md:text-xs font-bold text-primary uppercase tracking-wider">
                                  Step 01
                                </span>
                                <span className="material-symbols-outlined text-primary text-xs md:text-sm">
                                  {boostProgress > 30
                                    ? "check_circle"
                                    : "pending"}
                                </span>
                              </div>
                              <div className="text-sm md:text-lg font-bold text-white">
                                Analysis
                              </div>
                              <p className="text-[10px] md:text-xs text-slate-400">
                                Profile metrics & audience targeting
                                initialized.
                              </p>
                            </div>

                            {/* Step 2: Queueing (Active) */}
                            <div
                              className={`p-3 md:p-5 rounded border flex flex-col gap-1 md:gap-2 relative transition-all duration-500 ${boostProgress >= 30 && boostProgress < 70 ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(13,242,89,0.15)] ring-1 ring-primary/50" : "border-primary/10 bg-[#1a3322]/50 opacity-60"}`}
                            >
                              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50"></div>
                              <div className="flex items-center justify-between mb-0 md:mb-1">
                                <span
                                  className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${boostProgress >= 30 && boostProgress < 70 ? "text-white" : "text-slate-500"}`}
                                >
                                  Step 02
                                </span>
                                <span
                                  className={`material-symbols-outlined text-xs md:text-sm ${boostProgress >= 30 && boostProgress < 70 ? "text-white animate-pulse" : "text-slate-500"}`}
                                >
                                  {boostProgress > 70
                                    ? "check_circle"
                                    : "hourglass_top"}
                                </span>
                              </div>
                              <div
                                className={`text-sm md:text-lg font-bold ${boostProgress >= 30 && boostProgress < 70 ? "text-primary" : "text-slate-300"}`}
                              >
                                Queueing
                              </div>
                              <p
                                className={`text-[10px] md:text-xs ${boostProgress >= 30 && boostProgress < 70 ? "text-slate-300" : "text-slate-500"}`}
                              >
                                Allocating server resources for optimal delivery
                                speed.
                              </p>
                            </div>

                            {/* Step 3: Delivery */}
                            <div
                              className={`p-3 md:p-5 rounded border flex flex-col gap-1 md:gap-2 transition-all duration-500 ${boostProgress >= 70 && verificationState === "idle" ? "border-primary bg-primary/10 shadow-[0_0_15px_rgba(13,242,89,0.15)] ring-1 ring-primary/50" : boostProgress >= 70 ? "border-primary/30 bg-primary/10 opacity-50" : "border-[#1a3322] bg-[#1a3322]/50 opacity-60"}`}
                            >
                              <div className="flex items-center justify-between mb-0 md:mb-1">
                                <span
                                  className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${boostProgress >= 70 ? "text-white" : "text-slate-500"}`}
                                >
                                  Step 03
                                </span>
                                <span
                                  className={`material-symbols-outlined text-xs md:text-sm ${boostProgress >= 70 && verificationState === "idle" ? "text-white animate-spin" : boostProgress >= 70 ? "text-primary" : "text-slate-500"}`}
                                >
                                  {verificationState !== "idle"
                                    ? "check_circle"
                                    : "circle"}
                                </span>
                              </div>
                              <div
                                className={`text-sm md:text-lg font-bold ${boostProgress >= 70 && verificationState === "idle" ? "text-primary" : boostProgress >= 70 ? "text-white" : "text-slate-300"}`}
                              >
                                Delivery
                              </div>
                              <p
                                className={`text-[10px] md:text-xs ${boostProgress >= 70 ? "text-slate-300" : "text-slate-500"}`}
                              >
                                Executing growth patterns based on analysis.
                              </p>
                            </div>

                            {/* Step 4: Verification */}
                            <div
                              className={`p-3 md:p-5 rounded border flex flex-col gap-1 md:gap-2 transition-all duration-500 ${verificationState === "verifying" ? "border-yellow-500 bg-yellow-500/10 shadow-[0_0_15px_rgba(234,179,8,0.15)] ring-1 ring-yellow-500/50" : verificationState === "failed" ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.15)] ring-1 ring-red-500/50" : "border-[#1a3322] bg-[#1a3322]/50 opacity-60"}`}
                            >
                              <div className="flex items-center justify-between mb-0 md:mb-1">
                                <span
                                  className={`text-[10px] md:text-xs font-bold uppercase tracking-wider ${verificationState !== "idle" ? "text-white" : "text-slate-500"}`}
                                >
                                  Step 04
                                </span>
                                <span
                                  className={`material-symbols-outlined text-xs md:text-sm ${verificationState === "verifying" ? "text-yellow-500 animate-spin" : verificationState === "failed" ? "text-red-500" : "text-slate-500"}`}
                                >
                                  {verificationState === "failed"
                                    ? "error"
                                    : verificationState === "verifying"
                                      ? "sync"
                                      : "shield"}
                                </span>
                              </div>
                              <div
                                className={`text-sm md:text-lg font-bold ${verificationState === "verifying" ? "text-yellow-500" : verificationState === "failed" ? "text-red-500" : "text-slate-300"}`}
                              >
                                Verification
                              </div>
                              <p
                                className={`text-[10px] md:text-xs ${verificationState !== "idle" ? "text-slate-300" : "text-slate-500"}`}
                              >
                                Anti-bot security check.
                              </p>
                            </div>
                          </div>

                          {/* Simulation Terminal Log */}
                          <div className="mt-4 md:mt-6 p-3 md:p-4 rounded bg-black/40 border border-primary/10 font-mono text-[10px] md:text-xs text-primary/80 h-24 md:h-32 overflow-hidden relative text-left">
                            <div
                              className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-[#0df259]/10 to-transparent animate-[scanline_4s_linear_infinite]"
                              style={{ backgroundSize: "100% 200%" }}
                            ></div>
                            <div className="flex flex-col gap-1 opacity-80">
                              <p>&gt; Initializing handshake protocol...</p>
                              <p>
                                &gt; [OK] Connection established via Node #8392
                              </p>
                              {boostProgress > 20 && (
                                <p>
                                  &gt; Analyzing recent engagement metrics...
                                </p>
                              )}
                              {boostProgress > 40 && (
                                <p>
                                  &gt;{" "}
                                  <span className="text-white">
                                    OPTIMIZING:
                                  </span>{" "}
                                  Found 24 potential growth vectors.
                                </p>
                              )}
                              {boostProgress > 60 && (
                                <p>
                                  &gt; Queue position confirmed:{" "}
                                  <span className="text-white">
                                    Priority High
                                  </span>
                                </p>
                              )}
                              {boostProgress > 80 && (
                                <p className="animate-pulse">
                                  &gt; Awaiting server allocation...
                                </p>
                              )}
                              {verificationState === "verifying" && (
                                <p className="text-yellow-500 animate-pulse">
                                  &gt; WARNING: Suspicious activity detected.
                                  Initiating verification...
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Critical Warning */}
                        <div className="flex items-center justify-center">
                          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-3 rounded-full flex items-center gap-3 shadow-lg backdrop-blur-sm">
                            <span className="material-symbols-outlined text-red-400">
                              warning
                            </span>
                            <span className="font-medium text-sm tracking-wide">
                              Do not close this window. Interrupting may result
                              in data loss.
                            </span>
                          </div>
                        </div>

                        {/* Footer Stats */}
                        <div className="flex w-full justify-between items-center border-t border-primary/10 pt-6 mt-2 opacity-70">
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                              Estimated Time
                            </span>
                            <span className="text-white font-mono text-sm">
                              ~12s
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                              Session ID
                            </span>
                            <span className="text-white font-mono text-sm">
                              #X99-284-B
                            </span>
                          </div>
                          <div className="flex flex-col items-center gap-1">
                            <span className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">
                              Target
                            </span>
                            <span className="text-white font-mono text-sm">
                              Growth
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer Disclaimer */}
                <p className="text-center text-xs text-slate-600 max-w-lg mx-auto">
                  By continuing, you agree to our Terms of Service. This is a
                  simulation tool for educational purposes only. Results are
                  simulated and do not reflect real Instagram metrics.
                </p>
              </div>
            </div>
          )}

          {boostComplete && (
            /* STAGE 3: SUCCESS */
            <div className="w-full max-w-2xl animate-fade-in-up bg-white dark:bg-[#183422] border border-slate-200 dark:border-[#22492f] rounded-[2rem] p-12 text-center shadow-2xl relative overflow-hidden">
              <div className="flex flex-col items-center justify-center gap-6 z-10 relative">
                <div className="w-24 h-24 rounded-full bg-[#0df259]/20 flex items-center justify-center mb-2">
                  <span className="material-symbols-outlined text-6xl text-[#0df259]">
                    check_circle
                  </span>
                </div>

                <div>
                  <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
                    Order Confirmed!
                  </h2>
                  <p className="text-xl text-slate-500 dark:text-slate-300">
                    Delivering{" "}
                    <strong className="text-slate-900 dark:text-white">
                      {followersAmount[0] / 1000}k followers
                    </strong>{" "}
                    to{" "}
                    <strong className="text-[#0df259]">
                      @{profile?.username}
                    </strong>
                  </p>
                </div>

                <div className="w-full bg-[#f5f8f6] dark:bg-[#102216] p-6 rounded-2xl flex items-start gap-4 text-left border border-slate-200 dark:border-[#22492f] mt-4">
                  <span className="material-symbols-outlined text-[#0df259] mt-1">
                    info
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">
                      Delivery Estimate
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                      You will see results within 1-5 minutes. The process is
                      gradual to ensure account safety.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setProfile(null);
                    setUsername("");
                    setBoostComplete(false);
                    setFollowersAmount([1000]);
                  }}
                  className="mt-4 w-full py-4 rounded border-2 border-slate-200 dark:border-[#22492f] hover:bg-slate-50 dark:hover:bg-[#102216] text-slate-900 dark:text-white font-bold transition-colors"
                >
                  Boost Another Account
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-200 dark:border-[#22492f] bg-[#f5f8f6] dark:bg-[#102216] py-10 px-6">
        <div className="max-w-[960px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-1 text-center md:text-left">
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              © 2026 Account Booster. All rights reserved.
            </p>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-slate-500 dark:text-slate-400 hover:text-[#0df259] dark:hover:text-[#0df259] transition-colors"
            >
              <span className="sr-only">Twitter</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M247.39,68.94A8,8,0,0,0,240,64H209.57A48.66,48.66,0,0,0,168.1,40a46.91,46.91,0,0,0-33.75,13.7A47.9,47.9,0,0,0,120,88v6.09C79.74,83.47,46.81,50.72,46.46,50.37a8,8,0,0,0-13.65,4.92c-4.31,47.79,9.57,79.77,22,98.18a110.93,110.93,0,0,0,21.88,24.2c-15.23,17.53-39.21,26.74-39.47,26.84a8,8,0,0,0-3.85,11.93c.75,1.12,3.75,5.05,11.08,8.72C53.51,229.7,65.48,232,80,232c70.67,0,129.72-54.42,135.75-124.44l29.91-29.9A8,8,0,0,0,247.39,68.94Zm-45,29.41a8,8,0,0,0-2.32,5.14C196,166.58,143.28,216,80,216c-10.56,0-18-1.4-23.22-3.08,11.51-6.25,27.56-17,37.88-32.48A8,8,0,0,0,92,169.08c-.47-.27-43.91-26.34-44-96,16,13,45.25,33.17,78.67,38.79A8,8,0,0,0,136,104V88a32,32,0,0,1,9.6-22.92A30.94,30.94,0,0,1,167.9,56c12.66.16,24.49,7.88,29.44,19.21A8,8,0,0,0,204.67,80h16Z"></path>
              </svg>
            </a>
            <a
              href="#"
              className="text-slate-500 dark:text-slate-400 hover:text-[#0df259] dark:hover:text-[#0df259] transition-colors"
            >
              <span className="sr-only">Instagram</span>
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path>
              </svg>
            </a>
          </div>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm transition-colors"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
