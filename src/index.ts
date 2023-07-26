/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

export class Entry {
	public key: number;
	public value: number;
	public lesser: number;
	public grater: number;
}

const node_size = 4;

const key = 0;
const value = 1;
const lesser = 2;
const grater = 3;

/*
let d: any[][] = [
    [150, 3, 1, null],
    [200, 4, null, 2],
    [null, null, null, null],
    [null, null, null, null],
    [3, 0, null, null],
    [100, 1, null, null],
    [120, 2, null, null],
    [null, null, null, null],
    [360, 9, 3, 4],
    [null, null, null, null],
    [null, null, null, null],
    [null, null, null, null],
    [320, 5, null, null],
    [330, 6, null, null],
    [340, 7, null, null],
    [350, 8, null, null],
    [400, 10, null, null],
    [500, 11, null, null],
    [600, 12, null, null],
    [null, null, null, null]
];
*/


export const last = (records: Entry[]): number => {
	return records.length;
}

export const between = (value: number, start: number, end: number): boolean => {
	return ((start < value) && (value < end));
}

export const find = (records: Entry[], upper_node: number, current_node: number, find_key: number): [number, number, Entry] => {
	const _size = size(records, current_node);  // current_node.length;
	for (let index: number = 0; index < _size; index++) {
		const lesser_entry: Entry = records[current_node + index];

		// 先頭、中間
		if (index < _size - 1) {
			const grater_entry: Entry = records[current_node + (index + 1)];

			if (find_key === grater_entry.key) {
				return [upper_node, current_node, grater_entry];
			}

			if (between(find_key, lesser_entry.key, grater_entry.key)) {
				if (grater_entry.lesser) {
					return find(records, current_node, grater_entry.lesser, find_key);
				}
			}

			if (find_key > grater_entry.key) {
				if (grater_entry.grater) {
					return find(records, current_node, grater_entry.grater, find_key);
				}
			}
		}

		// 先頭、中間、終端
		if (find_key === lesser_entry.key) {
			return [upper_node, current_node, lesser_entry];
		}

		if (find_key < lesser_entry.key) {
			if (lesser_entry.lesser) {
				return find(records, current_node, lesser_entry.lesser, find_key);
			}
		}

		if (find_key > lesser_entry.key) {
			if (lesser_entry.grater) {
				return find(records, current_node, lesser_entry.grater, find_key);
			}
		}

	}
	return [upper_node, current_node, null];
}

export const is_empty_entry = (entry: Entry): boolean => {
	return (entry.key == null &&
		entry.value == null &&
		entry.lesser == null &&
		entry.grater == null);
}

export const is_empty_node = (records: Entry[], current_node: number): boolean => {
	let result = true;
	for (let index = 0; index < node_size; index++) {
		const entry: Entry = records[current_node + index];
		result = result && is_empty_entry(entry);
	}
	return result;
}

export const size = (records: Entry[], current_node: number): number => {
	let result = node_size;
	for (let index = 0; index < node_size; index++) {
		const entry: Entry = records[current_node + index];
		if (is_empty_entry(entry)) {
			result = index;
			break;
		}
	}
	return result;
}


export const fill_rate = (records: Entry[], current_node: number): number => {
	return (size(records, current_node) / node_size);
}

export const is_full = (records: Entry[], current_node: number): boolean => {
	return (node_size === size(records, current_node));
}

export const compare = (records: Entry[], current_node: number, key: number): number => {
	let result: number = 0;
	const _size: number = size(records, current_node);
	const min: Entry = records[current_node];
	const max_node = current_node + (_size - 1);
	let max: Entry = records[max_node];

	if (max_node < 0) {
		result = 0;
	} else if (key < min.key) {
		result = -1;
	} else if (key > max.key) {
		result = 1;
	}
	return result;
}

// 空きがある一つのノードを対象にエントリーを更新
export const insert_entry = (records: Entry[], current_node: number, key: number, value: number): number => {
	if (is_empty_node(records, current_node)) { // 空きノード
		records[current_node] = {key: key, value: value, lesser: null, grater: null}
	} else {
		const records_buffer: Entry[] = []; // Entryに「隙間を開ける」ため
		for (let index = 0; index < node_size; index++) {　// ノードのすべてのエントリー

			if (is_empty_entry(records[current_node + index])) { // 空きエントリーなら

				let grater = records[current_node + index - 1].grater;　// grater側を付け替えて
				records[current_node + index - 1].grater = null;

				records[current_node + index] = {
					key: key, value: value, lesser: null, grater: grater // アップデート
				}

				break;
			} else if (records[current_node + index].key > key) { // 新しいキーより大きな値があったら

				for (let offset = 0; offset < node_size - index - 1; offset++) { // 隙間を開けるため以降のエントリーを取り出す
					records_buffer[offset] = records[current_node + index + offset];
				}

				let lesser = null; //　lesser側を新しいエントリーに設定
				if (index == 0) {
					lesser = records_buffer[0].lesser;
					records_buffer[0].lesser = null;
				}

				let grater = null; //　grater側を新しいエントリーに設定
				if (index == node_size - 1) {
					grater = records_buffer[node_size - index - 1].grater;
					records_buffer[node_size - index - 1].grater = null;
				}

				records[current_node + index] = {key: key, value: value, lesser: lesser, grater: grater}; //　データを書き込む

				for (let offset = 0; offset < node_size - index - 1; offset++) { // 取り出したエントリーを隙間を開けて書き込む
					records[current_node + index + offset + 1] = records_buffer[offset];
				}
				break;
			}
		}
	}
	return current_node;
}

export const append_node = (records: Entry[], new_node: Entry[]): number => {
     new_node.forEach((entry) => {
         records.push(entry);
     });
     return last(records);
}

export const update_node = (records: Entry[], current_node: number,update_entries: Entry[]): void => {

    for(let index = 0; index < node_size; index++) {
        records[current_node + index] = update_entries[index];
    }



}

export const lesser_node = (records: Entry[], current_node: number, key: number): Entry[] => {

	const result: Entry[] = [
		{key: null, value: null, lesser: null, grater: null},
		{key: null, value: null, lesser: null, grater: null},
		{key: null, value: null, lesser: null, grater: null},
		{key: null, value: null, lesser: null, grater: null},
	]

	let dist = 0;
	for (let index = 0; index < node_size; index++) {
		if (!is_empty_entry(records[current_node + index])) {
			if (records[current_node + index].key < key) {
				result[dist++] = records[current_node + index];
			}
		} else {
			break;
		}
	}
	return result;
}

export const grater_node = (records: Entry[], current_node: number, key: number): Entry[] => {

	const result: Entry[] = [
		{key: null, value: null, lesser: null, grater: null},
		{key: null, value: null, lesser: null, grater: null},
		{key: null, value: null, lesser: null, grater: null},
		{key: null, value: null, lesser: null, grater: null},
	]

	let dist = 0;
	for (let index = 0; index < node_size; index++) {
		if (!is_empty_entry(records[current_node + index])) {
			if (records[current_node + index].key > key) {
				result[dist++] = records[current_node + index];
			}
		} else {
			break;
		}
	}

	return result;
}

export const split = (records: Entry[], current_node: number, key: number, value: number): number => {

    const lesser_entries:Entry[] = lesser_node(records, current_node, key);
    const grater_entries:Entry[] = grater_node(records, current_node, key);

    const lesser = append_node(records, lesser_entries);
    const grater = append_node(records, grater_entries);

	const entry: Entry[] = [
        {key: key, value: value, lesser: lesser - node_size, grater: grater - node_size},
        {key: null, value: null, lesser: null, grater: null},
        {key: null, value: null, lesser: null, grater: null},
        {key: null, value: null, lesser: null, grater: null},
    ]

    update_node(records, current_node, entry);

	return current_node;
}

export const insert = (records: Entry[], current_node: number, key: number, value: number): number => {
	let result: number = 0;
	const [upper_target, target, entry] = find(records, null, current_node, key);
	if (!entry) { // target_nodeに同じキーはない
		if (compare(records, target, key) === -1) { // 子のminより小さい
			if (fill_rate(records, upper_target) != 1) { // 親に空きがある
				result = insert_entry(records, upper_target, key, value);
			} else {
				result = split(records, upper_target, key, value);
			}
		} else {
			if (fill_rate(records, target) != 1) { // 空きがある
				result = insert_entry(records, target, key, value);
			} else {
				result = split(records, target, key, value);
			}
		}
	}
	return result;
}




