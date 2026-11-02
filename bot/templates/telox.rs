use teloxide::prelude::*;

#[tokio::main]
async fn main() {
    let bot = Bot::from_env();

    teloxide::repl(bot, |message| async move {
        message.answer("Hello from Rust").await?;
        respond(())
    })
    .await;
}