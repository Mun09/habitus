"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Send, Sparkles, User as UserIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/locale-provider";
import { AI_QUICK_REPLIES } from "@/lib/mock/ai-keywords";
import type { ChatMessage, Project } from "@/lib/mock/projects";
import { cn } from "@/lib/utils";

export function ChatPanel({ project }: { project: Project }) {
  const { t } = useLocale();
  const [tab, setTab] = useState<"ai" | "pm">("ai");
  const [aiMessages, setAiMessages] = useState<ChatMessage[]>([
    {
      id: "ai-greet",
      sender: "ai",
      body: "Hi, your project assistant. Ask about schedule, costs, materials anytime.",
      time: "now",
    },
  ]);
  const [pmMessages, setPmMessages] = useState<ChatMessage[]>(project.pmMessages);
  const [input, setInput] = useState("");

  const sendAi = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: "user",
      body: text,
      time: "now",
    };
    setAiMessages((m) => [...m, userMsg]);
    setInput("");
    // find quick reply by keyword
    setTimeout(() => {
      const lower = text.toLowerCase();
      const reply =
        AI_QUICK_REPLIES.find(
          (q) =>
            ["schedule", "cost", "material", "next"].some((k) => lower.includes(k)) &&
            q.tKey.includes(
              lower.includes("cost")
                ? "cost"
                : lower.includes("material")
                ? "material"
                : lower.includes("next")
                ? "next"
                : "schedule"
            )
        ) ?? AI_QUICK_REPLIES[0];
      setAiMessages((m) => [
        ...m,
        {
          id: `ai-${Date.now()}`,
          sender: "ai",
          body: reply.text,
          time: "now",
        },
      ]);
    }, 700);
  };

  const sendPm = (text: string) => {
    if (!text.trim()) return;
    const userMsg: ChatMessage = {
      id: `up-${Date.now()}`,
      sender: "user",
      body: text,
      time: "now",
    };
    setPmMessages((m) => [...m, userMsg]);
    setInput("");
    setTimeout(() => {
      setPmMessages((m) => [
        ...m,
        {
          id: `pm-${Date.now()}`,
          sender: "pm",
          body: "Got it! I'll relay this to the contractor and reply shortly.",
          time: "soon",
        },
      ]);
    }, 5000);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tab === "ai") sendAi(input);
    else sendPm(input);
  };

  return (
    <div className="flex h-[640px] flex-col overflow-hidden border border-border bg-card shadow-[var(--shadow-warm)] md:h-[720px]">
      <Tabs value={tab} onValueChange={(v) => setTab(v as "ai" | "pm")}>
        <div className="px-4 pt-4">
          <TabsList className="w-full">
            <TabsTrigger value="ai" className="flex-1">
              <Sparkles className="h-3.5 w-3.5" />
              {t("tracking.chat.aiTab")}
            </TabsTrigger>
            <TabsTrigger value="pm" className="flex-1">
              <UserIcon className="h-3.5 w-3.5" />
              {t("tracking.chat.pmTab")}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="ai" className="mt-0 flex-1 flex flex-col min-h-0">
          <MessageList messages={aiMessages} />
          <div className="px-4 py-3 border-t border-border">
            <div className="flex gap-1.5 mb-2 overflow-x-auto no-scrollbar">
              {(["schedule", "cost", "material", "next"] as const).map((k) => (
                <button
                  key={k}
                  onClick={() => sendAi(t(`tracking.chat.aiQuick.${k}` as any))}
                  className="flex-shrink-0 cursor-pointer rounded-md bg-muted px-3 py-1.5 text-xs hover:bg-accent/30"
                >
                  {t(`tracking.chat.aiQuick.${k}` as any)}
                </button>
              ))}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="pm" className="mt-0 flex-1 flex flex-col min-h-0">
          <div className="px-4 py-3 border-b border-border flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-md">
              <Image src={project.pm.avatar} alt="" fill sizes="40px" className="object-cover" />
            </div>
            <div>
              <div className="text-sm font-medium">{project.pm.name}</div>
              <div className="text-xs text-muted-foreground">{project.pm.role}</div>
            </div>
          </div>
          <MessageList messages={pmMessages} />
        </TabsContent>
      </Tabs>
      <form onSubmit={submit} className="p-3 border-t border-border flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("tracking.chat.placeholder")}
        />
        <Button type="submit" size="icon" disabled={!input.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}

function MessageList({ messages }: { messages: ChatMessage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref.current?.scrollTo({ top: ref.current.scrollHeight, behavior: "smooth" });
  }, [messages]);
  return (
    <div ref={ref} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
      {messages.map((m) => (
        <div
          key={m.id}
          className={cn(
            "flex flex-col max-w-[85%]",
            m.sender === "user" ? "items-end ml-auto" : "items-start"
          )}
        >
          <div
            className={cn(
              "rounded-lg px-4 py-2.5 text-sm leading-relaxed",
              m.sender === "user"
                ? "bg-primary text-primary-foreground rounded-br-md"
                : m.sender === "ai"
                ? "bg-primary/10 text-foreground rounded-tl-md"
                : "bg-muted text-foreground rounded-tl-md"
            )}
          >
            {m.body}
          </div>
          <div className="text-[10px] text-muted-foreground mt-1 px-1">{m.time}</div>
        </div>
      ))}
    </div>
  );
}
