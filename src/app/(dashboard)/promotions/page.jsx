"use client";
import React, { useState } from "react";
import {
  MdMessage,
  MdEmail,
  MdAutoFixHigh,
  MdSend,
  MdPeopleOutline,
  MdSmartphone,
  MdOutlineSubject,
  MdOutlineCheckCircle,
} from "react-icons/md";

const CampaignManager = () => {
  const [channel, setChannel] = useState("sms"); // 'sms' or 'email'
  const [audience, setAudience] = useState("all");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  // AI Generation State
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSent, setIsSent] = useState(false);

  // Mock AI Generate Function
  const handleAIGenerate = () => {
    if (!aiPrompt.trim()) return;
    setIsGenerating(true);

    // Simulate API delay for AI generation
    setTimeout(() => {
      const generatedText =
        channel === "sms"
          ? `🔥 ধামাকা অফার! ${aiPrompt}-এ পাচ্ছেন বিশাল ছাড়! আজই ভিজিট করুন আমাদের সুপার শপে অথবা অর্ডার করুন অনলাইনে। অফার সীমিত সময়ের জন্য! শর্ত প্রযোজ্য।`
          : `প্রিয় গ্রাহক,\n\nআপনাকে জানাতে পেরে আমরা আনন্দিত যে, আমাদের শপে চলছে বিশেষ অফার! \n\nঅফারের বিস্তারিত: ${aiPrompt}\n\nস্টক ফুরিয়ে যাওয়ার আগেই আজই আপনার পছন্দের পণ্যটি সংগ্রহ করুন। যেকোনো প্রয়োজনে আমাদের সাথে যোগাযোগ করতে পারেন।\n\nধন্যবাদ,\nআপনার বিশ্বস্ত সুপার শপ।`;

      setMessage(generatedText);
      if (channel === "email" && !subject) {
        setSubject(`বিশেষ অফার: ${aiPrompt}`);
      }
      setIsGenerating(false);
    }, 1500);
  };

  const handleSendCampaign = (e) => {
    e.preventDefault();
    // Logic for sending the campaign goes here
    setIsSent(true);
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="min-h-screen  text-gray-900 font-sans">
      <main className="p-4 md:p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Campaign Manager</h1>
          <p className="text-sm text-gray-600 mt-1">
            Send promotional messages, offers, and announcements to your
            customers.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form & Editor */}
          <div className="lg:col-span-2 space-y-6">
            {/* Channel Selection */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
                1. Select Channel & Audience
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Channel Toggle */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Method
                  </label>
                  <div className="flex rounded-md shadow-sm" role="group">
                    <button
                      type="button"
                      onClick={() => setChannel("sms")}
                      className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-l-lg border ${
                        channel === "sms"
                          ? "bg-[#611F69]/10 text-[#611F69] border-[#611F69] z-10"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      } focus:z-10 focus:ring-2 focus:ring-[#611F69] focus:outline-none transition-colors`}
                    >
                      <MdSmartphone size={20} />
                      SMS / WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => setChannel("email")}
                      className={`flex-1 flex justify-center items-center gap-2 px-4 py-2 text-sm font-medium rounded-r-lg border-t border-b border-r ${
                        channel === "email"
                          ? "bg-[#611F69]/10 text-[#611F69] border-[#611F69] z-10"
                          : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                      } focus:z-10 focus:ring-2 focus:ring-[#611F69] focus:outline-none transition-colors`}
                    >
                      <MdEmail size={20} />
                      Email
                    </button>
                  </div>
                </div>

                {/* Audience Selection */}
                <div>
                  <label
                    htmlFor="audience"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Target Audience
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MdPeopleOutline className="text-gray-400" size={20} />
                    </div>
                    <select
                      id="audience"
                      value={audience}
                      onChange={(e) => setAudience(e.target.value)}
                      className="pl-10 w-full border border-gray-300 rounded-md py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-[#611F69] shadow-sm text-sm"
                    >
                      <option value="all">All Customers (12,450)</option>
                      <option value="vip">VIP Members (1,240)</option>
                      <option value="recent">
                        Recent Buyers (last 30 days)
                      </option>
                      <option value="inactive">
                        Inactive Customers (90+ days)
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Generator Box */}
            <section className="bg-gradient-to-r from-[#611F69]/5 to-[#611F69]/10 rounded-xl shadow-sm border border-[#611F69]/20 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-[#611F69] text-white rounded-lg shadow-sm">
                  <MdAutoFixHigh size={24} />
                </div>
                <div className="flex-1">
                  <h2 className="text-base font-bold text-[#611F69]">
                    AI Message Assistant
                  </h2>
                  <p className="text-sm text-[#611F69]/80 mb-3">
                    Describe your offer, and our AI will write a high-converting
                    message for you.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. 50% discount on winter clothes this weekend"
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      className="flex-1 border border-[#611F69]/30 rounded-md px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-[#611F69] shadow-sm"
                    />
                    <button
                      onClick={handleAIGenerate}
                      disabled={isGenerating || !aiPrompt.trim()}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#611F69] hover:bg-[#4A154B] disabled:bg-[#611F69]/50 text-white text-sm font-medium rounded-md shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:ring-offset-2"
                    >
                      {isGenerating ? "Generating..." : "Generate Text"}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Message Editor */}
            <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-4">
                2. Compose Message
              </h2>
              <form onSubmit={handleSendCampaign} className="space-y-4">
                {/* Conditional Subject Line for Email */}
                {channel === "email" && (
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email Subject
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <MdOutlineSubject className="text-gray-400" size={20} />
                      </div>
                      <input
                        id="subject"
                        type="text"
                        required
                        placeholder="Exciting news inside!"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="pl-10 w-full border border-gray-300 rounded-md py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-[#611F69] shadow-sm text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Message Body */}
                <div>
                  <label
                    htmlFor="messageBody"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Message Body
                  </label>
                  <textarea
                    id="messageBody"
                    required
                    rows={channel === "email" ? 8 : 4}
                    placeholder="Type your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#611F69] focus:border-[#611F69] shadow-sm text-sm resize-y"
                  ></textarea>
                  <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                    <span>Supports emojis and links.</span>
                    <span
                      className={
                        message.length > 160 && channel === "sms"
                          ? "text-amber-600 font-semibold"
                          : ""
                      }
                    >
                      {message.length} characters{" "}
                      {channel === "sms" && message.length > 160
                        ? "(Will be sent as 2 SMS)"
                        : ""}
                    </span>
                  </div>
                </div>

                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSent || !message.trim()}
                    className={`inline-flex items-center justify-center gap-2 px-6 py-2.5 text-white text-sm font-medium rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isSent
                        ? "bg-green-600 hover:bg-green-700 focus:ring-green-600"
                        : "bg-[#611F69] hover:bg-[#4A154B] focus:ring-[#611F69] disabled:bg-[#611F69]/50"
                    }`}
                  >
                    {isSent ? (
                      <>
                        <MdOutlineCheckCircle size={20} /> Campaign Sent!
                      </>
                    ) : (
                      <>
                        <MdSend size={20} /> Send to{" "}
                        {audience === "all" ? "12,450" : "Selected"} Users
                      </>
                    )}
                  </button>
                </div>
              </form>
            </section>
          </div>

          {/* Right Column: Live Preview */}
          <div className="lg:col-span-1">
            <section
              className="bg-gray-100 rounded-xl shadow-inner border border-gray-200 p-6 sticky top-8"
              aria-label="Message Preview"
            >
              <h2 className="text-sm font-semibold text-gray-800 uppercase tracking-wide mb-6 flex items-center gap-2">
                Live Preview
              </h2>

              {/* Mobile Phone Mockup for SMS */}
              {channel === "sms" ? (
                <div className="w-full max-w-[280px] mx-auto bg-white border-[8px] border-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden relative min-h-[500px] flex flex-col">
                  {/* Phone Notch */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-gray-800 rounded-b-xl w-32 mx-auto"></div>

                  {/* Screen Header */}
                  <div className="bg-gray-100 pt-8 pb-3 px-4 border-b border-gray-200 text-center">
                    <div className="w-12 h-12 bg-[#611F69]/10 text-[#611F69] rounded-full mx-auto flex items-center justify-center mb-1">
                      <MdMessage size={24} />
                    </div>
                    <p className="text-xs font-semibold text-gray-900">
                      Your Shop Name
                    </p>
                    <p className="text-[10px] text-gray-500">Text Message</p>
                  </div>

                  {/* Message Bubble */}
                  <div className="flex-1 p-4 bg-white">
                    <div className="bg-gray-100 rounded-2xl rounded-tl-sm p-3 shadow-sm inline-block max-w-[90%]">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap word-break-words">
                        {message || (
                          <span className="text-gray-400 italic">
                            Your message will appear here...
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Email Browser Mockup */
                <div className="w-full bg-white border border-gray-300 rounded-lg shadow-xl overflow-hidden">
                  {/* Browser Header */}
                  <div className="bg-gray-200 px-3 py-2 flex items-center gap-2 border-b border-gray-300">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400"></div>
                    </div>
                  </div>

                  {/* Email Headers */}
                  <div className="p-4 border-b border-gray-100">
                    <p className="text-xs text-gray-500 mb-1">
                      <span className="font-semibold text-gray-700">From:</span>{" "}
                      updates@yourshop.com
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      <span className="font-semibold text-gray-700">To:</span>{" "}
                      customer@example.com
                    </p>
                    <p className="text-sm font-bold text-gray-900">
                      {subject || "Subject line will appear here"}
                    </p>
                  </div>

                  {/* Email Body */}
                  <div className="p-4 bg-gray-50 min-h-[250px]">
                    <div className="bg-white p-4 border border-gray-100 rounded shadow-sm">
                      <p className="text-sm text-gray-800 whitespace-pre-wrap">
                        {message || (
                          <span className="text-gray-400 italic">
                            Your email content will appear here...
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CampaignManager;
