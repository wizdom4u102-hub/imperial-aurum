"use client";

import {
  ImagePlus,
  Send,
  X,
} from "lucide-react";
import { useRef, useState } from "react";

import type { ChatMessage } from "@/lib/live-chat/types";

interface LiveChatWindowProps {
  messages: ChatMessage[];
  isLoading: boolean;
  isSending: boolean;
  error: string | null;
  onClose: () => void;
  onSendMessage: (
    message: string,
    options?: {
      image?: File | null;
    },
  ) => Promise<void>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export default function LiveChatWindow({
  messages,
  isLoading,
  isSending,
  error,
  onClose,
  onSendMessage,
}: LiveChatWindowProps) {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);
  const [imagePreview, setImagePreview] =
    useState<string | null>(null);
  const [imageError, setImageError] =
    useState<string | null>(null);

  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  function handleImageSelect(
    event: React.ChangeEvent<HTMLInputElement>,
  ): void {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError(null);

    if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
      setImageError(
        "Please select a JPEG, PNG, WebP, or GIF image.",
      );

      event.target.value = "";
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setImageError(
        "Image must be 5 MB or smaller.",
      );

      event.target.value = "";
      return;
    }

    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setImagePreview(previewUrl);
  }

  function removeSelectedImage(): void {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview(null);
    setImageError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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

    await onSendMessage(trimmedMessage, {
      image: selectedImage,
    });

    setMessage("");
    removeSelectedImage();
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 text-white shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3">
        <div>
          <h2 className="font-semibold text-white">
            Imperial Aurum Support
          </h2>

          <p className="text-xs text-zinc-400">
            We are here to help
          </p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-2 text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
          aria-label="Close live chat"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Messages */}
      <div
        className="flex h-96 flex-col overflow-y-auto bg-zinc-950 px-4 py-4"
        aria-live="polite"
      >
        {isLoading &&
        messages.length === 0 ? (
          <div className="flex flex-1 items-center justify-center text-sm text-zinc-500">
            Loading chat...
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-white">
              Start a conversation
            </p>

            <p className="mt-1 max-w-xs text-xs text-zinc-500">
              Send us a message and our support
              team will respond.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((chatMessage) => {
              const isVisitor =
                chatMessage.senderType ===
                "visitor";

              return (
                <div
                  key={chatMessage.id}
                  className={`flex ${
                    isVisitor
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[82%] ${
                      isVisitor
                        ? "items-end"
                        : "items-start"
                    }`}
                  >
                    <div
                      className={`overflow-hidden rounded-2xl text-sm ${
                        isVisitor
                          ? "rounded-br-md bg-blue-500 text-white"
                          : "rounded-bl-md bg-zinc-800 text-zinc-100"
                      }`}
                    >
                      {chatMessage.attachments.map(
                        (attachment) => {
                          if (
                            !attachment.mimeType.startsWith(
                              "image/",
                            )
                          ) {
                            return null;
                          }

                          return (
                            <img
                              key={
                                attachment.id
                              }
                              src={
                                attachment.publicUrl
                              }
                              alt={
                                attachment.fileName
                              }
                              className="max-h-56 w-full object-cover"
                            />
                          );
                        },
                      )}

                      {chatMessage.message &&
                      chatMessage.message !==
                        "Image attachment" ? (
                        <div className="px-3 py-2">
                          {chatMessage.message}
                        </div>
                      ) : null}
                    </div>

                    <p
                      className={`mt-1 px-1 text-[10px] ${
                        isVisitor
                          ? "text-right text-zinc-600"
                          : "text-left text-zinc-600"
                      }`}
                    >
                      {new Date(
                        chatMessage.createdAt,
                      ).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Errors */}
      {imageError ? (
        <div
          className="border-t border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-red-400"
          role="alert"
        >
          {imageError}
        </div>
      ) : null}

      {error ? (
        <div
          className="border-t border-zinc-800 bg-zinc-900 px-4 py-2 text-xs text-red-400"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {/* Image Preview */}
      {imagePreview ? (
        <div className="border-t border-zinc-800 bg-zinc-900 px-3 pt-3">
          <div className="relative inline-block overflow-hidden rounded-xl border border-zinc-700">
            <img
              src={imagePreview}
              alt="Selected image preview"
              className="h-20 w-20 object-cover"
            />

            <button
              type="button"
              onClick={removeSelectedImage}
              disabled={isSending}
              className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-zinc-950/90 text-white transition hover:bg-black disabled:opacity-50"
              aria-label="Remove selected image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="border-t border-zinc-800 bg-zinc-900 p-3"
      >
        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleImageSelect}
            disabled={isSending}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => {
              fileInputRef.current?.click();
            }}
            disabled={isSending}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-zinc-700 bg-zinc-800 text-zinc-300 transition hover:border-blue-500 hover:text-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Attach image"
          >
            <ImagePlus className="h-4 w-4" />
          </button>

          <input
            type="text"
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
            }}
            placeholder="Type your message..."
            disabled={isSending}
            className="min-w-0 flex-1 rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            aria-label="Chat message"
          />

          <button
            type="submit"
            disabled={
              isSending ||
              (!message.trim() &&
                !selectedImage)
            }
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>

        {isSending ? (
          <p className="mt-2 text-center text-[11px] text-zinc-500">
            Sending...
          </p>
        ) : null}
      </form>
    </div>
  );
}