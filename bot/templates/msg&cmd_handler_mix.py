""" only /start command gets response, anything else: unknown resp2 """

""" from telegram import Update, ReplyKeyboardMarkup we need this to add buttons
 """
 
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, filters
from dotenv import load_dotenv
import os, requests

load_dotenv()
API=os.getenv("BOT_TOKEN")


async def first (update, context):
    response="Hello baby!"
    await update.message.reply_text(response)

async def unknown (update, context):
    resp2="Unknown command, baby!"
    await update.message.reply_text(resp2)


app=ApplicationBuilder().token(API).build()
app.add_handler(CommandHandler("start", first))
"""app.add_handler(MessageHandler(filters.COMMAND, unknown))"""
app.add_handler(MessageHandler(filters.ALL, unknown))

app.run_polling()



