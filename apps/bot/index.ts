import { TelegramService } from "@agents/telegram";

class Bot {
  telegram: TelegramService;
  constructor() {
    this.telegram = new TelegramService();
    console.log("Bot initialized");
  }
  
  init = async (): Promise<void> => {
    await this.telegram.initBot();
    this.telegram.regsiterCommand("/start", this.onStart);
    this.telegram.registerMessageHandler(this.onMessage);
  }

  onStart = async (message: any): Promise<void> => {
    console.log("Start command received", message);
  }

  onMessage = async (message: any): Promise<void> => {
    if (message.text == "/start") {
      return;
    }
    console.log("Message received", message);
    this.telegram.sendMessage(message.chat.id, "Hello! Welcome to the bot.");
  }

  start = async (): Promise<void> => {
    console.log("Bot started");
    await this.telegram.startPolling();
  }
}

const main = async () => {
  const bot = new Bot();
  await bot.init();

  await bot.start()
}

main();
