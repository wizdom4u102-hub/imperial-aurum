"use client";

import {
  ArrowLeft,
  ImagePlus,
  Mail,
  MessageCircle,
  RotateCcw,
  Send,
  X,
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

import { useAdminLiveChat } from "@/hooks/use-admin-live-chat";

export default function AdminLiveChatConversationPage() {
  const router = useRouter();
  const params = useParams();

  const conversationId =
    typeof params.conversationId === "string"
      ? params.conversationId
      : null;

  const {
    conversations,
    selectedConversationId,
    messages,
    isLoadingMessages,
    isSending,
    error,
    selectConversation,
    sendMessage,
    connectEmail,
    reopenConversation,
    closeConversation,
  } = useAdminLiveChat();

  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [visitorEmail, setVisitorEmail] =
    useState("");

  const [isConnectingEmail, setIsConnectingEmail] =
    useState(false);

  const [emailError, setEmailError] =
    useState<string | null>(null);

  const [emailConnected, setEmailConnected] =
    useState(false);

  const conversation =
    conversations.find(
      (item) =>
        item.conversation.id ===
        conversationId,
    )?.conversation ?? null;

  async function handleConnectEmail(): Promise<void> {
    const trimmedEmail =
      visitorEmail.trim();

    if (!conversationId || !trimmedEmail) {
      return;
    }

    setEmailError(null);

    if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        trimmedEmail,
      )
    ) {
      setEmailError(
        "Please enter a valid email address.",
      );
      return;
    }

    setIsConnectingEmail(true);

    try {
      await connectEmail(trimmedEmail);

      setEmailConnected(true);
      setVisitorEmail(trimmedEmail);
    } catch (error) {
      setEmailError(
        error instanceof Error
          ? error.message
          : "Failed to connect visitor email.",
      );
    } finally {
      setIsConnectingEmail(false);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ): Promise<void> {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (
      (!trimmedMessage && !selectedImage) ||
      isSending
    ) {
      return;
    }

    await sendMessage(
      trimmedMessage,
      selectedImage,
    );

    setMessage("");
    setSelectedImage(null);
  }

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    setSelectedImage(file);

    event.target.value = "";
  }

  function removeSelectedImage(): void {
    setSelectedImage(null);
  }

  if (
    conversationId &&
    selectedConversationId !== conversationId
  ) {
    void selectConversation(conversationId);
  }

  return (
    <section className="flex min-h-[calc(100vh-120px)] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      {/* Header */}
      <header className="flex items-center justify-between gap-4 border-b border-zinc-800 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.push("/admin/live-chat");
            }}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
            aria-label="Back to conversations"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-white">
              {conversation?.subject ??
                "Visitor Conversation"}
            </h1>

            <p className="text-xs text-zinc-500">
              {conversation?.user_id
                ? "Registered visitor"
                : "Anonymous visitor"}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {conversation ? (
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${
                conversation.status === "closed"
                  ? "bg-zinc-800 text-zinc-400"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {conversation.status === "closed"
                ? "Closed"
                : "Open"}
            </span>
          ) : null}

          {conversationId ? (
            <button
              type="button"
              onClick={() => {
                router.push(
                  `/admin/live-chat/${conversationId}/tracking`,
                );
              }}
              className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:bg-zinc-800 hover:text-white"
            >
              Visitor Tracking
            </button>
          ) : null}

          {conversation?.status === "closed" ? (
            <button
              type="button"
              onClick={() => {
                if (conversationId) {
                  void reopenConversation(
                    conversationId,
                  );
                }
              }}
              className="flex items-center gap-2 rounded-xl bg-amber-400 px-3 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-amber-300"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Reopen
            </button>
          ) : conversation ? (
            <button
              type="button"
              onClick={() => {
                void closeConversation(
                  conversation.id,
                );
              }}
              className="rounded-xl border border-zinc-700 px-3 py-2 text-xs font-medium text-zinc-300 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
            >
              Close
            </button>
          ) : null}
        </div>
      </header>

      {/* Visitor Email */}
      {conversation ? (
        <div className="border-b border-zinc-800 bg-zinc-950 px-5 py-4">
          <div className="mx-auto max-w-3xl">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
              <div className="min-w-0 flex-1">
                <label
                  htmlFor="visitor-email"
                  className="mb-2 block text-xs font-medium text-zinc-400"
                >
                  Visitor email
                </label>

                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />

                  <input
                    id="visitor-email"
                    type="email"
                    value={visitorEmail}
                    onChange={(event) => {
                      setVisitorEmail(
                        event.target.value,
                      );
                      setEmailError(null);
                      setEmailConnected(false);
                    }}
                    placeholder="visitor@example.com"
                    disabled={isConnectingEmail}
                    className="w-full rounded-xl border border-zinc-700 bg-zinc-900 py-2.5 pl-10 pr-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-400 disabled:opacity-50"
                  />
                </div>

                {emailError ? (
                  <p className="mt-2 text-xs text-red-400">
                    {emailError}
                  </p>
                ) : emailConnected ? (
                  <p className="mt-2 text-xs text-emerald-400">
                    Email connected successfully.
                  </p>
                ) : (
                  <p className="mt-2 text-xs text-zinc-600">
                    Connect an email to allow support
                    notifications.
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  void handleConnectEmail();
                }}
                disabled={
                  isConnectingEmail ||
                  !visitorEmail.trim()
                }
                className="flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-400 px-4 text-xs font-semibold text-zinc-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Mail className="h-4 w-4" />

                {isConnectingEmail
                  ? "Connecting..."
                  : emailConnected
                    ? "Connected"
                    : "Connect Email"}
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-6">
        {isLoadingMessages ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-zinc-500">
              Loading messages...
            </p>
          </div>
        ) : error ? (
          <div className="flex h-full items-center justify-center">
            <p className="text-sm text-red-400">
              {error}
            </p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-800">
              <MessageCircle className="h-5 w-5 text-zinc-400" />
            </div>

            <p className="text-sm font-medium text-white">
              No messages yet
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Messages from this visitor will appear
              here.
            </p>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((chatMessage) => {
              const isAdmin =
                chatMessage.sender_type ===
                "admin";

              const attachments =
                "attachments" in chatMessage &&
                Array.isArray(
                  chatMessage.attachments,
                )
                  ? chatMessage.attachments
                  : [];

              return (
                <div
                  key={chatMessage.id}
                  className={`flex ${
                    isAdmin
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div className="max-w-[75%]">
                    <p
                      className={`mb-1 px-1 text-[10px] ${
                        isAdmin
                          ? "text-right text-amber-400"
                          : "text-left text-zinc-500"
                      }`}
                    >
                      {isAdmin
                        ? "You"
                        : "Visitor"}
                    </p>

                    <div
                      className={`overflow-hidden rounded-2xl ${
                        isAdmin
                          ? "rounded-br-md bg-amber-400 text-zinc-950"
                          : "rounded-bl-md bg-zinc-800 text-zinc-100"
                      }`}
                    >
                      {attachments.length > 0 ? (
                        <div className="space-y-2 p-2">
                          {attachments.map(
                            (attachment) => (
                              <a
                                key={
                                  attachment.id
                                }
                                href={
                                  attachment.publicUrl
                                }
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block overflow-hidden rounded-xl"
                              >
                                <Image
                                  src={
                                    attachment.publicUrl
                                  }
                                  alt={
                                    attachment.fileName
                                  }
                                  width={640}
                                  height={480}
                                  unoptimized
                                  className="max-h-80 w-full object-contain"
                                />
                              </a>
                            ),
                          )}
                        </div>
                      ) : null}

                      {chatMessage.message.trim() &&
                      chatMessage.message.trim() !==
                        " " ? (
                        <div className="px-4 py-3 text-sm leading-relaxed">
                          {chatMessage.message}
                        </div>
                      ) : null}
                    </div>

                    <p
                      className={`mt-1 px-1 text-[10px] text-zinc-600 ${
                        isAdmin
                          ? "text-right"
                          : "text-left"
                      }`}
                    >
                      {new Date(
                        chatMessage.created_at,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Composer */}
      {conversation?.status === "closed" ? (
        <div className="border-t border-zinc-800 bg-zinc-950 px-5 py-4 text-center">
          <p className="text-sm text-zinc-500">
            This conversation is closed.
          </p>

          <button
            type="button"
            onClick={() => {
              if (conversationId) {
                void reopenConversation(
                  conversationId,
                );
              }
            }}
            className="mt-3 rounded-xl bg-amber-400 px-4 py-2 text-xs font-semibold text-zinc-950 transition hover:bg-amber-300"
          >
            Reopen conversation
          </button>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="border-t border-zinc-800 bg-zinc-950 p-4"
        >
          <div className="mx-auto max-w-3xl">
            {selectedImage ? (
              <div className="mb-3 flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-3">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={URL.createObjectURL(
                      selectedImage,
                    )}
                    alt="Selected image"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-white">
                    {selectedImage.name}
                  </p>

                  <p className="mt-1 text-[11px] text-zinc-500">
                    {(
                      selectedImage.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>
                </div>

                <button
                  type="button"
                  onClick={removeSelectedImage}
                  disabled={isSending}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                  aria-label="Remove selected image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : null}

            <div className="flex items-center gap-3">
              <label
                className={`flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-zinc-700 text-zinc-400 transition hover:border-amber-400 hover:text-amber-400 ${
                  isSending
                    ? "pointer-events-none opacity-40"
                    : ""
                }`}
                aria-label="Attach image"
              >
                <ImagePlus className="h-5 w-5" />

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={
                    handleImageChange
                  }
                  disabled={isSending}
                  className="sr-only"
                />
              </label>

              <input
                type="text"
                value={message}
                onChange={(event) => {
                  setMessage(
                    event.target.value,
                  );
                }}
                placeholder="Type a message..."
                disabled={isSending}
                className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-amber-400"
                aria-label="Message"
              />

              <button
                type="submit"
                disabled={
                  isSending ||
                  (!message.trim() &&
                    !selectedImage)
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-400 text-zinc-950 transition hover:bg-amber-300 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </form>
      )}
    </section>
  );
}