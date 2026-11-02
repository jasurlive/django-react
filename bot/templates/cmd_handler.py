# let's use only CommandHandler now


from telegram.ext import ApplicationBuilder, CommandHandler
import os

async def response(update, context):
    await update.message.reply_text("hello baby!")

async def unknown:
    await update.message.reply_text("unknown command, baby!")

app = ApplicationBuilder().token(os.getenv("BOT_TOKEN")).build()
app.add_handler(CommandHandler("start", response))
app.add_handler(MessageHandler(filters.ALL, unknown))

app.run_polling()