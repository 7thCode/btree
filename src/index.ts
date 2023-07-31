/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

export interface Entry {
	key: any;
	value: any;
	lesser: any;
	grater: any;
}

const node_size = 100;

export const last = (records: Entry[]): number => {
	return records.length;
}

export const between = (value: number, start: number, end: number): boolean => {
	return ((start < value) && (value < end));
}

const size_to_index = (size: number) => {
	return size - 1;
}

const to_index = (size: number) => {
	return size - 1;
}

export const find = (records: Entry[], upper_node: number, current_node: number, find_key: number): [number, number, Entry | null] => {
	const _size = size(records, current_node);  // current_node.length;
	if (_size > 0) {
		const first = records[to_index(current_node)];
		const last = records[to_index(current_node) + size_to_index(_size)];

		if (!is_empty_entry(first) && (find_key < first.key) && first.lesser) {
			return find(records, current_node, first.lesser, find_key);
		} else if (!is_empty_entry(last) && (last.key < find_key) && last.grater) {
			return find(records, current_node, last.grater, find_key);
		} else {
			for (let offset: number = 0; offset < _size; offset++) {
				const target_entry: Entry = records[to_index(current_node) + offset];
				if (find_key === target_entry.key) {
					return [upper_node, current_node, target_entry];
				}
			}
		}
	}
	return [0, current_node, null];
}

export const is_empty_entry = (entry: Entry): boolean => {
	return (entry.key == null &&
		entry.value == null &&
		entry.lesser == null &&
		entry.grater == null);
}

export const is_empty_node = (records: Entry[], current_node: number): boolean => {
	let result = true;
	for (let offset = 0; offset < node_size; offset++) {
		const entry: Entry = records[current_node + offset - 1];
		result = result && is_empty_entry(entry);
	}
	return result;
}

export const size = (records: Entry[], current_node: number): number => {
	let result = node_size;
	for (let offset = 0; offset < node_size; offset++) {
		const entry: Entry = records[(current_node - 1) + offset];
		if (is_empty_entry(entry)) {
			result = offset;
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
	let min: Entry = records[(current_node)];
	if (key < min.key) {
		result = -1;
	}
	return result;
}

// 空きがある一つのノードを対象にエントリーを更新
export const insert_entry = (records: Entry[], current_node: number, key: number, value: number): number => {
	if (is_empty_node(records, current_node)) { // 空きノード
		records[(current_node - 1)] = {key: key, value: value, lesser: null, grater: null}
	} else {
		const lesser: Entry[] = lesser_entries(records, current_node, key); // キーより小さいエントリー
		const grater: Entry[] = grater_entries(records, current_node, key); // キーより大きいエントリー

		let offset = 0;
		for (let lesser_size = 0; lesser_size < lesser.length; lesser_size++, offset++) {
			records[(current_node - 1) + offset] = lesser[lesser_size];
		}

		records[(current_node - 1) + offset] = {key: key, value: value, lesser: null, grater: null};
		offset++;

		for (let grater_size = 0; grater_size < grater.length; grater_size++, offset++) {
			records[(current_node - 1) + offset] = grater[grater_size];
		}

		let _size = size(records,current_node);
		let lesser_ = 0;
		let grater_ = 0;
		for (let offset = 0; offset < _size; offset++) {
			if (!is_empty_entry(records[(current_node - 1) + offset])) {
				if (records[(current_node - 1) + offset].lesser) {
					lesser_ = records[(current_node - 1) + offset].lesser;
					records[(current_node - 1) + offset].lesser = null;
				}
				if (records[(current_node - 1) + offset].grater) {
					grater_ = records[(current_node - 1) + offset].grater;
					records[(current_node - 1) + offset].grater = null;
				}
			}
		}

		records[(current_node - 1)].lesser = lesser_;
		records[(current_node - 1) + _size -1].grater = grater_;

	}
	return current_node;
}

export const append_node = (records: Entry[], new_entries: Entry[]): number => {
	for (let offset = 0; offset < node_size; offset++) {
		records.push(new_entries[offset]);
	}
	return last(records);
}

export const create_node = (): Entry[] => {
	const result: Entry[] = [];
	for (let offset = 0; offset < node_size; offset++) {
		result.push({key: null, value: null, lesser: null, grater: null});
	}
	return result;
}

export const update_node = (records: Entry[], current_node: number, update_entries: Entry[]): void => {
	for (let offset = 0; offset < node_size; offset++) {
		records[current_node + offset - 1] = update_entries[offset];
	}
}

export const lesser_entries = (records: Entry[], current_node: number, key: number): Entry[] => {
	const result: Entry[] = [];
	let dist = 0;
	for (let offset = 0; offset < node_size; offset++) {
		if (!is_empty_entry(records[current_node + offset - 1])) {
			if (records[current_node + offset - 1].key < key) {
				result[dist++] = records[current_node + offset - 1];
			}
		} else {
			break;
		}
	}
	return result;
}

export const grater_entries = (records: Entry[], current_node: number, key: number): Entry[] => {
	const result: Entry[] = [];
	let dist = 0;
	for (let offset = 0; offset < node_size; offset++) {
		if (!is_empty_entry(records[current_node + offset - 1])) {
			if (records[current_node + offset - 1].key > key) {
				result[dist++] = records[current_node + offset - 1];
			}
		} else {
			break;
		}
	}
	return result;
}

export const create_lesser_node = (records: Entry[], current_node: number, key: number): Entry[] => {
	const result: Entry[] = create_node();
	let dist = 0;
	for (let offset = 0; offset < node_size; offset++) {
		if (!is_empty_entry(records[current_node + offset - 1])) {
			if (records[current_node + offset - 1].key < key) {
				result[dist++] = records[current_node + offset - 1];
			}
		} else {
			break;
		}
	}
	return result;
}

export const create_grater_node = (records: Entry[], current_node: number, key: number): Entry[] => {
	const result: Entry[] = create_node();
	let dist = 0;
	for (let offset = 0; offset < node_size; offset++) {
		if (!is_empty_entry(records[current_node + offset - 1])) {
			if (records[current_node + offset - 1].key > key) {
				result[dist++] = records[current_node + offset - 1];
			}
		} else {
			break;
		}
	}
	return result;
}

export const split_node = (records: Entry[], current_node: number, key: number, value: number): number => {
	const lesser_entries: Entry[] = create_lesser_node(records, current_node, key); // キーより小さいエントリー
	const grater_entries: Entry[] = create_grater_node(records, current_node, key); // キーより大きいエントリー
	const lesser = append_node(records, lesser_entries) + 1; // 書き込んで
	const grater = append_node(records, grater_entries) + 1;
	const entry: Entry[] = create_node();
	entry[0] = {key: key, value: value, lesser: lesser - node_size, grater: grater - node_size};
	update_node(records, current_node, entry);　// カレントを更新
	return current_node;
}

export const insert = (records: Entry[], current_node: number, key: number, value: number): number => {
	let result: number = 0;
	const [upper_target_record, target_record, entry] = find(records, 1, current_node, key);
	if (!entry) { // target_nodeに同じキーはない
		if (compare(records, target_record, key) === -1) { // minより小さい
			if (upper_target_record) {
				if (fill_rate(records, upper_target_record) != 1) { // 親に空きがある
					result = insert_entry(records, upper_target_record, key, value);
				} else {
					result = split_node(records, target_record, key, value);
				}
			} else {
				result = split_node(records, target_record, key, value);
			}
		} else {
			if (fill_rate(records, target_record) != 1) { // 空きがある
				result = insert_entry(records, target_record, key, value);
			} else {
				result = split_node(records, target_record, key, value);
			}
		}
	}
	return result;
}

export const erase = (records: Entry[], current_node: number, key: number): number => {
	let result: number = 0;
	const [upper_target, target, entry] = find(records, 0, current_node, key);
	if (entry) { // targetにkeyが存在
		if ((entry.lesser == null) && (entry.grater == null)) { // 中間
			for (let offset = 0; offset < node_size; offset++) {
				let entry = records[target + offset - 1];
				if (entry.key == key) {
					for (; offset < node_size; offset++) {
						records[target + offset - 1] = records[target + offset + 1 - 1];
					}
					records[target + node_size - 1] = {key: null, value: null, lesser: null, grater: null};  // 空き
				}
			}
		}
	}
	return result;
}

export const Insert = (records: Entry[], key: number, value: number): number => {
	return insert(records, 1, key, value);
}

export const Find = (records: Entry[], key: number): Entry => {
	let result: any = null;
	const found = find(records, 0, 1, key);
	const entry = found[2];
	if (entry) {
		result = entry;
	}
	return result;
}
