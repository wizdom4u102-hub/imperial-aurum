"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  createChatConversation,
  createChatBusyMessage,
  getChatMessages,
  sendChatMessage,
} from "@/lib/live-chat/api-client";

import { uploadChatImage } from "@/lib/live-chat/attachment-api-client";

import { subscribeToChatMessages } from "@/lib/live-chat/realtime";

import {
  trackChatMessageSent,
  trackChatOpened,
} from "@/lib/visitor-tracking/events";

import type {
  ChatMessage,
  ChatState,
} from "@/lib/live-chat/types";

import type {
  ChatMessageAttachment,
} from "@/lib/live-chat/attachment-types";

const CHAT_CONVERSATION_STORAGE_KEY =
  "imperial_aurum_chat_conversation";

const BUSY_MESSAGE_DELAY = 20_000;

type StoredConversation = {
  sessionId: string;
  conversationId: string;
};

type SendChatMessageOptions = {
  image?: File | null;
};

function getStoredConversation():
  | StoredConversation
  | null {
  if (typeof window === "undefined") {
    return null;
  }

  const stored =
    window.localStorage.getItem(
      CHAT_CONVERSATION_STORAGE_KEY,
    );

  if (!stored) {
    return null;
  }

  try {
    const parsed: unknown =
      JSON.parse(stored);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("sessionId" in parsed) ||
      !("conversationId" in parsed) ||
      typeof parsed.sessionId !== "string" ||
      typeof parsed.conversationId !== "string"
    ) {
      return null;
    }

    return {
      sessionId: parsed.sessionId,
      conversationId:
        parsed.conversationId,
    };
  } catch {
    return null;
  }
}

function storeConversation(
  sessionId: string,
  conversationId: string,
): void {
  if (typeof window === "undefined") {
    return;
  }

  const conversation: StoredConversation = {
    sessionId,
    conversationId,
  };

  window.localStorage.setItem(
    CHAT_CONVERSATION_STORAGE_KEY,
    JSON.stringify(conversation),
  );
}

export function useLiveChat(
  sessionId: string | null,
  userId: string | null = null,
) {
  const [state, setState] =
    useState<ChatState>({
      conversationId: null,
      sessionId,
      messages: [],
      status: null,
      isOpen: false,
      isLoading: false,
      isSending: false,
      error: null,
    });

  const [unreadCount, setUnreadCount] =
    useState(0);

  const [
    lastAttachment,
    setLastAttachment,
  ] = useState<ChatMessageAttachment | null>(
    null,
  );

  const conversationIdRef =
    useRef<string | null>(null);

  const busyTimerRef =
    useRef<number | null>(null);

  const visitorMessageSentRef =
    useRef(false);

  const adminRepliedRef =
    useRef(false);

  const busyMessageSentRef =
    useRef(false);

  const loadMessages =
    useCallback(
      async (
        activeSessionId: string,
        activeConversationId: string,
        showLoading = false,
      ): Promise<void> => {
        if (showLoading) {
          setState(
            (currentState) => ({
              ...currentState,
              isLoading: true,
              error: null,
            }),
          );
        }

        try {
          const messages =
            await getChatMessages(
              activeSessionId,
              activeConversationId,
            );

          const hasAdminReply =
            messages.some(
              (message) =>
                message.senderType ===
                "admin",
            );

          if (hasAdminReply) {
            adminRepliedRef.current =
              true;

            if (
              busyTimerRef.current !==
              null
            ) {
              window.clearTimeout(
                busyTimerRef.current,
              );

              busyTimerRef.current =
                null;
            }
          }

          setState(
            (currentState) => ({
              ...currentState,
              messages,
              conversationId:
                activeConversationId,
              sessionId:
                activeSessionId,
              isLoading: false,
              error: null,
            }),
          );
        } catch (error) {
          setState(
            (currentState) => ({
              ...currentState,
              isLoading: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to load chat messages",
            }),
          );
        }
      },
      [],
    );

  const openChat =
    useCallback(async (): Promise<void> => {
      if (!sessionId) {
        setState(
          (currentState) => ({
            ...currentState,
            error:
              "Visitor session is not ready",
          }),
        );

        return;
      }

      setState(
        (currentState) => ({
          ...currentState,
          isOpen: true,
          isLoading: true,
          error: null,
        }),
      );

      setUnreadCount(0);

      try {
        const storedConversation =
          getStoredConversation();

        if (
          storedConversation &&
          storedConversation.sessionId ===
            sessionId
        ) {
          conversationIdRef.current =
            storedConversation.conversationId;

          setState(
            (currentState) => ({
              ...currentState,
              conversationId:
                storedConversation.conversationId,
              sessionId,
              isOpen: true,
            }),
          );

          await loadMessages(
            sessionId,
            storedConversation.conversationId,
            true,
          );

          await trackChatOpened(
            sessionId,
            userId,
            storedConversation.conversationId,
          );

          return;
        }

        const conversationId =
          await createChatConversation({
            sessionId,
            userId,
          });

        conversationIdRef.current =
          conversationId;

        storeConversation(
          sessionId,
          conversationId,
        );

        setState(
          (currentState) => ({
            ...currentState,
            conversationId,
            sessionId,
            messages: [],
            isOpen: true,
            isLoading: false,
            error: null,
          }),
        );

        await trackChatOpened(
          sessionId,
          userId,
          conversationId,
        );
      } catch (error) {
        conversationIdRef.current =
          null;

        setState(
          (currentState) => ({
            ...currentState,
            isLoading: false,
            error:
              error instanceof Error
                ? error.message
                : "Failed to open live chat",
          }),
        );
      }
    }, [
      loadMessages,
      sessionId,
      userId,
    ]);

  const closeChat =
    useCallback((): void => {
      setState(
        (currentState) => ({
          ...currentState,
          isOpen: false,
        }),
      );
    }, []);

  const startBusyMessageTimer =
    useCallback(
      (
        activeSessionId: string,
        activeConversationId: string,
      ): void => {
        if (
          busyTimerRef.current !==
          null
        ) {
          window.clearTimeout(
            busyTimerRef.current,
          );
        }

        busyTimerRef.current =
          window.setTimeout(
            () => {
              busyTimerRef.current =
                null;

              if (
                adminRepliedRef.current ||
                busyMessageSentRef.current
              ) {
                return;
              }

              void createChatBusyMessage(
                activeSessionId,
                activeConversationId,
              )
                .then(() => {
                  busyMessageSentRef.current =
                    true;

                  void loadMessages(
                    activeSessionId,
                    activeConversationId,
                  );
                })
                .catch(
                  (error: unknown) => {
                    console.error(
                      "Failed to create busy chat message:",
                      error,
                    );
                  },
                );
            },
            BUSY_MESSAGE_DELAY,
          );
      },
      [loadMessages],
    );

  const sendMessage =
    useCallback(
      async (
        message: string,
        options: SendChatMessageOptions = {},
      ): Promise<void> => {
        const trimmedMessage =
          message.trim();

        const image =
          options.image ?? null;

        const activeConversationId =
          conversationIdRef.current;

        if (!sessionId) {
          setState(
            (currentState) => ({
              ...currentState,
              error:
                "Visitor session is not ready",
            }),
          );

          return;
        }

        if (!activeConversationId) {
          setState(
            (currentState) => ({
              ...currentState,
              error:
                "Chat conversation is not ready",
            }),
          );

          return;
        }

        if (!trimmedMessage && !image) {
          return;
        }

        setState(
          (currentState) => ({
            ...currentState,
            isSending: true,
            error: null,
          }),
        );

        setLastAttachment(null);

        try {
          /*
           * The message must be created first because
           * the attachment table references
           * chat_messages.id.
           */
          const messageId =
            await sendChatMessage({
              sessionId,
              conversationId:
                activeConversationId,
              message:
                trimmedMessage ||
                "Image attachment",
            });

          let attachment:
            | ChatMessageAttachment
            | null = null;

          if (image) {
            attachment =
              await uploadChatImage({
                sessionId,
                conversationId:
                  activeConversationId,
                messageId,
                file: image,
              });

            setLastAttachment(
              attachment,
            );
          }

          /*
           * The visitor has now actually started
           * the conversation.
           *
           * Start the 20-second busy timer only
           * after this first visitor message.
           */
          if (
            !visitorMessageSentRef.current
          ) {
            visitorMessageSentRef.current =
              true;

            adminRepliedRef.current =
              false;

            busyMessageSentRef.current =
              false;

            startBusyMessageTimer(
              sessionId,
              activeConversationId,
            );
          }

          await trackChatMessageSent(
            sessionId,
            userId,
            activeConversationId,
          );

          /*
           * Refresh after the attachment is
           * created.
           */
          await loadMessages(
            sessionId,
            activeConversationId,
          );

          setState(
            (currentState) => ({
              ...currentState,
              isSending: false,
              error: null,
            }),
          );
        } catch (error) {
          setState(
            (currentState) => ({
              ...currentState,
              isSending: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to send message",
            }),
          );
        }
      },
      [
        loadMessages,
        sessionId,
        startBusyMessageTimer,
        userId,
      ],
    );

  useEffect(() => {
    if (
      !sessionId ||
      !state.conversationId
    ) {
      return;
    }

    const activeConversationId =
      state.conversationId;

    const unsubscribe =
      subscribeToChatMessages(
        activeConversationId,
        (message: ChatMessage) => {
          if (
            message.senderType ===
            "admin"
          ) {
            adminRepliedRef.current =
              true;

            if (
              busyTimerRef.current !==
              null
            ) {
              window.clearTimeout(
                busyTimerRef.current,
              );

              busyTimerRef.current =
                null;
            }
          }

          setState(
            (currentState) => {
              const alreadyExists =
                currentState.messages.some(
                  (existingMessage) =>
                    existingMessage.id ===
                    message.id,
                );

              if (alreadyExists) {
                return currentState;
              }

              return {
                ...currentState,
                messages: [
                  ...currentState.messages,
                  message,
                ],
              };
            },
          );

          if (
            message.senderType ===
              "admin" &&
            !state.isOpen
          ) {
            setUnreadCount(
              (currentCount) =>
                currentCount + 1,
            );
          }
        },
      );

    return unsubscribe;
  }, [
    sessionId,
    state.conversationId,
    state.isOpen,
  ]);

  useEffect(() => {
    if (
      !sessionId ||
      !state.conversationId ||
      !state.isOpen
    ) {
      return;
    }

    void loadMessages(
      sessionId,
      state.conversationId,
    );
  }, [
    loadMessages,
    sessionId,
    state.conversationId,
    state.isOpen,
  ]);

  useEffect(() => {
    return () => {
      if (
        busyTimerRef.current !==
        null
      ) {
        window.clearTimeout(
          busyTimerRef.current,
        );

        busyTimerRef.current = null;
      }
    };
  }, []);

  return {
    ...state,
    unreadCount,
    lastAttachment,
    openChat,
    closeChat,
    sendMessage,
    refreshMessages:
      async (): Promise<void> => {
        if (
          sessionId &&
          state.conversationId
        ) {
          await loadMessages(
            sessionId,
            state.conversationId,
            true,
          );
        }
      },
  };
}