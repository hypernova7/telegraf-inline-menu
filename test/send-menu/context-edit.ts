import test from 'ava'
import {Context as BaseContext} from 'telegraf'

import {MenuTemplate} from '../../source'

// This test file also tests replyMenuToContext indirectly as its the edit fallback
import {editMenuOnContext} from '../../source/send-menu'

test('text reply when not a callback query', async t => {
	t.plan(2)
	const menu = new MenuTemplate<BaseContext>('whatever')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: undefined,
		reply: async (text, extra) => {
			t.is(text, 'whatever')
			t.deepEqual(extra, {
				disable_web_page_preview: false,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('text reply when no message on callback query', async t => {
	t.plan(2)
	const menu = new MenuTemplate<BaseContext>('whatever')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
		},
		reply: async (text, extra) => {
			t.is(text, 'whatever')
			t.deepEqual(extra, {
				disable_web_page_preview: false,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('text edit when message is a text message', async t => {
	t.plan(2)
	const menu = new MenuTemplate<BaseContext>('whatever')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		editMessageText: async (text, extra) => {
			t.is(text, 'whatever')
			t.deepEqual(extra, {
				disable_web_page_preview: false,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('text reply when message is a media message', async t => {
	t.plan(3)
	const menu = new MenuTemplate<BaseContext>('whatever')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				photo: [],
			},
		},
		deleteMessage: async messageId => {
			t.is(messageId, undefined)
			return Promise.resolve(true)
		},
		reply: async (text, extra) => {
			t.is(text, 'whatever')
			t.deepEqual(extra, {
				disable_web_page_preview: false,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('text reply when message is a media message but fails with delete', async t => {
	t.plan(2)
	const menu = new MenuTemplate<BaseContext>('whatever')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				photo: [],
			},
		},
		deleteMessage: async () => {
			throw new Error('whatever went wrong')
		},
		editMessageReplyMarkup: async markup => {
			t.is(markup, undefined)
			return Promise.resolve(true)
		},
		reply: async () => {
			t.pass()
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('media reply when not a callback query', async t => {
	t.plan(2)
	const menu = new MenuTemplate<BaseContext>({media: 'whatever', type: 'photo'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: undefined,
		replyWithPhoto: async (photo, extra) => {
			t.is(photo, 'whatever')
			t.deepEqual(extra, {
				caption: undefined,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('media reply when text message', async t => {
	t.plan(3)
	const menu = new MenuTemplate<BaseContext>({media: 'whatever', type: 'photo'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'whatever',
			},
		},
		deleteMessage: async messageId => {
			t.is(messageId, undefined)
			return Promise.resolve(true)
		},
		replyWithPhoto: async (photo, extra) => {
			t.is(photo, 'whatever')
			t.deepEqual(extra, {
				caption: undefined,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('media edit when media message', async t => {
	t.plan(2)
	const menu = new MenuTemplate<BaseContext>({media: 'whatever', type: 'photo'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				photo: [],
			},
		},
		deleteMessage: async messageId => {
			t.is(messageId, undefined)
			return Promise.resolve(true)
		},
		editMessageMedia: async (media, extra) => {
			t.deepEqual(media, {
				media: 'whatever',
				type: 'photo',
				caption: undefined,
				parse_mode: undefined,
			})
			t.deepEqual(extra, {
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('does not throw message is not modified', async t => {
	t.plan(2)
	const menu = new MenuTemplate<BaseContext>('whatever')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		editMessageText: async () => {
			t.pass()
			throw new Error('lalala message is not modified lalala')
		},
	}

	await t.notThrowsAsync(async () => editMenuOnContext(menu, fakeContext as any, '/'))
})

test('does throw unrecoverable edit errors', async t => {
	t.plan(2)
	const menu = new MenuTemplate<BaseContext>('whatever')

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		editMessageText: async () => {
			t.pass()
			throw new Error('something went wrong for testing')
		},
	}

	await t.throwsAsync(
		async () => editMenuOnContext(menu, fakeContext as any, '/'),
		{message: 'something went wrong for testing'},
	)
})

test('text edit without webpage preview', async t => {
	const menu = new MenuTemplate<BaseContext>({text: 'whatever', disable_web_page_preview: true})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		editMessageText: async (_text, extra) => {
			t.deepEqual(extra, {
				disable_web_page_preview: true,
				parse_mode: undefined,
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('text edit with parse mode', async t => {
	const menu = new MenuTemplate<BaseContext>({text: 'whatever', parse_mode: 'Markdown'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		editMessageText: async (_text, extra) => {
			t.deepEqual(extra, {
				disable_web_page_preview: undefined,
				parse_mode: 'Markdown',
				reply_markup: {
					inline_keyboard: [],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('text edit with button', async t => {
	const menu = new MenuTemplate<BaseContext>('whatever')
	menu.manual({text: 'Button', callback_data: '/'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		editMessageText: async (_text, extra) => {
			t.deepEqual(extra?.reply_markup, {
				inline_keyboard: [[{
					text: 'Button',
					callback_data: '/',
				}]],
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('media edit with button', async t => {
	const menu = new MenuTemplate<BaseContext>({media: 'whatever', type: 'photo'})
	menu.manual({text: 'Button', callback_data: '/'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				photo: [],
			},
		},
		editMessageMedia: async (_media, extra) => {
			t.deepEqual(extra?.reply_markup, {
				inline_keyboard: [[{
					text: 'Button',
					callback_data: '/',
				}]],
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('location reply', async t => {
	t.plan(4)
	const menu = new MenuTemplate<BaseContext>({location: {latitude: 53.5, longitude: 10}, live_period: 666})
	menu.manual({text: 'Button', callback_data: '/'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		deleteMessage: async messageId => {
			t.is(messageId, undefined)
			return Promise.resolve(true)
		},
		replyWithLocation: async (latitude, longitude, extra) => {
			t.is(latitude, 53.5)
			t.is(longitude, 10)
			t.deepEqual(extra, {
				live_period: 666,
				reply_markup: {
					inline_keyboard: [[{text: 'Button', callback_data: '/'}]],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('venue reply', async t => {
	t.plan(6)
	const menu = new MenuTemplate<BaseContext>({venue: {location: {latitude: 53.5, longitude: 10}, title: 'A', address: 'B'}})
	menu.manual({text: 'Button', callback_data: '/'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		deleteMessage: async messageId => {
			t.is(messageId, undefined)
			return Promise.resolve(true)
		},
		replyWithVenue: async (latitude, longitude, title, address, extra) => {
			t.is(latitude, 53.5)
			t.is(longitude, 10)
			t.is(title, 'A')
			t.is(address, 'B')
			t.deepEqual(extra, {
				foursquare_id: undefined,
				foursquare_type: undefined,
				reply_markup: {
					inline_keyboard: [[{text: 'Button', callback_data: '/'}]],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})

test('invoice reply', async t => {
	t.plan(9)
	const menu = new MenuTemplate<BaseContext>({invoice: {
		title: 'A',
		description: 'B',
		start_parameter: 'C',
		currency: 'EUR',
		payload: 'D',
		provider_token: 'E',
		prices: [],
	}})
	menu.manual({text: 'Button', callback_data: '/'})

	const fakeContext: Partial<BaseContext> = {
		callbackQuery: {
			id: '666',
			from: undefined as any,
			chat_instance: '666',
			data: '666',
			message: {
				message_id: 666,
				date: 666,
				chat: undefined as any,
				text: 'Hi Bob',
			},
		},
		deleteMessage: async messageId => {
			t.is(messageId, undefined)
			return Promise.resolve(true)
		},
		replyWithInvoice: async (invoice, extra) => {
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
					inline_keyboard: [[{text: 'Button', callback_data: '/'}]],
				},
			})
			return Promise.resolve(undefined as any)
		},
	}

	await editMenuOnContext(menu, fakeContext as any, '/')
})
