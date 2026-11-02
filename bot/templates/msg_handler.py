""" only uses MessageHandler, treats "/start" as string not command """
 
from telegram.ext import ApplicationBuilder, MessageHandler, filters
from dotenv import load_dotenv
import os, requests

load_dotenv()
API=os.getenv("BOT_TOKEN")

async def msg(update, context):
    text=update.message.text
    if text == "/start":
        await update.message.reply_text("hello, baby!")
    elif text == "meow":
        await update.message.reply_text("you are a cat!")
    else:
        await update.message.reply_text("unknown command, baby!")

app = ApplicationBuilder().token(API).build()

app.add_handler(MessageHandler(filters.TEXT, msg))

app.run_polling()



