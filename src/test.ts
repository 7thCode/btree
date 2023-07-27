/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {between, create_node, Entry, erase, find, Find, Insert, is_empty_entry, is_empty_node, insert_entry} from "./index";

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

	it("insert_entry", () => {

		let records = [
			{"key":1,"value":1,"lesser":null,"grater":null},
			{"key":3,"value":2,"lesser":null,"grater":null},
			{"key":5,"value":3,"lesser":null,"grater":null},
			{"key":null,"value":null,"lesser":null,"grater":null},
		];

		insert_entry(records, 0, 2, 5);
	});

	it('seq insert', () => {

		let records: Entry[] = create_node();

		for (let index = 0; index < 1000; index++) {
			Insert(records, index, index + 1);
		}

		for (let index = 0; index < 1000; index++) {
			let found: Entry = Find(records, index);
			if (found) {
				expect(found.value).toBe(index + 1);
			}
		}

	});

	it('random insert', () => {

		let records: Entry[] = create_node();
		const keys :number[] = [460,663,942,346,51,400,803,81,24,576,380,646,280,159,85,910,416,947,357,412,834,417,782,361,541,346,701,525,161,117,237,836,850,788,257,813,130,666,58,534,323,6,914,161,268,578,475,457,248,890];

		for (let index = 0; index < 50; index++) {
			Insert(records, keys[index], index);
		}

		for (let index = 0; index < 50; index++) {
			const found = find(records, 0, 0, keys[index]);
			const entry = found[2];
			if (entry) {
				expect(entry.key).toBe(keys[index]);
			}
		}

	});

	it('random insert 2', () => {

		let records: Entry[] = create_node();
		const keys :number[] = [];

		for (let index = 0; index < 1000; index++) {
			keys[index] = Math.floor(Math.random() * 1000);
			Insert(records, keys[index], index);
		}

		for (let index = 0; index < 1000; index++) {
			const found = find(records, 0, 0, keys[index]);
			const entry = found[2];
			if (entry) {
				expect(entry.key).toBe(keys[index]);
			}
		}

		console.log(JSON.stringify(records));
	});

});


