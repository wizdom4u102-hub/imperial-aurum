"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  closeAdminChatConversation,
  getAdminChatConversations,
  getAdminChatMessages,
  markAdminChatMessagesAsRead,
  sendAdminChatMessage,
  connectVisitorEmail,
} from "@/lib/live-chat/admin-api-client";

import { uploadAdminChatImage } from "@/lib/live-chat/admin-attachment-api-client";

import { createClient } from "@/lib/supabase/client";

import type {
  ChatConversationRecord,
  ChatMessageRecord,
} from "@/lib/live-chat/types";

import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import type {
  AdminChatState,
} from "@/lib/live-chat/admin-types";

export function useAdminLiveChat(
  conversationId?: string | null,
) {
  const supabase = createClient();

  const [state, setState] =
    useState<AdminChatState>({
      conversations: [],
      selectedConversationId:
        conversationId ?? null,
      messages: [],
      isLoading: false,
      isLoadingMessages: false,
      isSending: false,
      error: null,
    });

  const [
    unreadConversationCount,
    setUnreadConversationCount,
  ] = useState(0);

  const loadConversations =
    useCallback(
      async (): Promise<void> => {
        setState(
          (currentState) => ({
            ...currentState,
            isLoading: true,
            error: null,
          }),
        );

        try {
          const conversations =
            await getAdminChatConversations();

          const selectedId =
            state.selectedConversationId;

          const totalUnread =
            conversations.reduce(
              (
                total,
                item,
              ) =>
                total +
                (item.unreadMessageCount >
                0
                  ? 1
                  : 0),
              0,
            );

          setUnreadConversationCount(
            totalUnread,
          );

          setState(
            (currentState) => ({
              ...currentState,
              conversations:
                conversations.map(
                  (item) => ({
                    conversation:
                      item.conversation,
                    latestMessage:
                      item.latestMessage,
                    unreadMessageCount:
                      item.unreadMessageCount,
                  }),
                ),
              selectedConversationId:
                selectedId,
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
                  : "Failed to load chat conversations",
            }),
          );
        }
      },
      [state.selectedConversationId],
    );

  const selectConversation =
    useCallback(
      async (
        id: string,
      ): Promise<void> => {
        setState(
          (currentState) => ({
            ...currentState,
            selectedConversationId:
              id,
            isLoadingMessages: true,
            error: null,
          }),
        );

        try {
          const messages =
            await getAdminChatMessages(
              id,
            );

          await markAdminChatMessagesAsRead(
            id,
          );

          setState(
            (currentState) => ({
              ...currentState,
              selectedConversationId:
                id,
              messages,
              isLoadingMessages: false,
              error: null,
              conversations:
                currentState.conversations.map(
                  (item) =>
                    item.conversation.id ===
                    id
                      ? {
                          ...item,
                          unreadMessageCount:
                            0,
                        }
                      : item,
                ),
            }),
          );

          /*
           * Recalculate the number of
           * conversations that still have
           * unread visitor messages.
           */
          setUnreadConversationCount(
            (currentCount) =>
              Math.max(
                0,
                currentCount -
                  (
                    state.conversations.find(
                      (item) =>
                        item.conversation
                          .id === id,
                    )?.unreadMessageCount ??
                    0
                  ) > 0
                  ? 1
                  : 0,
              ),
          );
        } catch (error) {
          setState(
            (currentState) => ({
              ...currentState,
              isLoadingMessages: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to load chat messages",
            }),
          );
        }
      },
      [state.conversations],
    );

  const sendMessage =
    useCallback(
      async (
        message: string,
        image?: File | null,
      ): Promise<void> => {
        const trimmedMessage =
          message.trim();

        if (
          !trimmedMessage &&
          !image
        ) {
          return;
        }

        const selectedConversation =
          state.conversations.find(
            (item) =>
              item.conversation.id ===
              state.selectedConversationId,
          );

        if (!selectedConversation) {
          setState(
            (currentState) => ({
              ...currentState,
              error:
                "Select a conversation before sending a message",
            }),
          );

          return;
        }

        if (
          selectedConversation
            .conversation.status ===
          "closed"
        ) {
          setState(
            (currentState) => ({
              ...currentState,
              error:
                "Cannot send a message in a closed conversation",
            }),
          );

          return;
        }

        setState(
          (currentState) => ({
            ...currentState,
            isSending: true,
            error: null,
          }),
        );

        try {
          const createdMessage =
            await sendAdminChatMessage(
              selectedConversation.conversation,
              trimmedMessage ||
                "Image attachment",
            );

          let finalMessage =
            createdMessage;

          if (image) {
            const attachment =
              await uploadAdminChatImage(
                {
                  conversationId:
                    selectedConversation
                      .conversation.id,
                  messageId:
                    createdMessage.id,
                  file: image,
                },
              );

            finalMessage = {
              ...createdMessage,
              attachments: [
                attachment,
              ],
            } as ChatMessageRecord;
          }

          setState(
            (currentState) => {
              const alreadyExists =
                currentState.messages.some(
                  (
                    existingMessage,
                  ) =>
                    existingMessage.id ===
                    finalMessage.id,
                );

              return {
                ...currentState,
                messages:
                  alreadyExists
                    ? currentState.messages
                    : [
                        ...currentState.messages,
                        finalMessage,
                      ],
                isSending: false,
                error: null,
              };
            },
          );
        } catch (error) {
          setState(
            (currentState) => ({
              ...currentState,
              isSending: false,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to send admin message",
            }),
          );
        }
      },
      [
        state.conversations,
        state.selectedConversationId,
      ],
    );

      const connectEmail =
    useCallback(
      async (
        visitorEmail: string,
      ): Promise<void> => {
        if (!state.selectedConversationId) {
          throw new Error(
            "Select a conversation before connecting an email",
          );
        }

        await connectVisitorEmail(
          state.selectedConversationId,
          visitorEmail,
        );
      },
      [state.selectedConversationId],
    );


  const closeConversation =
    useCallback(
      async (
        id: string,
      ): Promise<void> => {
        try {
          await closeAdminChatConversation(
            id,
          );

          const now =
            new Date().toISOString();

          setState(
            (currentState) => ({
              ...currentState,
              conversations:
                currentState.conversations.map(
                  (item) =>
                    item.conversation.id ===
                    id
                      ? {
                          ...item,
                          conversation: {
                            ...item.conversation,
                            status:
                              "closed",
                            closed_at:
                              now,
                            updated_at:
                              now,
                          },
                        }
                      : item,
                ),
            }),
          );
        } catch (error) {
          setState(
            (currentState) => ({
              ...currentState,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to close conversation",
            }),
          );
        }
      },
      [],
    );

  const reopenConversation =
    useCallback(
      async (
        id: string,
      ): Promise<void> => {
        try {
          const response =
            await fetch(
              "/api/admin/live-chat",
              {
                method: "POST",
                headers: {
                  "Content-Type":
                    "application/json",
                },
                body: JSON.stringify({
                  action:
                    "reopen-conversation",
                  conversationId:
                    id,
                }),
              },
            );

          const result:
            | {
                success: true;
                data: boolean;
              }
            | {
                success: false;
                error?: string;
              } =
            await response.json();

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              !result.success
                ? result.error ??
                    "Failed to reopen conversation"
                : "Failed to reopen conversation",
            );
          }

          setState(
            (currentState) => ({
              ...currentState,
              conversations:
                currentState.conversations.map(
                  (item) =>
                    item.conversation.id ===
                    id
                      ? {
                          ...item,
                          conversation: {
                            ...item.conversation,
                            status:
                              "open",
                            closed_at:
                              null,
                            updated_at:
                              new Date().toISOString(),
                          },
                        }
                      : item,
                ),
            }),
          );
        } catch (error) {
          setState(
            (currentState) => ({
              ...currentState,
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to reopen conversation",
            }),
          );
        }
      },
      [],
    );

  useEffect(() => {
    void loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!conversationId) {
      return;
    }

    void selectConversation(
      conversationId,
    );
  }, [
    conversationId,
    selectConversation,
  ]);

  useEffect(() => {
  const channel =
  supabase.channel(
    "admin-live-chat",
     )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_conversations",
          },
          (
  payload: RealtimePostgresChangesPayload<ChatConversationRecord>,
) => {
  const conversation =
    payload.new as ChatConversationRecord;

            setState(
              (currentState) => {
                const exists =
                  currentState.conversations.some(
                    (item) =>
                      item.conversation.id ===
                      conversation.id,
                  );

                if (exists) {
                  return currentState;
                }

                return {
                  ...currentState,
                  conversations: [
                    {
                      conversation,
                      latestMessage:
                        null,
                      unreadMessageCount:
                        0,
                    },
                    ...currentState.conversations,
                  ],
                };
              },
            );
          },
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "chat_conversations",
          },
          (
  payload: RealtimePostgresChangesPayload<ChatConversationRecord>,
) => {
  const conversation =
    payload.new as ChatConversationRecord;

            setState(
              (currentState) => ({
                ...currentState,
                conversations:
                  currentState.conversations.map(
                    (item) =>
                      item.conversation.id ===
                      conversation.id
                        ? {
                            ...item,
                            conversation,
                          }
                        : item,
                  ),
              }),
            );
          },
        )
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "chat_messages",
          },
          (
  payload: RealtimePostgresChangesPayload<ChatMessageRecord>,
) => {
  const incomingMessage =
    payload.new as ChatMessageRecord;

            setState(
              (currentState) => {
                const isSelected =
                  currentState.selectedConversationId ===
                  incomingMessage.conversation_id;

                const alreadyExists =
                  currentState.messages.some(
                    (
                      existingMessage,
                    ) =>
                      existingMessage.id ===
                      incomingMessage.id,
                  );

                return {
                  ...currentState,

                  messages:
                    isSelected &&
                    !alreadyExists
                      ? [
                          ...currentState.messages,
                          {
                            ...incomingMessage,
                            attachments:
                              "attachments" in
                                incomingMessage
                                ? incomingMessage.attachments
                                : [],
                          } as ChatMessageRecord,
                        ]
                      : currentState.messages,

                  conversations:
                    currentState.conversations.map(
                      (item) =>
                        item.conversation.id ===
                        incomingMessage.conversation_id
                          ? {
                              ...item,
                              conversation: {
                                ...item.conversation,
                                last_message_at:
                                  incomingMessage.created_at,
                                updated_at:
                                  incomingMessage.created_at,
                              },
                              unreadMessageCount:
                                !isSelected &&
                                incomingMessage.sender_type ===
                                  "visitor"
                                  ? item.unreadMessageCount +
                                    1
                                  : item.unreadMessageCount,
                            }
                          : item,
                    ),
                };
              },
            );

            if (
              incomingMessage.sender_type ===
                "visitor" &&
              state.selectedConversationId !==
                incomingMessage.conversation_id
            ) {
              setUnreadConversationCount(
                (currentCount) =>
                  currentCount + 1,
              );
            }
          },
        )
        .subscribe();

    return () => {
      void supabase.removeChannel(
        channel,
      );
    };
  }, []);

  return {
    ...state,
    unreadConversationCount,
    loadConversations,
    selectConversation,
    sendMessage,
    connectEmail,
    closeConversation,
    reopenConversation,
  };
}