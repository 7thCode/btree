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

const node_size = 4;

const last = (records: Entry[]): number => {
	return records.length;
}

const between = (value: number, start: number, end: number): boolean => {
	return ((start < value) && (value < end));
}

const size_to_index = (size: number) => {
	return size - 1;
}

const to_index = (size: number) => {
	return size - 1;
}

const find = (records: Entry[],upper_node:number, current_node: number, find_key: number): [number, number, Entry | null] => {
//	console.log(upper_node, current_node, find_key);
	const _size = size(records, current_node);  // current_node.length;
	if (_size > 0) {
		const first = records[to_index(current_node)];
		const last = records[to_index(current_node) + size_to_index(_size)];
		if (!is_empty_entry(first) && (find_key < first.key) && first.lesser) {
			return find(records,current_node, first.lesser, find_key);
		} else if (!is_empty_entry(last) && (last.key < find_key) && last.grater) {
			return find(records,current_node, last.grater, find_key);
		} else {
			// scan node
			for (let offset: number = 0; offset < _size; offset++) {
				const target_entry: Entry = records[to_index(current_node) + offset];
				if (find_key === target_entry.key) {
					return [upper_node, current_node, target_entry];
				}
			}
		}
	}
	return [upper_node, current_node, null];
}

const is_empty_entry = (entry: Entry): boolean => {
	return (entry.key == null &&
		entry.value == null &&
		entry.lesser == null &&
		entry.grater == null);
}

const is_empty_node = (records: Entry[], current_node: number): boolean => {
	let result = true;
	for (let offset = 0; offset < node_size; offset++) {
		const entry: Entry = records[current_node + offset - 1];
		result = result && is_empty_entry(entry);
	}
	return result;
}

const size = (records: Entry[], current_node: number): number => {
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

const fill_rate = (records: Entry[], current_node: number): number => {
	return (size(records, current_node) / node_size);
}

const is_full = (records: Entry[], current_node: number): boolean => {
	return (node_size === size(records, current_node));
}

const compare = (records: Entry[], current_node: number, key: number): number => {
	let result: number = 0;
	const _size = size(records, current_node);
	if (_size > 0) {
		let min: Entry = records[(current_node - 1)];
		let max: Entry = records[(current_node - 1) + (_size - 1)];
		if (key < min.key) {
			result = -1;
		} else if (max.key < key) {
			result = 1;
		}
	}
	return result;
}

const max_entry = (records: Entry[], current_node: number): Entry | null => {
	let result: Entry | null = null;
	const _size = size(records, current_node);
	if (_size > 0) {
		result = records[(current_node - 1) + (_size - 1)];
	}
	return result;
}

const min_entry = (records: Entry[], current_node: number): Entry | null => {
	let result: Entry | null = null;
	const _size = size(records, current_node);
	if (_size > 0) {
		result = records[(current_node - 1)];
	}
	return result;
}


// 空きがある一つのノードを対象にエントリーを更新
const insert_entry = (records: Entry[], current_node: number, key: number, value: number): number => {
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

		let _size = size(records, current_node);
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
		records[(current_node - 1) + _size - 1].grater = grater_;

	}
	return current_node;
}

export const erase_entry = (records: Entry[], current_node: number, key: number): boolean => {

	let result: boolean = false;
	const _size = size(records, current_node);
	const lesser: Entry[] = lesser_entries(records, current_node, key); // キーより小さいエントリー
	const grater: Entry[] = grater_entries(records, current_node, key); // キーより大きいエントリー

	if (is_empty_node(records, current_node)) { // Empty

	} else if (lesser.length === 0) { // 先頭
		const min = min_entry(records, current_node);
		if (min) {
			let grater_offset = 0;
			for (; grater_offset < grater.length; grater_offset++) {
				records[(current_node - 1) + grater_offset] = grater[grater_offset];
			}
			records[(current_node - 1)].lesser = min.lesser;
			records[(current_node - 1) + grater_offset] = {key:null, value:null, lesser : null, grater:null};
			result = true;
		}
		result = true;
	} else if (grater.length === 0) { // 終端
		const max = max_entry(records, current_node);
		if (max) {
			records[(current_node - 1) + (_size - 1) -1].grater =records[(current_node - 1) + (_size - 1)].grater
			records[(current_node - 1) + (_size - 1)] = {key:null, value:null, lesser:null, grater:null};
			result = true;
		}
		result = true;
	} else { // 中間
		let offset = 0;
		for (let lesser_offset = 0; lesser_offset < lesser.length; lesser_offset++, offset++) {
			records[(current_node - 1) + offset] = lesser[lesser_offset];
		}

		for (let grater_offset = 0; grater_offset < grater.length; grater_offset++, offset++) {
			records[(current_node - 1) + offset] = grater[grater_offset];
		}

		records[(current_node - 1) + offset] = {key: null, value: null, lesser: null, grater: null};

		result = true;
	}

	/*
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

		*/

	return result;
}

const node = (records: Entry[], current_node: number): Entry[] => {
	const result : Entry[] = [];
	if (current_node > 0) {
		for (let index = 0; index < node_size; index++) {
			result.push(records[to_index(current_node) + index]);
		}
	}
	return result;
}

const lesser = (records: Entry[], current_node: number): number => {
	return records[to_index(current_node)].lesser;
}

const grater = (records: Entry[], current_node: number): number => {
	const _size = size(records, current_node);
	return records[to_index(current_node) + (_size - 1)].grater;
}

export const erase = (records: Entry[], current_node: number, key: number): boolean => {
	let result: boolean = false;
	const [upper_node, target_node, entry] = find(records, 0, current_node, key);
	if (entry) { // targetにkeyが存在
		console.log();

		const _node :Entry[] = node(records,upper_node);

		const _lesser :number = lesser(records,upper_node);
		const _grater :number = grater(records,upper_node);

		result = erase_entry(records,target_node,key);
		if (is_empty_node(records,target_node)) {
			if (records[to_index(upper_node)].lesser === current_node) {
				console.log()
			}

			const _size = size(records, upper_node);
			if (records[to_index(upper_node) + (_size - 1)].grater === current_node) {
				console.log()
			}

			records[to_index(upper_node)].lesser = null;
		}
	}
	return result;
}


const append_node = (records: Entry[], new_entries: Entry[]): number => {
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

const update_node = (records: Entry[], current_node: number, update_entries: Entry[]): void => {
	for (let offset = 0; offset < node_size; offset++) {
		records[current_node + offset - 1] = update_entries[offset];
	}
}

const lesser_entries = (records: Entry[], current_node: number, key: number): Entry[] => {
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

const grater_entries = (records: Entry[], current_node: number, key: number): Entry[] => {
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

const create_lesser_node = (records: Entry[], current_node: number, key: number): Entry[] => {
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

const create_grater_node = (records: Entry[], current_node: number, key: number): Entry[] => {
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

const split_node = (records: Entry[], current_node: number, key: number, value: number): number => {
	const lesser_entries: Entry[] = create_lesser_node(records, current_node, key); // キーより小さいエントリー
	const grater_entries: Entry[] = create_grater_node(records, current_node, key); // キーより大きいエントリー
	const lesser = append_node(records, lesser_entries) + 1; // 書き込んで
	const grater = append_node(records, grater_entries) + 1;
	const entry: Entry[] = create_node();
	entry[0] = {key: key, value: value, lesser: lesser - node_size, grater: grater - node_size};
	update_node(records, current_node, entry);　// カレントを更新
	return current_node;
}

const insert = (records: Entry[], current_node: number, key: number, value: number): number => {
	let result: number = 0;
	const [upper_node, target_node, entry] = find(records,0, current_node, key);
	if (!entry) { // target_nodeに同じキーはない
		//	console.log("insert key : " + key);
		if (target_node === 1) { // root
			if (fill_rate(records, 1) != 1) { // 空きがある
				result = insert_entry(records, 1, key, value);
			} else {
				result = split_node(records, 1, key, value);
			}
		} else if (is_empty_node(records, target_node)) {  // empty
			result = insert_entry(records, target_node, key, value);
		} else if (compare(records, target_node, key) === -1) { // minより小さい
			if (fill_rate(records, target_node) != 1) { // 空きがある
				result = insert_entry(records, target_node, key, value);
			} else {
				const min: Entry | null = min_entry(records, target_node);
				if (min) {
					if (min.lesser) {
						if (fill_rate(records, min.lesser) != 1) { // 空きがある
							result = insert_entry(records, min.lesser, key, value);
						} else {
							result = split_node(records, min.lesser, key, value);
						}
					} else {
						const test: boolean = true;
						if (test) {
							// target_node => currentの直接の親
							if (upper_node) {
								if (fill_rate(records, upper_node) != 1) { // 空きがある
									//			console.log("before upper : " + JSON.stringify(node(records, upper_node)));
									//			console.log("before target : " + JSON.stringify(node(records, target_node)));
									//			console.log("key : " + key);
									if (compare(records, target_node, key) === -1) {
										result = split_node(records, target_node, key, value);
									} else {
										result = insert_entry(records, upper_node, key, value);
									}
									//			console.log("after upper : " + JSON.stringify(node(records, upper_node)));
									//			console.log("after target : " + JSON.stringify(node(records, target_node)));
								} else {
									result = split_node(records, target_node, key, value);
								}
							} else {
								result = split_node(records, target_node, key, value);
							}


						} else {
							result = split_node(records, target_node, key, value);
						}
					}
				}
			}
		} else if (compare(records, target_node, key) === 1) { // maxより大きい
			if (fill_rate(records, target_node) != 1) { // 空きがある
				result = insert_entry(records, target_node, key, value);
			} else {
				const max: Entry | null = min_entry(records, target_node)
				if (max) {
					if (max.grater) {
						if (fill_rate(records, max.grater) != 1) { //空きがある
							result = insert_entry(records, max.grater, key, value);
						} else {
							result = split_node(records, max.grater, key, value);
						}
					} else {
						result = split_node(records, target_node, key, value);
					}
				}
			}
		} else { // 中間
			if (fill_rate(records, target_node) != 1) { // 空きがある
				result = insert_entry(records, target_node, key, value);
			} else {
				result = split_node(records, target_node, key, value);
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
	const found = find(records, 0,1, key);
	const entry = found[2];
	if (entry) {
		result = entry;
	}
	return result;
}
