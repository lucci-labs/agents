// @ts-ignore
import input from "input";
import TelegramBot from "node-telegram-bot-api";
import { TelegramClient } from "telegram";
import { NewMessage } from "telegram/events";

export class TelegramService {
  private bot: TelegramBot | null = null;
  private client: TelegramClient | null = null;

  constructor() {}

  initBot = async () => {
    if (!process.env.TELEGRAM_BOT_TOKEN) {
      throw new Error("TELEGRAM_BOT_TOKEN must be set");
    }
    this.bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN);
  }

  initClient = async () => {
    if (!process.env.TELEGRAM_APP_ID) {
      throw new Error("TELEGRAM_APP_ID must be set");
    }
    if (!process.env.TELEGRAM_APP_HASH) {
      throw new Error("TELEGRAM_APP_HASH must be set");
    }

    this.client = new TelegramClient(
      "my_session",
      Number(process.env.TELEGRAM_APP_ID),
      process.env.TELEGRAM_APP_HASH,
      {
        connectionRetries: 5,
      }
    );
    await this.client.start({
      phoneNumber: async () => await input.text("Input phone number: "),
      password: async () => await input.text("Input 2fa: "),
      phoneCode: async () => await input.text("Input Telegram code: "),
      onError: (err) => console.log(err),
    });
  }

  regsiterCommand(command: string, callback: (msg: any) => void) {
    if (!this.bot) {
      throw new Error("Bot is not initialized");
    }
    this.bot.onText(new RegExp(command), callback);
  }

  registerMessageHandler(callback: (msg: any) => void) {
    if (!this.bot) {
      throw new Error("Bot is not initialized");
    }
    this.bot.on("message", callback);
  }

  async startPolling() {
    if (!this.bot) {
      throw new Error("Bot is not initialized");
    }
    await this.bot.startPolling();
  }

  async sendMessage(
    chatId: number,
    message: string,
    inlineKeyboard: any = [],
    force_reply: boolean = false
  ): Promise<any> {
    if (!this.bot) {
      throw new Error("Bot is not initialized");
    }
    return await this.bot.sendMessage(chatId, message, {
      parse_mode: "Markdown",
      disable_web_page_preview: true,
      reply_markup: {
        force_reply,
        inline_keyboard: inlineKeyboard,
      },
    });
  }

  async subscribeToChannel(
    channel: string,
    handler: (msg: string) => Promise<void>
  ) {
    if (!this.client) {
      throw new Error("Client is not initialized");
    }
    this.client.addEventHandler((event: NewMessage) => {
      // @ts-ignore
      const message = event.message;
      const fromChannelId = message.peerId.channelId.toString();
      if (fromChannelId != channel) {
        return;
      }

      return handler(message.message);
    }, new NewMessage({}));
  }
}
