
import os
import requests
from dotenv import load_dotenv
from telegram import Update, ReplyKeyboardMarkup, InlineKeyboardMarkup, InlineKeyboardButton
from telegram.ext import ApplicationBuilder, CommandHandler, MessageHandler, CallbackQueryHandler, ContextTypes, filters

load_dotenv()
TOKEN = os.getenv("BOT_TOKEN")

kb = ReplyKeyboardMarkup([
    ["ℹ️ About", "👤 My Info"],
    ["📊 Users", "♻️ Reset"],
], resize_keyboard=True)

inline = InlineKeyboardMarkup([
    [InlineKeyboardButton("About", callback_data="about"),
     InlineKeyboardButton("Users", callback_data="users")],
    [InlineKeyboardButton("Website", url="https://jsonplaceholder.typicode.com")],
])


async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Welcome! Select an option:", reply_markup=kb)
    await update.message.reply_text("Quick menu:", reply_markup=inline)


async def about(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = requests.get(
        "https://jsonplaceholder.typicode.com/users/1",
        timeout=10
    ).json()

    await update.message.reply_text(
        f"Name: {user['name']}\n"
        f"Username: {user['username']}\n"
        f"Email: {user['email']}\n"
        f"Phone: {user['phone']}\n"
        f"Website: {user['website']}\n"
        f"Company: {user['company']['name']}\n"
        f"City: {user['address']['city']}"
    )


async def users(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = requests.get(
        "https://jsonplaceholder.typicode.com/users",
        timeout=10
    ).json()

    await update.message.reply_text(
        "\n".join(user["name"] for user in data)
    )


async def my_info(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user = update.effective_user
    await update.message.reply_text(
        f"Name: {user.full_name}\n"
        f"Username: @{user.username}\n"
        f"ID: {user.id}"
    )


async def reset(update: Update, context: ContextTypes.DEFAULT_TYPE):
    context.user_data.clear()
    await update.message.reply_text("Bot reset.", reply_markup=kb)


async def handle(update: Update, context: ContextTypes.DEFAULT_TYPE):
    routes = {
        "ℹ️ About": about,
        "👤 My Info": my_info,
        "📊 Users": users,
        "♻️ Reset": reset,
    }

    fn = routes.get(update.message.text)
    if fn:
        await fn(update, context)


async def callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    query = update.callback_query
    await query.answer()

    if query.data == "about":
        await query.edit_message_text("About: JSONPlaceholder sample user API.")

    elif query.data == "users":
        data = requests.get(
            "https://jsonplaceholder.typicode.com/users",
            timeout=10
        ).json()
        await query.edit_message_text(
            "\n".join(user["name"] for user in data)
        )


async def media(update: Update, context: ContextTypes.DEFAULT_TYPE):
    message = update.effective_message
    file = (
        message.photo[-1] if message.photo
        else message.video or message.document
        or message.audio or message.voice
    )
    await message.reply_text(f"Media received.\nFile ID: {file.file_id}")


async def announce(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text(
        " ".join(context.args) or "Usage: /announce Your message"
    )


def main():
    if not TOKEN:
        raise RuntimeError("BOT_TOKEN missing")

    app = ApplicationBuilder().token(TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("announce", announce))
    app.add_handler(CallbackQueryHandler(callback))

    app.add_handler(MessageHandler(
        filters.PHOTO | filters.VIDEO | filters.Document.ALL |
        filters.AUDIO | filters.VOICE, media
    ))

    app.add_handler(MessageHandler(
        filters.TEXT & ~filters.COMMAND, handle
    ))

    app.run_polling()


if __name__ == "__main__":
    main()