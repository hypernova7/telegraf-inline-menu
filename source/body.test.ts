import test, {ExecutionContext} from 'ava'

import {Body, TextBody, MediaBody, LocationBody, VenueBody, InvoiceBody, isTextBody, isMediaBody, isLocationBody, isVenueBody, isInvoiceBody, getBodyText} from './body'

function mehToString(something: unknown): string {
	if (typeof something === 'object' || !something) {
		return JSON.stringify(something)
	}

	return String(something)
}

// Fake JS user fails
const EXAMPLE_WRONGS: readonly unknown[] = [
	undefined,
	null,
	true,
	false,
	{},
	'',
	() => 'whatever',
	42,
	{
		media: 'whatever',
	},
	{
		media: 'whatever',
		type: 'whatever',
	},
	{
		location: {
			latitude: 50,
		},
	},
	{
		location: {
			latitude: 50,
			longitude: 10,
		},
		text: 'Locations cant have text',
	},
	{
		venue: {
			location: {
				latitude: 50,
				longitude: 10,
			},
			title: 'A',
			address: 'B',
		},
		text: 'Venue cant have text',
	},
	{
		venue: {
			location: {
				latitude: 50,
				longitude: 10,
			},
			title: 'Venue needs address',
		},
	},
	{
		venue: {
			location: {
				latitude: 50,
				longitude: 10,
			},
			address: 'Venue needs title',
		},
	},
	{
		venue: {
			location: {
				latitude: 50,
			},
			title: 'Venue needs valid location',
			address: 'B',
		},
	},
	{
		invoice: {
			title: 'A',
			description: 'B',
		},
		text: 'Invoice cant have text',
	},
]

const EXAMPLE_TEXTS: ReadonlyArray<string | TextBody> = [
	'Hello World',
	{
		text: 'Hello World',
	},
	{
		text: 'Hello World',
		parse_mode: 'Markdown',
	},
	{
		text: 'Hello World',
		disable_web_page_preview: true,
	},
]

const EXAMPLE_MEDIA: readonly MediaBody[] = [
	{
		media: 'whatever',
		type: 'photo',
	},
	{
		media: 'whatever',
		type: 'photo',
		text: 'whatever',
	},
	{
		media: 'whatever',
		type: 'photo',
		text: 'whatever',
		parse_mode: 'Markdown',
	},
]

const EXAMPLE_LOCATION: readonly LocationBody[] = [
	{
		location: {
			latitude: 50,
			longitude: 10,
		},
	},
	{
		location: {
			latitude: 50,
			longitude: 10,
		},
		live_period: 600,
	},
]

const EXAMPLE_VENUE: VenueBody = {
	venue: {
		location: {
			latitude: 50,
			longitude: 10,
		},
		title: 'A',
		address: 'B',
	},
}

const EXAMPLE_INVOICE: InvoiceBody = {
	invoice: {
		title: 'A',
		description: 'B',
		start_parameter: 'C',
		currency: 'EUR',
		payload: 'D',
		provider_token: 'E',
		prices: [],
	},
}

function isTextBodyMacro(t: ExecutionContext, expected: boolean, maybeBody: unknown): void {
	t.is(isTextBody(maybeBody), expected)
}

isTextBodyMacro.title = (_title: string, expected: boolean, maybeBody: unknown) => `isTextBody ${String(expected)} ${mehToString(maybeBody)}`

for (const body of EXAMPLE_TEXTS) {
	test(isTextBodyMacro, true, body)
}

for (const body of [...EXAMPLE_MEDIA, ...EXAMPLE_LOCATION, EXAMPLE_VENUE, EXAMPLE_INVOICE, ...EXAMPLE_WRONGS]) {
	test(isTextBodyMacro, false, body)
}

function isMediaBodyMacro(t: ExecutionContext, expected: boolean, maybeBody: unknown): void {
	t.is(isMediaBody(maybeBody), expected)
}

isMediaBodyMacro.title = (_title: string, expected: boolean, maybeBody: unknown) => `isMediaBody ${String(expected)} ${mehToString(maybeBody)}`

for (const body of EXAMPLE_MEDIA) {
	test(isMediaBodyMacro, true, body)
}

for (const body of [...EXAMPLE_TEXTS, ...EXAMPLE_LOCATION, EXAMPLE_VENUE, EXAMPLE_INVOICE, ...EXAMPLE_WRONGS]) {
	test(isMediaBodyMacro, false, body)
}

function isLocationBodyMacro(t: ExecutionContext, expected: boolean, maybeBody: unknown): void {
	t.is(isLocationBody(maybeBody), expected)
}

isLocationBodyMacro.title = (_title: string, expected: boolean, maybeBody: unknown) => `isLocationBody ${String(expected)} ${mehToString(maybeBody)}`

for (const body of EXAMPLE_LOCATION) {
	test(isLocationBodyMacro, true, body)
}

for (const body of [...EXAMPLE_TEXTS, ...EXAMPLE_MEDIA, EXAMPLE_VENUE, EXAMPLE_INVOICE, ...EXAMPLE_WRONGS]) {
	test(isLocationBodyMacro, false, body)
}

function isVenueBodyMacro(t: ExecutionContext, expected: boolean, maybeBody: unknown): void {
	t.is(isVenueBody(maybeBody), expected)
}

isVenueBodyMacro.title = (_title: string, expected: boolean, maybeBody: unknown) => `isVenueBody ${String(expected)} ${mehToString(maybeBody)}`

for (const body of [EXAMPLE_VENUE]) {
	test(isVenueBodyMacro, true, body)
}

for (const body of [...EXAMPLE_TEXTS, ...EXAMPLE_MEDIA, ...EXAMPLE_LOCATION, ...EXAMPLE_WRONGS]) {
	test(isVenueBodyMacro, false, body)
}

function isInvoiceBodyMacro(t: ExecutionContext, expected: boolean, maybeBody: unknown): void {
	t.is(isInvoiceBody(maybeBody), expected)
}

isInvoiceBodyMacro.title = (_title: string, expected: boolean, maybeBody: unknown) => `isInvoiceBody ${String(expected)} ${mehToString(maybeBody)}`

for (const body of [EXAMPLE_INVOICE]) {
	test(isInvoiceBodyMacro, true, body)
}

for (const body of [...EXAMPLE_TEXTS, ...EXAMPLE_MEDIA, ...EXAMPLE_LOCATION, EXAMPLE_VENUE, ...EXAMPLE_WRONGS]) {
	test(isInvoiceBodyMacro, false, body)
}

test('getBodyText string', t => {
	const body: Body = 'foo'
	t.is(getBodyText(body), 'foo')
})

test('getBodyText TextBody', t => {
	const body: Body = {
		text: 'foo',
	}
	t.is(getBodyText(body), 'foo')
})
