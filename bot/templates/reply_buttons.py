#  adding ReplyKeyboardMarkup

# sends a message in the chat, we harcode replies according to "string" of keyboard messages


from telegram import Update, ReplyKeyboardMarkup
from telegram.ext import CommandHandler, ContextTypes, ApplicationBuilder
from dotenv import load_dotenv
import os


load_dotenv()
API = os.getenv("BOT_TOKEN")

async def sendkeybs(update: Update, context: ContextTypes.DEFAULT_TYPE):

    send_keyboards = ReplyKeyboardMarkup([
        ["ReplyKeyb1", "ReplyKeyb2"],
        ["ReplyKeyb3 wide"]
    ], resize_keyboard=True)
    
    await update.message.reply_text("Choose any buttons below:", reply_markup=send_keyboards)


app = ApplicationBuilder().token(API).build()
app.add_handler(CommandHandler("start", sendkeybs))

app.run_polling()
