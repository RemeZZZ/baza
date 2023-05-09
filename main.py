from telethon import TelegramClient, events, utils, errors, functions
import requests
import asyncio
import json
import random
import socks

auth = open('./auth.json', 'r')

text = auth.read()

obj = json.loads(text)

api_id = obj.get('id')
api_hash = obj.get('hash')
SESSION_NAME = 'user'

# Подключаемся к телеграмму
client = TelegramClient(SESSION_NAME, api_id, api_hash,
                        proxy=(socks.SOCKS5, '185.121.15.249', '59101'))


async def send_file(user, path):
    try:
        await client.get_dialogs()
        entiti = await client.get_entity(user)
        await client.send_file(entiti, path)
    except Exception as e:
        print(e)


async def send_text(text):
    try:
        await client.get_dialogs()
        entiti = await client.get_entity(1275852399)
        await client.send_message(entiti, text)
    except Exception as e:
        print(e)


async def repeat(interval, func, *args, **kwargs):
    while True:
        await asyncio.gather(
            func(*args, **kwargs),
            asyncio.sleep(random.randint(interval, interval * 2)),
        )


async def get_file():
    await asyncio.sleep(3)

    try:
        result = requests.get('http://127.0.0.1:3027?type=getFile')
        data = result.json()

        id = data.get('id')
        dir = data.get('dir')

        await send_file(int(id), dir)
    except:
        print('empty')


async def interval():
    await send_text('Сервер перезагружен')
    t1 = asyncio.ensure_future(repeat(10, get_file))
    await t1

loop = asyncio.get_event_loop()


@client.on(events.NewMessage(func=lambda e: e.is_private and not e.out and not e.forward))
async def main(event):
    try:
        if event.file and event.file.name:
            sender = await event.get_sender()

            dir = await event.download_media(f"./temp/{event.file.name}")

            requests.get(
                f"http://127.0.0.1:3027?path={dir}&name={event.file.name}&userId={sender.id}&type=sendFile")
    except:
        print('get error')

if __name__ == '__main__':
    with client:
        loop.run_until_complete(interval())
        client.run_until_disconnected()
