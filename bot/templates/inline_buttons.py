#  adding InlineButtons

# no message + callbacks → only inline keyboard
# message-based interaction → reply keyboard

from telegram import Update, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import CommandHandler, CallbackQueryHandler, ContextTypes, ApplicationBuilder
from dotenv import load_dotenv
import os

load_dotenv()
API = os.getenv("BOT_TOKEN")

async def sendkeybs(update: Update, context: ContextTypes.DEFAULT_TYPE):
    keyboard = InlineKeyboardMarkup([
        [InlineKeyboardButton("InlineKeyb1", callback_data="k1"),
         InlineKeyboardButton("InlineKeyb2", callback_data="k2")],
        [InlineKeyboardButton("InlineKeyb3", callback_data="k3")]
    ])

    await update.message.reply_text("Choose:", reply_markup=keyboard)

async def handle_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "k1":
        text = "You pressed button 1"
    elif query.data == "k2":
        text = "You pressed button 2"
    else:
        text = "You pressed button 3"

    await query.edit_message_text(text)

app = ApplicationBuilder().token(API).build()
app.add_handler(CommandHandler("start", sendkeybs))
app.add_handler(CallbackQueryHandler(handle_callback))
app.run_polling()