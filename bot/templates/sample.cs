// sample in c#

using System;
using System.Threading;
using System.Threading.Tasks;
using Telegram.Bot;
using Telegram.Bot.Polling;
using Telegram.Bot.Types;

class Program
{
    static async Task Main()
    {
        var bot = new TelegramBotClient(Environment.GetEnvironmentVariable("BOT_TOKEN"));

        using var cts = new CancellationTokenSource();

        bot.StartReceiving(
            async (client, update, token) =>
            {
                if (update.Message?.Text != null)
                {
                    await client.SendTextMessageAsync(
                        update.Message.Chat.Id,
                        "Hello from C#",
                        cancellationToken: token
                    );
                }
            },
            (client, exception, token) => Task.CompletedTask,
            new ReceiverOptions(),
            cancellationToken: cts.Token
        );

        Console.ReadLine();
        cts.Cancel();
    }
}