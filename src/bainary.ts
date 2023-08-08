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

/*
* */
const last = (records: Entry[]): number => {
	return records.length;
}

/*
* */
const to_index = (size: number) => {
	return size - 1;
}

/*
* */
const find = (records: Entry[], upper_node: number, current_node: number, find_key: number): [number, number, Entry | null] => {
	const _size = size(records, current_node);  // current_node.length;
	if (_size > 0) {
		const min: Entry = records[to_index(current_node)];
		const max: Entry = records[to_index(current_node) + to_index(_size)];
		if (!is_empty_entry(min) && (find_key < min.key) && min.lesser) {
			return find(records, current_node, min.lesser, find_key);
		} else if (!is_empty_entry(max) && (max.key < find_key) && max.grater) {
			return find(records, current_node, max.grater, find_key);
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

/*
* */
const is_empty_entry = (entry: Entry): boolean => {
	return (entry.key == null &&
		entry.value == null &&
		entry.lesser == null &&
		entry.grater == null);
}

/*
* */
const is_empty_node = (records: Entry[], current_node: number): boolean => {
	let result = true;
	for (let offset = 0; offset < node_size; offset++) {
		const entry: Entry = records[current_node + to_index(offset)];
		result = result && is_empty_entry(entry);
	}
	return result;
}

/*
* */
const size = (records: Entry[], current_node: number): number => {
	let result = node_size;
	for (let offset = 0; offset < node_size; offset++) {
		const entry: Entry = records[to_index(current_node) + offset];
		if (is_empty_entry(entry)) {
			result = offset;
			break;
		}
	}
	return result;
}

/*
* */
const fill_rate = (records: Entry[], current_node: number): number => {
	return (size(records, current_node) / node_size);
}

/*
* */
const compare = (records: Entry[], current_node: number, key: number): number => {
	let result: number = 0;
	const _size = size(records, current_node);
	if (_size > 0) {
		let min: Entry = records[to_index(current_node)];
		let max: Entry = records[to_index(current_node) + to_index(_size)];
		if (key < min.key) {
			result = -1;
		} else if (max.key < key) {
			result = 1;
		}
	}
	return result;
}

/*
* */
const min_entry = (records: Entry[], current_node: number, size: number): Entry | null => {
	let result: Entry | null = null;
	if (size > 0) {
		result = records[to_index(current_node)];
	}
	return result;
}

/*
* */
const max_entry = (records: Entry[], current_node: number, size: number): Entry | null => {
	let result: Entry | null = null;
	if (size > 0) {
		result = records[to_index(current_node) + to_index(size)];
	}
	return result;
}

// 空きがある一つのノードを対象にエントリーを更新
const insert_entry = (records: Entry[], current_node: number, key: number, value: number): number => {
	if (is_empty_node(records, current_node)) { // 空きノード
		records[to_index(current_node)] = {key: key, value: value, lesser: null, grater: null}
	} else {
		const lesser: Entry[] = lesser_entries(records, current_node, key); // キーより小さいエントリー
		const grater: Entry[] = grater_entries(records, current_node, key); // キーより大きいエントリー

		let offset = 0;
		for (let lesser_size = 0; lesser_size < lesser.length; lesser_size++, offset++) {
			records[to_index(current_node) + offset] = lesser[lesser_size];
		}

		records[to_index(current_node) + offset] = {key: key, value: value, lesser: null, grater: null};
		offset++;

		for (let grater_size = 0; grater_size < grater.length; grater_size++, offset++) {
			records[to_index(current_node) + offset] = grater[grater_size];
		}

		let _size = size(records, current_node);
		let lesser_ = null;
		let grater_ = null;
		for (let offset = 0; offset < _size; offset++) {
			if (!is_empty_entry(records[to_index(current_node) + offset])) {
				if (records[to_index(current_node) + offset].lesser) {
					lesser_ = records[to_index(current_node) + offset].lesser;
					records[to_index(current_node) + offset].lesser = null;
				}
				if (records[to_index(current_node) + offset].grater) {
					grater_ = records[to_index(current_node) + offset].grater;
					records[to_index(current_node) + offset].grater = null;
				}
			}
		}
		records[to_index(current_node)].lesser = lesser_;
		records[to_index(current_node) + to_index(_size)].grater = grater_;
	}
	return current_node;
}

/*
* */
export const erase_entry = (records: Entry[], current_node: number, key: number): boolean => {
	let result: boolean = false;
	const _size = size(records, current_node);
	const lesser: Entry[] = lesser_entries(records, current_node, key); // キーより小さいエントリー
	const grater: Entry[] = grater_entries(records, current_node, key); // キーより大きいエントリー

	if (is_empty_node(records, current_node)) { // Empty
		result = true;
	} else if (lesser.length === 0) { // 先頭
		const min = min_entry(records, current_node, _size);
		if (min) {
			let grater_offset = 0;
			for (; grater_offset < grater.length; grater_offset++) {
				records[to_index(current_node) + grater_offset] = grater[grater_offset];
			}
			records[to_index(current_node)].lesser = min.lesser;
			records[to_index(current_node) + grater_offset] = {key: null, value: null, lesser: null, grater: null};
			result = true;
		}
		result = true;
	} else if (grater.length === 0) { // 終端
		const max = max_entry(records, current_node, _size);
		if (max) {
			records[to_index(current_node) + to_index(_size) - 1].grater = records[to_index(current_node) + to_index(_size)].grater
			records[to_index(current_node) + to_index(_size)] = {key: null, value: null, lesser: null, grater: null};
			result = true;
		}
		result = true;
	} else { // 中間
		let offset = 0;
		for (let lesser_offset = 0; lesser_offset < lesser.length; lesser_offset++, offset++) {
			records[to_index(current_node) + offset] = lesser[lesser_offset];
		}

		for (let grater_offset = 0; grater_offset < grater.length; grater_offset++, offset++) {
			records[to_index(current_node) + offset] = grater[grater_offset];
		}
		records[to_index(current_node) + offset] = {key: null, value: null, lesser: null, grater: null};
		result = true;
	}
	return result;
}


/*
* */
const lesser = (records: Entry[], current_node: number): number => {
	return records[to_index(current_node)].lesser;
}

/*
* */
const grater = (records: Entry[], current_node: number): number => {
	const _size = size(records, current_node);
	return records[to_index(current_node) + to_index(_size)].grater;
}

/*
* */
export const erase = (records: Entry[], current_node: number, key: number): boolean => {
	let result: boolean = false;
	const [upper_node, target_node, entry] = find(records, 0, current_node, key);
	if (entry) { // targetにkeyが存在
		const target_size = size(records, target_node);
		if (target_size > 1) {
			result = erase_entry(records, target_node, key);
		} else {
			if (upper_node) { // last one

				const _lesser: number = lesser(records, target_node);
				const _grater: number = grater(records, target_node);
				if (_lesser) {
					if (!is_empty_node(records, _lesser)) {
						const lesser_size = size(records, _lesser);
						update_node(records, target_node, node(records, _lesser));
						update_node(records, _lesser, create_node());
						records[to_index(target_node)].lesser = null;
						records[to_index(target_node) + to_index(lesser_size)].grater = _grater;
					}
				} else if (_grater) {
					if (!is_empty_node(records, _grater)) {
						const grater_size = size(records, _grater);
						update_node(records, target_node, node(records, _grater));
						update_node(records, _grater, create_node());
				//		records[to_index(target_node)].lesser = _lesser;
						records[to_index(target_node) + to_index(grater_size)].grater = null;
					}
				} else if (!(_lesser || _grater)) {

						const upper_size = size(records, upper_node);
						if (records[to_index(upper_node)+ to_index(upper_size)].grater == target_node) {
							records[to_index(upper_node)+ to_index(upper_size)].grater = null;
						}
						if (records[to_index(upper_node)].lesser == target_node) {
							records[to_index(upper_node)].lesser = null;
						}

					update_node(records, target_node, create_node());
				}


			/*

				const target_lesser: number = lesser(records, target_node);
				const target_grater: number = grater(records, target_node);
				const upper_size = size(records, upper_node);
			//	records[target_lesser + to_index(target_size)].grater = records[to_index(target_node)].grater;
			//	records[target_grater].lesser = records[to_index(target_node)].lesser;

				const key1 = records[to_index(upper_node)+ to_index(upper_size)].key;
				const key2 = records[to_index(target_node)+ to_index(target_size)].key;

				records[to_index(upper_node)+ to_index(upper_size)].grater = records[to_index(target_node)+ to_index(target_size)].lesser;


			//	if (key1 < key2) {
			//		records[to_index(upper_node)+ to_index(upper_size)].grater = records[to_index(target_node)+ to_index(target_size)].lesser;
			//	} else {
			//		records[to_index(upper_node)+ to_index(upper_size)].lesser = records[to_index(target_node)+ to_index(target_size)].grater;
			//	}
				result = erase_entry(records, target_node, key);
*/
		/*		if (target_node === upper_lesser) {
					if (is_empty_node(records, target_node)) {
						records[to_index(upper_node)].lesser = target_grater;
					} else {
						records[to_index(upper_node)].lesser = upper_lesser;
					}
				} else if (target_node === upper_grater) {
					if (is_empty_node(records, target_node)) {
						records[to_index(upper_node) + to_index(upper_size)].grater = target_lesser;
					} else {
						records[to_index(upper_node) + to_index(upper_size)].grater = upper_grater;
					}
				}*/
			} else { // root
		//		console.log(JSON.stringify(records));
				const _lesser: number = lesser(records, target_node);
				const _grater: number = grater(records, target_node);
				if (_lesser) {
					if (!is_empty_node(records, _lesser)) {
						const lesser_size = size(records, _lesser);
						update_node(records, target_node, node(records, _lesser));
						update_node(records, _lesser, create_node());
					//	records[to_index(target_node)].lesser = null;
						records[to_index(target_node) + to_index(lesser_size)].grater = _grater;
					}
				} else if (_grater) {
					if (!is_empty_node(records, _grater)) {
						const grater_size = size(records, _grater);
						update_node(records, target_node, node(records, _grater));
						update_node(records, _grater, create_node());
					//	records[to_index(target_node)].lesser = _lesser;
						records[to_index(target_node)+ to_index(grater_size)].grater = null;
					}
				} else if (!(_lesser || _grater)) {
					update_node(records, target_node, create_node());
				}
		//		console.log(JSON.stringify(records));
			}
		}
	}
	return result;
}

/*
* */
export const node = (records: Entry[], current_node: number): Entry[] => {
	const result: Entry[] = [];
	if (current_node > 0) {
		for (let index = 0; index < node_size; index++) {
			result.push(records[to_index(current_node) + index]);
		}
	}
	return result;
}

/*
* */
const append_node = (records: Entry[], new_entries: Entry[]): number => {
	for (let offset = 0; offset < node_size; offset++) {
		records.push(new_entries[offset]);
	}
	return last(records);
}

/*
* */
const create_node = (): Entry[] => {
	const result: Entry[] = [];
	for (let offset = 0; offset < node_size; offset++) {
		result.push({key: null, value: null, lesser: null, grater: null});
	}
	return result;
}

/*
* */
export const update_node = (records: Entry[], current_node: number, update_entries: Entry[]): void => {
	for (let offset = 0; offset < node_size; offset++) {
		records[current_node + to_index(offset)] = update_entries[offset];
	}
}

/*
* */
const lesser_entries = (records: Entry[], current_node: number, key: number): Entry[] => {
	const result: Entry[] = [];
	let dist = 0;
	for (let offset = 0; offset < node_size; offset++) {
		if (!is_empty_entry(records[current_node + to_index(offset)])) {
			if (records[current_node + to_index(offset)].key < key) {
				result[dist++] = records[current_node + to_index(offset)];
			}
		} else {
			break;
		}
	}
	return result;
}

/*
* */
const grater_entries = (records: Entry[], current_node: number, key: number): Entry[] => {
	const result: Entry[] = [];
	let dist = 0;
	for (let offset = 0; offset < node_size; offset++) {
		if (!is_empty_entry(records[current_node + to_index(offset)])) {
			if (records[current_node + to_index(offset)].key > key) {
				result[dist++] = records[current_node + to_index(offset)];
			}
		} else {
			break;
		}
	}
	return result;
}

/*
* */
const create_lesser_node = (records: Entry[], current_node: number, key: number): Entry[] => {
	const result: Entry[] = create_node();
	let dist = 0;
	for (let offset = 0; offset < node_size; offset++) {
		if (!is_empty_entry(records[current_node + to_index(offset)])) {
			if (records[current_node + to_index(offset)].key < key) {
				result[dist++] = records[current_node + to_index(offset)];
			}
		} else {
			break;
		}
	}
	return result;
}

/*
* */
const create_grater_node = (records: Entry[], current_node: number, key: number): Entry[] => {
	const result: Entry[] = create_node();
	let dist = 0;
	for (let offset = 0; offset < node_size; offset++) {
		if (!is_empty_entry(records[current_node + to_index(offset)])) {
			if (records[current_node + to_index(offset)].key > key) {
				result[dist++] = records[current_node + to_index(offset)];
			}
		} else {
			break;
		}
	}
	return result;
}

/*
* */
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

const insert_entry_2 = (records: Entry[], current_node: number, key: number, value: number): number => {

	const lesser: Entry[] = lesser_entries(records, current_node, key); // キーより小さいエントリー
	const grater: Entry[] = grater_entries(records, current_node, key); // キーより大きいエントリー

	let offset = 0;
	for (let lesser_size = 0; lesser_size < lesser.length; lesser_size++, offset++) {
		records[to_index(current_node) + offset] = lesser[lesser_size];
	}

	records[to_index(current_node) + offset] = {key: key, value: value, lesser: null, grater: null};
	offset++;

	for (let grater_size = 0; grater_size < grater.length; grater_size++, offset++) {
		records[to_index(current_node) + offset] = grater[grater_size];
	}

	let _size = size(records, current_node) + 1;
	let lesser_ = null;
	let grater_ = null;
	for (let offset = 0; offset < _size; offset++) {
		if (!is_empty_entry(records[to_index(current_node) + offset])) {
			if (records[to_index(current_node) + offset].lesser) {
				lesser_ = records[to_index(current_node) + offset].lesser;
				records[to_index(current_node) + offset].lesser = null;
			}
			if (records[to_index(current_node) + offset].grater) {
				grater_ = records[to_index(current_node) + offset].grater;
				records[to_index(current_node) + offset].grater = null;
			}
		}
	}
	records[to_index(current_node)].lesser = lesser_;
	records[to_index(current_node) + to_index(_size)].grater = grater_;

	return current_node;
}

export const split_node_2 = (records: Entry[], current_node: number, key: number, value: number): number => {

	const node: Entry[] = [];
	for (let offset = 0; offset < node_size + 1; offset++) {
		node.push(records[to_index(current_node) + offset]);
	}

	insert_entry_2(node, 1, key, value)

	const lesser_entries: Entry[] = create_node();
	const grater_entries: Entry[] = create_node();

	const _size = size(node, 1);
	let source_offset: number = 0;
	let dist_offset: number = 0;
	for (; source_offset < Math.trunc(_size / 2); source_offset++, dist_offset++) {
		lesser_entries[dist_offset] = node[to_index(1) + source_offset];
	}
	dist_offset = 0;
	source_offset += 1;

	const center = node[to_index(1) + Math.trunc(_size / 2)];

	for (; source_offset < _size + 1; source_offset++, dist_offset++) {
		grater_entries[dist_offset] = node[to_index(1) + source_offset];
	}

	const lesser = append_node(records, lesser_entries) + 1; // 書き込んで
	const grater = append_node(records, grater_entries) + 1;
	const entry: Entry[] = create_node();
	entry[0] = {key: center.key, value: center.value, lesser: lesser - node_size, grater: grater - node_size};
	update_node(records, current_node, entry);　// カレントを更新
	return current_node;
}

/*
* */
const insert_or_split = (records: Entry[], target_node: number, key: number, value: number) => {
	let result: number = 0;
	if (fill_rate(records, target_node) != 1) { // 空きがある
		result = insert_entry(records, target_node, key, value);
	} else {
		result = split_node_2(records, target_node, key, value);
	}
	return result;
}

/*
* */
const insert = (records: Entry[], current_node: number, key: number, value: number): number => {
	let result: number = 0;
	const _size = size(records, current_node);  // current_node.length;
	const [upper_node, target_node, entry] = find(records, 0, current_node, key);
	if (!entry) { // target_nodeに同じキーはない
		if (is_empty_node(records, target_node)) {  // empty
			result = insert_entry(records, target_node, key, value);
		} else if (compare(records, target_node, key) === -1) { // minより小さい
			if (fill_rate(records, target_node) != 1) { // 空きがある
				result = insert_entry(records, target_node, key, value);
			} else {
				const min: Entry | null = min_entry(records, target_node, _size);
				if (min) {
					if (min.lesser) {
						result = insert_or_split(records, min.lesser, key, value);
					} else {
						// target_node => currentの直接の親
						if (upper_node) {
							if (fill_rate(records, upper_node) != 1) { // 空きがある
								if (compare(records, target_node, key) === -1) {
									result = split_node_2(records, target_node, key, value);
								} else {
									result = insert_entry(records, upper_node, key, value);
								}
							} else {
								result = split_node_2(records, target_node, key, value);
							}
						} else {
							result = split_node_2(records, target_node, key, value);
						}
					}
				}
			}
		} else if (compare(records, target_node, key) === 1) { // maxより大きい
			if (fill_rate(records, target_node) != 1) { // 空きがある
				result = insert_entry(records, target_node, key, value);
			} else {
				const max: Entry | null = min_entry(records, target_node, _size)
				if (max) {
					if (max.grater) {
						result = insert_or_split(records, max.grater, key, value);
					} else {
						result = split_node_2(records, target_node, key, value);
					}
				}
			}
		} else { // 中間
			result = insert_or_split(records, target_node, key, value);
		}
	}
	return result;
}

/*
* */
export const Insert = (records: Entry[], key: number, value: number): number => {
	let result = -1;
	if (key > 0) {
		result = insert(records, 1, key, value);
	}
	return result;
}

/*
* */
export const Init = (): Entry[] => {
	return create_node();
}

/*
* */
export const Find = (records: Entry[], key: number): Entry => {
	let result: any = null;
	const found = find(records, 0, 1, key);
	const entry = found[2];
	if (entry) {
		result = entry;
	}
	return result;
}
