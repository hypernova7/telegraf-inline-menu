import {Context as BaseContext, Telegram} from 'telegraf'
import test from 'ava'

import {MenuTemplate} from '../../source'
import {MEDIA_TYPES} from '../../source/body'

import {generateSendMenuToChatFunction} from '../../source/send-menu'

test('text', async t => {
	const menu = new MenuTemplate<BaseContext>('whatever')

	const fakeTelegram: Partial<Telegram> = {
		sendMessage: async (chatId, text, extra) => {
			t.is(chatId, 666)
			t.is(text, 'whatever')
			t.deepEqual(extra, {
				disable_web_page_preview: false,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve({} as any)
		},
	}

	const sendMenu = generateSendMenuToChatFunction(fakeTelegram as any, menu, '/')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
		},
	}

	await sendMenu(666, fakeContext as any)
})

for (const mediaType of MEDIA_TYPES) {
	test('media ' + mediaType, async t => {
		const menu = new MenuTemplate<BaseContext>({media: 'whatever', type: mediaType})

		const sendFunction = async (chatId: unknown, media: unknown, extra: unknown) => {
			t.is(chatId, 666)
			t.is(media, 'whatever')
			t.deepEqual(extra, {
				caption: undefined,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve({} as any)
		}

		const fakeTelegram: Partial<Telegram> = {
			sendAnimation: sendFunction,
			sendAudio: sendFunction,
			sendDocument: sendFunction,
			sendPhoto: sendFunction,
			sendVideo: sendFunction,
		}

		const sendMenu = generateSendMenuToChatFunction(fakeTelegram as any, menu, '/')

		const fakeContext: Partial<BaseContext> = {
			callbackQuery: {
				id: '666',
				from: undefined as any,
				chat_instance: '666',
				data: '666',
			},
		}

		await sendMenu(666, fakeContext as any)
	})
}

test('location', async t => {
	const menu = new MenuTemplate<BaseContext>({location: {latitude: 53.5, longitude: 10}, live_period: 666})

	const fakeTelegram: Partial<Telegram> = {
		sendLocation: async (chatId, latitude, longitude, extra) => {
			t.is(chatId, 666)
			t.is(latitude, 53.5)
			t.is(longitude, 10)
			t.deepEqual(extra, {
				live_period: 666,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve({} as any)
		},
	}

	const sendMenu = generateSendMenuToChatFunction(fakeTelegram as any, menu, '/')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
		},
	}

	await sendMenu(666, fakeContext as any)
})

test('venue', async t => {
	const menu = new MenuTemplate<BaseContext>({venue: {location: {latitude: 53.5, longitude: 10}, title: 'A', address: 'B'}})

	const fakeTelegram: Partial<Telegram> = {
		sendVenue: async (chatId, latitude, longitude, title, address, extra) => {
			t.is(chatId, 666)
			t.is(latitude, 53.5)
			t.is(longitude, 10)
			t.is(title, 'A')
			t.is(address, 'B')
			t.deepEqual(extra, {
				foursquare_id: undefined,
				foursquare_type: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve({} as any)
		},
	}

	const sendMenu = generateSendMenuToChatFunction(fakeTelegram as any, menu, '/')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
		},
	}

	await sendMenu(666, fakeContext as any)
})

test('invoice', async t => {
	const menu = new MenuTemplate<BaseContext>({invoice: {
		title: 'A',
		description: 'B',
		start_parameter: 'C',
		currency: 'EUR',
		payload: 'D',
		provider_token: 'E',
		prices: [],
	}})

	const fakeTelegram: Partial<Telegram> = {
		sendInvoice: async (chatId, invoice, extra) => {
			t.is(chatId, 666)
			const {title, description, start_parameter, currency, payload, provider_token, prices} = invoice
			t.is(title, 'A')
			t.is(description, 'B')
			t.is(start_parameter, 'C')
			t.is(currency, 'EUR')
			t.is(payload, 'D')
			t.is(provider_token, 'E')
			t.deepEqual(prices, [])
			t.deepEqual(extra, {
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve({} as any)
		},
	}

	const sendMenu = generateSendMenuToChatFunction(fakeTelegram as any, menu, '/')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
		},
	}

	await sendMenu(666, fakeContext as any)
})
