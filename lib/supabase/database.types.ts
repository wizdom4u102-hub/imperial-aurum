export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_notifications: {
        Row: {
          created_at: string | null
          created_by: string | null
          event: string | null
          id: string
          is_read: boolean | null
          message: string
          priority: string | null
          read_at: string | null
          reference_id: string | null
          reference_table: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          event?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          priority?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_table?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          event?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          priority?: string | null
          read_at?: string | null
          reference_id?: string | null
          reference_table?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      admin_push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          endpoint: string
          id: string
          last_used_at: string | null
          p256dh: string
          updated_at: string
          user_agent: string | null
        }
        Insert: {
          auth: string
          created_at?: string
          endpoint: string
          id?: string
          last_used_at?: string | null
          p256dh: string
          updated_at?: string
          user_agent?: string | null
        }
        Update: {
          auth?: string
          created_at?: string
          endpoint?: string
          id?: string
          last_used_at?: string | null
          p256dh?: string
          updated_at?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      balances: {
        Row: {
          cash: number
          created_at: string | null
          gold: number
          id: string
          last_mined_at: string | null
          last_mining_claim: string | null
          mining_started_at: string | null
          shares: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cash?: number
          created_at?: string | null
          gold?: number
          id?: string
          last_mined_at?: string | null
          last_mining_claim?: string | null
          mining_started_at?: string | null
          shares?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cash?: number
          created_at?: string | null
          gold?: number
          id?: string
          last_mined_at?: string | null
          last_mining_claim?: string | null
          mining_started_at?: string | null
          shares?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          author: string | null
          category: string | null
          content: string
          created_at: string
          excerpt: string | null
          featured_image: string | null
          id: string
          published_at: string | null
          slug: string
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          category?: string | null
          content: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          category?: string | null
          content?: string
          created_at?: string
          excerpt?: string | null
          featured_image?: string | null
          id?: string
          published_at?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      bot_deposits: {
        Row: {
          admin_note: string | null
          approval_note: string | null
          approved_at: string | null
          approved_by: string | null
          bot_id: string | null
          created_at: string | null
          deposit_type: string
          expires_at: string | null
          id: string
          investment_amount: number
          notes: string | null
          payment_method_id: string | null
          payment_method_name: string | null
          payment_network: string | null
          payment_wallet: string | null
          plan_id: string
          proof_image: string | null
          reference: string
          rejected_at: string | null
          rejection_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          status: string
          transaction_hash: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_note?: string | null
          approval_note?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bot_id?: string | null
          created_at?: string | null
          deposit_type?: string
          expires_at?: string | null
          id?: string
          investment_amount: number
          notes?: string | null
          payment_method_id?: string | null
          payment_method_name?: string | null
          payment_network?: string | null
          payment_wallet?: string | null
          plan_id: string
          proof_image?: string | null
          reference: string
          rejected_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_hash?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_note?: string | null
          approval_note?: string | null
          approved_at?: string | null
          approved_by?: string | null
          bot_id?: string | null
          created_at?: string | null
          deposit_type?: string
          expires_at?: string | null
          id?: string
          investment_amount?: number
          notes?: string | null
          payment_method_id?: string | null
          payment_method_name?: string | null
          payment_network?: string | null
          payment_wallet?: string | null
          plan_id?: string
          proof_image?: string | null
          reference?: string
          rejected_at?: string | null
          rejection_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: string
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_deposits_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "user_trading_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_deposits_payment_method_id_fkey"
            columns: ["payment_method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_deposits_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "trading_bot_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_deposits_user_id_profiles_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_logs: {
        Row: {
          action: string
          bot_id: string | null
          created_at: string | null
          deposit_id: string | null
          id: string
          ip_address: unknown
          log_type: string
          message: string
          metadata: Json | null
          performed_by: string | null
          severity: string | null
          trade_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          bot_id?: string | null
          created_at?: string | null
          deposit_id?: string | null
          id?: string
          ip_address?: unknown
          log_type: string
          message: string
          metadata?: Json | null
          performed_by?: string | null
          severity?: string | null
          trade_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          bot_id?: string | null
          created_at?: string | null
          deposit_id?: string | null
          id?: string
          ip_address?: unknown
          log_type?: string
          message?: string
          metadata?: Json | null
          performed_by?: string | null
          severity?: string | null
          trade_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_logs_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "user_trading_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_logs_deposit_id_fkey"
            columns: ["deposit_id"]
            isOneToOne: false
            referencedRelation: "bot_deposits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_logs_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "bot_trades"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_profit_history: {
        Row: {
          bot_id: string
          created_at: string | null
          credited_to_wallet: boolean | null
          daily_profit: number | null
          description: string | null
          id: string
          monthly_profit: number | null
          profit_amount: number
          profit_date: string
          running_balance: number
          source: string | null
          total_profit: number | null
          trade_id: string | null
          updated_at: string | null
          user_id: string
          wallet_transaction_id: string | null
          weekly_profit: number | null
          yearly_profit: number | null
        }
        Insert: {
          bot_id: string
          created_at?: string | null
          credited_to_wallet?: boolean | null
          daily_profit?: number | null
          description?: string | null
          id?: string
          monthly_profit?: number | null
          profit_amount?: number
          profit_date?: string
          running_balance?: number
          source?: string | null
          total_profit?: number | null
          trade_id?: string | null
          updated_at?: string | null
          user_id: string
          wallet_transaction_id?: string | null
          weekly_profit?: number | null
          yearly_profit?: number | null
        }
        Update: {
          bot_id?: string
          created_at?: string | null
          credited_to_wallet?: boolean | null
          daily_profit?: number | null
          description?: string | null
          id?: string
          monthly_profit?: number | null
          profit_amount?: number
          profit_date?: string
          running_balance?: number
          source?: string | null
          total_profit?: number | null
          trade_id?: string | null
          updated_at?: string | null
          user_id?: string
          wallet_transaction_id?: string | null
          weekly_profit?: number | null
          yearly_profit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_profit_history_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "user_trading_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_profit_history_trade_id_fkey"
            columns: ["trade_id"]
            isOneToOne: false
            referencedRelation: "bot_trades"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_profit_history_wallet_transaction_id_fkey"
            columns: ["wallet_transaction_id"]
            isOneToOne: false
            referencedRelation: "transactions"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_statistics: {
        Row: {
          accumulated_profit: number | null
          average_loss: number | null
          average_profit: number | null
          bot_id: string
          cancelled_trades: number | null
          completed_trades: number | null
          created_at: string | null
          current_portfolio_value: number | null
          current_value: number | null
          highest_loss: number | null
          highest_profit: number | null
          id: string
          investment_capital: number | null
          last_profit_at: string | null
          last_trade_at: string | null
          last_updated_at: string | null
          latest_trade_id: string | null
          losing_trades: number | null
          monthly_profit: number | null
          open_trades: number | null
          remaining_days: number | null
          roi_percentage: number | null
          running_days: number | null
          server_status: string | null
          today_profit: number | null
          total_profit: number | null
          total_trades: number | null
          user_id: string
          weekly_profit: number | null
          win_rate: number | null
          winning_trades: number | null
          yearly_profit: number | null
        }
        Insert: {
          accumulated_profit?: number | null
          average_loss?: number | null
          average_profit?: number | null
          bot_id: string
          cancelled_trades?: number | null
          completed_trades?: number | null
          created_at?: string | null
          current_portfolio_value?: number | null
          current_value?: number | null
          highest_loss?: number | null
          highest_profit?: number | null
          id?: string
          investment_capital?: number | null
          last_profit_at?: string | null
          last_trade_at?: string | null
          last_updated_at?: string | null
          latest_trade_id?: string | null
          losing_trades?: number | null
          monthly_profit?: number | null
          open_trades?: number | null
          remaining_days?: number | null
          roi_percentage?: number | null
          running_days?: number | null
          server_status?: string | null
          today_profit?: number | null
          total_profit?: number | null
          total_trades?: number | null
          user_id: string
          weekly_profit?: number | null
          win_rate?: number | null
          winning_trades?: number | null
          yearly_profit?: number | null
        }
        Update: {
          accumulated_profit?: number | null
          average_loss?: number | null
          average_profit?: number | null
          bot_id?: string
          cancelled_trades?: number | null
          completed_trades?: number | null
          created_at?: string | null
          current_portfolio_value?: number | null
          current_value?: number | null
          highest_loss?: number | null
          highest_profit?: number | null
          id?: string
          investment_capital?: number | null
          last_profit_at?: string | null
          last_trade_at?: string | null
          last_updated_at?: string | null
          latest_trade_id?: string | null
          losing_trades?: number | null
          monthly_profit?: number | null
          open_trades?: number | null
          remaining_days?: number | null
          roi_percentage?: number | null
          running_days?: number | null
          server_status?: string | null
          today_profit?: number | null
          total_profit?: number | null
          total_trades?: number | null
          user_id?: string
          weekly_profit?: number | null
          win_rate?: number | null
          winning_trades?: number | null
          yearly_profit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "bot_statistics_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: true
            referencedRelation: "user_trading_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_statistics_latest_trade_id_fkey"
            columns: ["latest_trade_id"]
            isOneToOne: false
            referencedRelation: "bot_trades"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_trades: {
        Row: {
          asset: string
          bot_id: string
          buy_price: number | null
          closed_at: string | null
          created_at: string | null
          engine_version: string | null
          expires_at: string | null
          generated_by: string | null
          gross_profit: number | null
          id: string
          leverage: number | null
          market_type: string | null
          net_profit: number | null
          opened_at: string | null
          plan_id: string | null
          quantity: number | null
          roi_percentage: number | null
          sell_price: number | null
          status: string | null
          stop_loss: number | null
          take_profit: number | null
          trade_number: number
          trade_type: string | null
          trading_fee: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          asset: string
          bot_id: string
          buy_price?: number | null
          closed_at?: string | null
          created_at?: string | null
          engine_version?: string | null
          expires_at?: string | null
          generated_by?: string | null
          gross_profit?: number | null
          id?: string
          leverage?: number | null
          market_type?: string | null
          net_profit?: number | null
          opened_at?: string | null
          plan_id?: string | null
          quantity?: number | null
          roi_percentage?: number | null
          sell_price?: number | null
          status?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          trade_number?: number
          trade_type?: string | null
          trading_fee?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          asset?: string
          bot_id?: string
          buy_price?: number | null
          closed_at?: string | null
          created_at?: string | null
          engine_version?: string | null
          expires_at?: string | null
          generated_by?: string | null
          gross_profit?: number | null
          id?: string
          leverage?: number | null
          market_type?: string | null
          net_profit?: number | null
          opened_at?: string | null
          plan_id?: string | null
          quantity?: number | null
          roi_percentage?: number | null
          sell_price?: number | null
          status?: string | null
          stop_loss?: number | null
          take_profit?: number | null
          trade_number?: number
          trade_type?: string | null
          trading_fee?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_trades_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "user_trading_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_trades_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "trading_bot_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      bot_transactions: {
        Row: {
          amount: number
          balance_after: number
          balance_before: number
          bot_id: string | null
          created_at: string
          description: string | null
          id: string
          metadata: Json | null
          reference_id: string | null
          status: string
          transaction_type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          balance_after?: number
          balance_before?: number
          bot_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          status?: string
          transaction_type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          balance_after?: number
          balance_before?: number
          bot_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          metadata?: Json | null
          reference_id?: string | null
          status?: string
          transaction_type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bot_transactions_bot_id_fkey"
            columns: ["bot_id"]
            isOneToOne: false
            referencedRelation: "user_trading_bots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bot_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          assigned_admin_id: string | null
          closed_at: string | null
          created_at: string
          email_connected_at: string | null
          id: string
          last_message_at: string
          session_id: string
          started_at: string
          status: string
          subject: string | null
          updated_at: string
          user_id: string | null
          visitor_email: string | null
        }
        Insert: {
          assigned_admin_id?: string | null
          closed_at?: string | null
          created_at?: string
          email_connected_at?: string | null
          id?: string
          last_message_at?: string
          session_id: string
          started_at?: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
          visitor_email?: string | null
        }
        Update: {
          assigned_admin_id?: string | null
          closed_at?: string | null
          created_at?: string
          email_connected_at?: string | null
          id?: string
          last_message_at?: string
          session_id?: string
          started_at?: string
          status?: string
          subject?: string | null
          updated_at?: string
          user_id?: string | null
          visitor_email?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_assigned_admin_id_fkey"
            columns: ["assigned_admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visitor_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_message_attachments: {
        Row: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          message_id: string
          mime_type: string
        }
        Insert: {
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          message_id: string
          mime_type: string
        }
        Update: {
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          message_id?: string
          mime_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_message_attachments_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          sender_id: string | null
          sender_type: string
          session_id: string
        }
        Insert: {
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          sender_id?: string | null
          sender_type: string
          session_id: string
        }
        Update: {
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          sender_id?: string | null
          sender_type?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visitor_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      deposits: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          method_id: string | null
          mining_plan_id: string | null
          reject_reason: string | null
          shared_plan_id: string | null
          status: string | null
          transaction_hash: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          method_id?: string | null
          mining_plan_id?: string | null
          reject_reason?: string | null
          shared_plan_id?: string | null
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          method_id?: string | null
          mining_plan_id?: string | null
          reject_reason?: string | null
          shared_plan_id?: string | null
          status?: string | null
          transaction_hash?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "deposits_method_id_fkey"
            columns: ["method_id"]
            isOneToOne: false
            referencedRelation: "payment_methods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_mining_plan_id_fkey"
            columns: ["mining_plan_id"]
            isOneToOne: false
            referencedRelation: "mining_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deposits_shared_plan_id_fkey"
            columns: ["shared_plan_id"]
            isOneToOne: false
            referencedRelation: "shared_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      faqs: {
        Row: {
          answer: string
          created_at: string
          display_order: number
          id: string
          is_active: boolean
          question: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          display_order?: number
          id?: string
          is_active?: boolean
          question?: string
          updated_at?: string
        }
        Relationships: []
      }
      ledger: {
        Row: {
          amount: number | null
          asset: string | null
          balance_after: number | null
          balance_before: number | null
          created_at: string | null
          id: string
          type: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          asset?: string | null
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          asset?: string | null
          balance_after?: number | null
          balance_before?: number | null
          created_at?: string | null
          id?: string
          type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      live_chat: {
        Row: {
          created_at: string
          description: string | null
          display_order: number
          icon: string | null
          id: string
          is_active: boolean
          title: string
          updated_at: string
          url: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          title: string
          updated_at?: string
          url?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number
          icon?: string | null
          id?: string
          is_active?: boolean
          title?: string
          updated_at?: string
          url?: string | null
        }
        Relationships: []
      }
      login_history: {
        Row: {
          created_at: string | null
          device: string | null
          id: string
          ip_address: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          device?: string | null
          id?: string
          ip_address?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          device?: string | null
          id?: string
          ip_address?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mining_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          free_daily_gold: number
          gold_per_dollar: number
          id: string
          is_active: boolean
          is_free: boolean
          maximum_amount: number
          minimum_amount: number
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days?: number
          free_daily_gold?: number
          gold_per_dollar?: number
          id?: string
          is_active?: boolean
          is_free?: boolean
          maximum_amount?: number
          minimum_amount?: number
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          free_daily_gold?: number
          gold_per_dollar?: number
          id?: string
          is_active?: boolean
          is_free?: boolean
          maximum_amount?: number
          minimum_amount?: number
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      mining_sessions: {
        Row: {
          active: boolean | null
          ends_at: string | null
          id: string
          investment_amount: number | null
          last_claim_at: string | null
          mining_plan_id: string | null
          processing_at: string | null
          rate_per_second: number | null
          reward: number | null
          started_at: string | null
          status: string | null
          total_earned: number | null
          user_id: string | null
        }
        Insert: {
          active?: boolean | null
          ends_at?: string | null
          id?: string
          investment_amount?: number | null
          last_claim_at?: string | null
          mining_plan_id?: string | null
          processing_at?: string | null
          rate_per_second?: number | null
          reward?: number | null
          started_at?: string | null
          status?: string | null
          total_earned?: number | null
          user_id?: string | null
        }
        Update: {
          active?: boolean | null
          ends_at?: string | null
          id?: string
          investment_amount?: number | null
          last_claim_at?: string | null
          mining_plan_id?: string | null
          processing_at?: string | null
          rate_per_second?: number | null
          reward?: number | null
          started_at?: string | null
          status?: string | null
          total_earned?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "mining_sessions_mining_plan_id_fkey"
            columns: ["mining_plan_id"]
            isOneToOne: false
            referencedRelation: "mining_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          action_url: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          metadata: Json | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          metadata?: Json | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          metadata?: Json | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      payment_methods: {
        Row: {
          created_at: string | null
          details: Json | null
          id: string
          is_active: boolean | null
          name: string
          type: string
        }
        Insert: {
          created_at?: string | null
          details?: Json | null
          id?: string
          is_active?: boolean | null
          name: string
          type: string
        }
        Update: {
          created_at?: string | null
          details?: Json | null
          id?: string
          is_active?: boolean | null
          name?: string
          type?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          blocked: boolean | null
          cash_balance: number | null
          created_at: string | null
          email: string | null
          gold_balance: number | null
          id: string
          is_admin: boolean | null
          is_premium: boolean | null
          last_mining_update: string | null
          mining_rate_per_hour: number | null
          name: string | null
          referral_code: string | null
          referred_by: string | null
          referrer_id: string | null
          role: string | null
          status: string | null
          suspended: boolean | null
          total_gold_earned: number | null
          updated_at: string | null
          username: string | null
          verified: boolean | null
        }
        Insert: {
          blocked?: boolean | null
          cash_balance?: number | null
          created_at?: string | null
          email?: string | null
          gold_balance?: number | null
          id: string
          is_admin?: boolean | null
          is_premium?: boolean | null
          last_mining_update?: string | null
          mining_rate_per_hour?: number | null
          name?: string | null
          referral_code?: string | null
          referred_by?: string | null
          referrer_id?: string | null
          role?: string | null
          status?: string | null
          suspended?: boolean | null
          total_gold_earned?: number | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
        }
        Update: {
          blocked?: boolean | null
          cash_balance?: number | null
          created_at?: string | null
          email?: string | null
          gold_balance?: number | null
          id?: string
          is_admin?: boolean | null
          is_premium?: boolean | null
          last_mining_update?: string | null
          mining_rate_per_hour?: number | null
          name?: string | null
          referral_code?: string | null
          referred_by?: string | null
          referrer_id?: string | null
          role?: string | null
          status?: string | null
          suspended?: boolean | null
          total_gold_earned?: number | null
          updated_at?: string | null
          username?: string | null
          verified?: boolean | null
        }
        Relationships: []
      }
      push_subscriptions: {
        Row: {
          auth: string
          created_at: string
          device_name: string | null
          device_type: string | null
          endpoint: string
          id: string
          is_active: boolean
          last_used_at: string | null
          p256dh: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auth: string
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          endpoint: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          p256dh: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auth?: string
          created_at?: string
          device_name?: string | null
          device_type?: string | null
          endpoint?: string
          id?: string
          is_active?: boolean
          last_used_at?: string | null
          p256dh?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referral_earnings: {
        Row: {
          commission_amount: number
          commission_percent: number
          created_at: string | null
          id: string
          level: number
          referrer_id: string
          source_amount: number
          source_deposit_id: string
          status: string
          user_id: string
        }
        Insert: {
          commission_amount: number
          commission_percent: number
          created_at?: string | null
          id?: string
          level: number
          referrer_id: string
          source_amount: number
          source_deposit_id: string
          status?: string
          user_id: string
        }
        Update: {
          commission_amount?: number
          commission_percent?: number
          created_at?: string | null
          id?: string
          level?: number
          referrer_id?: string
          source_amount?: number
          source_deposit_id?: string
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          created_at: string | null
          id: string
          level: number | null
          referred_id: string | null
          referrer_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          level?: number | null
          referred_id?: string | null
          referrer_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          level?: number | null
          referred_id?: string | null
          referrer_id?: string | null
        }
        Relationships: []
      }
      shared_plan_profits: {
        Row: {
          amount: number | null
          created_at: string | null
          credited: boolean | null
          id: string
          roi_percent: number | null
          shared_plan_id: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          credited?: boolean | null
          id?: string
          roi_percent?: number | null
          shared_plan_id: string
          user_id: string
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          credited?: boolean | null
          id?: string
          roi_percent?: number | null
          shared_plan_id?: string
          user_id?: string
        }
        Relationships: []
      }
      shared_plans: {
        Row: {
          active: boolean | null
          amount: number | null
          created_at: string | null
          daily_roi: number | null
          days_completed: number | null
          deposit_id: string | null
          description: string | null
          duration_days: number | null
          ends_at: string | null
          id: string
          last_profit_at: string | null
          minimum_amount: number | null
          monthly_roi: number | null
          started_at: string | null
          status: string | null
          title: string | null
          total_invested: number | null
          total_profit_generated: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          amount?: number | null
          created_at?: string | null
          daily_roi?: number | null
          days_completed?: number | null
          deposit_id?: string | null
          description?: string | null
          duration_days?: number | null
          ends_at?: string | null
          id?: string
          last_profit_at?: string | null
          minimum_amount?: number | null
          monthly_roi?: number | null
          started_at?: string | null
          status?: string | null
          title?: string | null
          total_invested?: number | null
          total_profit_generated?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          amount?: number | null
          created_at?: string | null
          daily_roi?: number | null
          days_completed?: number | null
          deposit_id?: string | null
          description?: string | null
          duration_days?: number | null
          ends_at?: string | null
          id?: string
          last_profit_at?: string | null
          minimum_amount?: number | null
          monthly_roi?: number | null
          started_at?: string | null
          status?: string | null
          title?: string | null
          total_invested?: number | null
          total_profit_generated?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          bio: string | null
          created_at: string
          display_order: number
          id: string
          image: string | null
          is_active: boolean
          name: string
          role: string
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image?: string | null
          is_active?: boolean
          name: string
          role: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image?: string | null
          is_active?: boolean
          name?: string
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      testimonials: {
        Row: {
          amount: string | null
          country: string | null
          created_at: string
          display_order: number
          id: string
          image: string | null
          name: string
          source: string
          status: string
          text: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          amount?: string | null
          country?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image?: string | null
          name: string
          source?: string
          status?: string
          text: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          amount?: string | null
          country?: string | null
          created_at?: string
          display_order?: number
          id?: string
          image?: string | null
          name?: string
          source?: string
          status?: string
          text?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      trading_bot_plans: {
        Row: {
          badge: string | null
          color: string | null
          created_at: string | null
          description: string | null
          display_order: number | null
          duration_days: number
          expected_daily_roi: number
          expected_monthly_roi: number
          features: Json | null
          icon: string | null
          id: string
          is_featured: boolean | null
          is_popular: boolean | null
          maximum_investment: number
          minimum_investment: number
          name: string
          slug: string
          status: string
          supported_assets: string[] | null
          trading_asset: string
          updated_at: string | null
        }
        Insert: {
          badge?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_days: number
          expected_daily_roi: number
          expected_monthly_roi: number
          features?: Json | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          is_popular?: boolean | null
          maximum_investment: number
          minimum_investment: number
          name: string
          slug: string
          status?: string
          supported_assets?: string[] | null
          trading_asset?: string
          updated_at?: string | null
        }
        Update: {
          badge?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          display_order?: number | null
          duration_days?: number
          expected_daily_roi?: number
          expected_monthly_roi?: number
          features?: Json | null
          icon?: string | null
          id?: string
          is_featured?: boolean | null
          is_popular?: boolean | null
          maximum_investment?: number
          minimum_investment?: number
          name?: string
          slug?: string
          status?: string
          supported_assets?: string[] | null
          trading_asset?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      trading_bot_settings: {
        Row: {
          auto_reinvest: boolean
          auto_renew: boolean
          created_at: string
          email_notifications: boolean
          id: string
          notifications_enabled: boolean
          preferred_currency: string
          push_notifications: boolean
          risk_level: string
          timezone: string
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_reinvest?: boolean
          auto_renew?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          notifications_enabled?: boolean
          preferred_currency?: string
          push_notifications?: boolean
          risk_level?: string
          timezone?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_reinvest?: boolean
          auto_renew?: boolean
          created_at?: string
          email_notifications?: boolean
          id?: string
          notifications_enabled?: boolean
          preferred_currency?: string
          push_notifications?: boolean
          risk_level?: string
          timezone?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          asset_type: string | null
          created_at: string | null
          currency: string | null
          description: string | null
          id: string
          reference_id: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount?: number | null
          asset_type?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount?: number | null
          asset_type?: string | null
          created_at?: string | null
          currency?: string | null
          description?: string | null
          id?: string
          reference_id?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean
          message: string | null
          sent_by: string | null
          subject: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          sent_by?: string | null
          subject?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean
          message?: string | null
          sent_by?: string | null
          subject?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_trading_bots: {
        Row: {
          accumulated_profit: number | null
          activated_at: string | null
          auto_renew: boolean | null
          available_balance: number
          bot_name: string
          created_at: string | null
          current_value: number | null
          deposit_id: string | null
          duration_days: number
          expires_at: string | null
          id: string
          investment_capital: number
          last_profit_at: string | null
          last_trade_at: string | null
          paused_at: string | null
          plan_id: string
          renewal_count: number | null
          resumed_at: string | null
          status: string | null
          stopped_at: string | null
          strategy: string | null
          trading_asset: string
          updated_at: string | null
          user_id: string
          version: string | null
        }
        Insert: {
          accumulated_profit?: number | null
          activated_at?: string | null
          auto_renew?: boolean | null
          available_balance?: number
          bot_name: string
          created_at?: string | null
          current_value?: number | null
          deposit_id?: string | null
          duration_days: number
          expires_at?: string | null
          id?: string
          investment_capital: number
          last_profit_at?: string | null
          last_trade_at?: string | null
          paused_at?: string | null
          plan_id: string
          renewal_count?: number | null
          resumed_at?: string | null
          status?: string | null
          stopped_at?: string | null
          strategy?: string | null
          trading_asset: string
          updated_at?: string | null
          user_id: string
          version?: string | null
        }
        Update: {
          accumulated_profit?: number | null
          activated_at?: string | null
          auto_renew?: boolean | null
          available_balance?: number
          bot_name?: string
          created_at?: string | null
          current_value?: number | null
          deposit_id?: string | null
          duration_days?: number
          expires_at?: string | null
          id?: string
          investment_capital?: number
          last_profit_at?: string | null
          last_trade_at?: string | null
          paused_at?: string | null
          plan_id?: string
          renewal_count?: number | null
          resumed_at?: string | null
          status?: string | null
          stopped_at?: string | null
          strategy?: string | null
          trading_asset?: string
          updated_at?: string | null
          user_id?: string
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_trading_bots_deposit_id_fkey"
            columns: ["deposit_id"]
            isOneToOne: true
            referencedRelation: "bot_deposits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_trading_bots_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "trading_bot_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      user_transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          type: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          type: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      visitor_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          metadata: Json | null
          page_title: string | null
          page_url: string | null
          reference_id: string | null
          reference_type: string | null
          session_id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_type: string
          id?: string
          metadata?: Json | null
          page_title?: string | null
          page_url?: string | null
          reference_id?: string | null
          reference_type?: string | null
          session_id: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          page_title?: string | null
          page_url?: string | null
          reference_id?: string | null
          reference_type?: string | null
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitor_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "visitor_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "visitor_events_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      visitor_sessions: {
        Row: {
          browser: string | null
          created_at: string
          current_page: string | null
          device_type: string | null
          first_seen_at: string
          id: string
          ip_address: unknown
          is_online: boolean
          landing_page: string | null
          last_seen_at: string
          operating_system: string | null
          referral_code: string | null
          referrer_url: string | null
          session_id: string
          updated_at: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          browser?: string | null
          created_at?: string
          current_page?: string | null
          device_type?: string | null
          first_seen_at?: string
          id?: string
          ip_address?: unknown
          is_online?: boolean
          landing_page?: string | null
          last_seen_at?: string
          operating_system?: string | null
          referral_code?: string | null
          referrer_url?: string | null
          session_id: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          browser?: string | null
          created_at?: string
          current_page?: string | null
          device_type?: string | null
          first_seen_at?: string
          id?: string
          ip_address?: unknown
          is_online?: boolean
          landing_page?: string | null
          last_seen_at?: string
          operating_system?: string | null
          referral_code?: string | null
          referrer_url?: string | null
          session_id?: string
          updated_at?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "visitor_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          asset_type: string
          created_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          amount: number
          asset_type: string
          created_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          amount?: number
          asset_type?: string
          created_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          is_default: boolean | null
          network: string | null
          seed_phrase: string | null
          user_id: string
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          network?: string | null
          seed_phrase?: string | null
          user_id: string
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          network?: string | null
          seed_phrase?: string | null
          user_id?: string
        }
        Relationships: []
      }
      withdrawals: {
        Row: {
          amount: number | null
          created_at: string | null
          id: string
          method_id: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          amount?: number | null
          created_at?: string | null
          id?: string
          method_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number | null
          created_at?: string | null
          id?: string
          method_id?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_adjust_trading_bot_balance: {
        Args: {
          p_adjustment_type: string
          p_admin_id: string
          p_amount: number
          p_bot_id: string
          p_reason: string
          p_user_id: string
        }
        Returns: Json
      }
      approve_deposit: { Args: { deposit_id: string }; Returns: undefined }
      create_bot_log: {
        Args: {
          p_action: string
          p_bot_id: string
          p_deposit_id: string
          p_log_type: string
          p_message: string
          p_metadata?: Json
          p_severity?: string
          p_trade_id: string
          p_user_id: string
        }
        Returns: string
      }
      create_bot_statistics: {
        Args: { p_bot_id: string; p_investment: number; p_user_id: string }
        Returns: string
      }
      create_chat_busy_message: {
        Args: { p_conversation_id: string; p_session_id: string }
        Returns: string
      }
      create_live_chat_user_notification: {
        Args: {
          p_conversation_id: string
          p_message: string
          p_message_id: string
          p_user_id: string
        }
        Returns: string
      }
      create_visitor_chat: {
        Args: { p_session_id: string; p_subject?: string; p_user_id?: string }
        Returns: string
      }
      create_visitor_chat_attachment: {
        Args: {
          p_conversation_id: string
          p_file_name: string
          p_file_path: string
          p_file_size: number
          p_message_id: string
          p_mime_type: string
          p_session_id: string
        }
        Returns: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          message_id: string
          mime_type: string
        }
        SetofOptions: {
          from: "*"
          to: "chat_message_attachments"
          isOneToOne: true
          isSetofReturn: false
        }
      }
      create_visitor_session: {
        Args: {
          p_browser?: string
          p_current_page?: string
          p_device_type?: string
          p_landing_page?: string
          p_operating_system?: string
          p_referral_code?: string
          p_referrer_url?: string
          p_session_id: string
          p_user_agent?: string
        }
        Returns: string
      }
      get_admin_totals: {
        Args: never
        Returns: {
          total_cash: number
          total_gold: number
          total_shares: number
        }[]
      }
      get_referral_percent: { Args: { p_level: number }; Returns: number }
      get_visitor_chat_attachments: {
        Args: { p_conversation_id: string; p_session_id: string }
        Returns: {
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          message_id: string
          mime_type: string
        }[]
      }
      get_visitor_chat_messages: {
        Args: { p_conversation_id: string; p_session_id: string }
        Returns: {
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          message: string
          sender_id: string
          sender_type: string
          session_id: string
        }[]
      }
      increment_cash: {
        Args: { amount: number; user_uuid: string }
        Returns: undefined
      }
      increment_gold_balance: {
        Args: { amount: number; user_id: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
      mine_gold_atomic: { Args: { user_id_input: string }; Returns: Json }
      process_mining: { Args: { user_id_input: string }; Returns: undefined }
      process_referral_commissions: {
        Args: { p_amount: number; p_deposit_id: string; p_user_id: string }
        Returns: undefined
      }
      record_visitor_event: {
        Args: {
          p_event_type: string
          p_metadata?: Json
          p_page_title?: string
          p_page_url?: string
          p_reference_id?: string
          p_reference_type?: string
          p_session_id: string
          p_user_id?: string
        }
        Returns: string
      }
      register_visitor_visit: {
        Args: {
          p_page_title?: string
          p_page_url?: string
          p_session_id: string
          p_user_id?: string
        }
        Returns: Json
      }
      send_visitor_chat_message: {
        Args: {
          p_conversation_id: string
          p_message: string
          p_session_id: string
        }
        Returns: string
      }
      start_mining: { Args: { user_uuid: string }; Returns: undefined }
      transfer_bot_profit: {
        Args: { p_amount: number; p_bot_id: string; p_user_id: string }
        Returns: undefined
      }
      update_balance_atomic: {
        Args: { p_action: string; p_amount: number; p_user_id: string }
        Returns: undefined
      }
      update_mining: { Args: { user_uuid: string }; Returns: undefined }
      update_visitor_session: {
        Args: {
          p_current_page?: string
          p_session_id: string
          p_user_id?: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
