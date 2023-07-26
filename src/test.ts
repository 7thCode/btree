/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {between, create_node, Entry, erase, Find, Insert, is_empty_entry, is_empty_node} from "./index";

describe('BTree', () => {

	it("etc", () => {

		expect(between(100, 99, 101)).toBeTruthy();

		const entry: Entry = {
			key: null,
			value: null,
			lesser: null,
			grater: null
		}

		expect(is_empty_entry(entry)).toBeTruthy();

		const empty_node: Entry[] = create_node();

		expect(is_empty_node(empty_node, 0)).toBeTruthy();

	});

	it('seq insert', () => {

		let records: Entry[] = create_node();

		for (let index = 0; index < 100; index++) {
			Insert(records, index, index + 1);
		}

		for (let index = 0; index < 100; index++) {
			let found: Entry = Find(records, index);
			if (found) {
				expect(found.value).toBe(index + 1);
			}
		}

	});

	it('random insert', () => {

		let records: Entry[] = create_node();

		for (let index = 0; index < 100; index++) {
			var random = Math.floor(Math.random() * 1000);
			Insert(records, random, random);
		}

		for (let index = 0; index < 1000; index++) {
			let result: Entry = Find(records, index);
			if (result) {
				expect(result.value).toBe(index);
			}
		}
	});

	it('insert3', () => {

		let records: Entry[] = create_node();

		for (let index = 0; index < 1000; index++) {
			var random = Math.floor(Math.random() * 1000000);
			Insert(records, random, index + 1);
		}

	//	console.log(JSON.stringify(records));

	});
/*
	it('shrink_node', () => {

		let records: Entry[] = [
		{key: 1, value: null, lesser: null, grater: null},
		{key: 1, value: null, lesser: null, grater: null},
		{key: 2, value: null, lesser: null, grater: null},
		{key: 3, value: null, lesser: null, grater: null},
			{key: 1, value: null, lesser: null, grater: null},
			{key: null, value: null, lesser: null, grater: null},
			{key: 2, value: null, lesser: null, grater: null},
			{key: 3, value: null, lesser: null, grater: null},
			{key: 1, value: null, lesser: null, grater: null},
			{key: 2, value: null, lesser: null, grater: null},
			{key: 2, value: null, lesser: null, grater: null},
			{key: null, value: null, lesser: null, grater: null},
			{key: null, value: null, lesser: null, grater: null},
			{key: null, value: null, lesser: null, grater: null},
			{key: null, value: null, lesser: null, grater: null},
			{key: null, value: null, lesser: null, grater: null}
		]

		shrink_node(records, 0);

		console.log(records);
	})
*/
	it('erase', () => {

		let records: Entry[] = create_node();

		for (let index = 0; index < 10; index++) {
			Insert(records, index, index + 1);
		}

		erase(records, 0, 2);

		console.log(Find(records,1));
		console.log(Find(records,2));
		console.log(Find(records,3));
		console.log(Find(records,4));
		console.log(Find(records,5));
		console.log(Find(records,6));
		console.log(Find(records,7));
		console.log(Find(records,8));
		console.log(Find(records,9));
		console.log(Find(records,10));

		console.log(JSON.stringify(records));

	});


});


