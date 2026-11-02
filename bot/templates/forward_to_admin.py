# forward all messages to admin


from telegram import Update
from telegram.ext import ApplicationBuilder, MessageHandler, ContextTypes, filters
from dotenv import load_dotenv
import os

load_dotenv()
API = os.getenv("BOT_TOKEN")
ID = os.getenv("ADMIN_ID")


async def forward(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await context.bot.forward_message(chat_id=ID,
    from_chat_id=update.effective_chat.id,
    message_id=update.message.message_id)

app = ApplicationBuilder().token(API).build()
app.add_handler(MessageHandler(filters.ALL, forward))
app.run_polling()