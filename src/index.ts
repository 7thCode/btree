/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const fs = require("fs");

const entry_size = 3;
export const entry_count = 5;

export interface Record {
	data: number[]
}

export interface Node {
	data: number[]
}

type Entry = number[];
type ID = number;
type Key = number;
type Value = number;
type Offset = number;

const get = (record: Record, offset: number): number => {
	return record.data[offset];
}

const set = (record: Record, offset: number, value: number): void => {
	record.data[offset] = value;
}

const append = (record: Record, data: number): void => {
	record.data.push(data);
}

export const node_bytes = (): number => {
	return ((entry_count * entry_size) + 1);
}

export const bytes_to_node = (bytes: number): number => {
	return Math.floor(bytes / node_bytes());
}

export const to_byte = (entry_count: number): number => {
	return (entry_count * entry_size) + 1;
}

export const entry = (record: Record, node: ID, offset: Offset): Entry => {
	return [lesser(record, node, offset), key(record, node, offset), value(record, node, offset), grater(record, node, offset)];
}

export const min_entry = (record: Record, node: ID): Entry => {
	return entry(record, node, 1);
}

export const max_entry = (record: Record, node: ID): Entry => {
	return entry(record, node, fill_count(record, node));
}

export const to_index = (node: ID): number => {
	return (node - 1) * node_bytes();
}

const to_lesser_index_delta = (index: number): number => {
	return (index * entry_size) - 3;
}

const to_key_index_delta = (index: number): number => {
	return (index * entry_size) - 2;
}

const to_value_index_delta = (index: number): number => {
	return (index * entry_size) - 1;
}

const to_graiter_index_delta = (index: number): number => {
	return (index * entry_size);
}

export const lesser = (record: Record, node: ID, offset: Offset): ID => {
	return get(record, to_index(node) + to_lesser_index_delta(offset));
}

export const grater = (record: Record, node: ID, offset: Offset): ID => {
	return get(record, to_index(node) + to_graiter_index_delta(offset));
}

export const key = (record: Record, node: ID, offset: Offset): Key => {
	return get(record, to_index(node) + to_key_index_delta(offset));
}

export const value = (record: Record, node: ID, offset: Offset): Value => {
	return get(record, to_index(node) + to_value_index_delta(offset));
}

export const set_lesser = (record: Record, node: ID, offset: Offset, value: ID): void => {
	set(record, to_index(node) + to_lesser_index_delta(offset), value);
}

export const set_grater = (record: Record, node: ID, offset: Offset, value: ID): void => {
	set(record, to_index(node) + to_graiter_index_delta(offset), value);
}

export const set_key = (record: Record, node: ID, offset: Offset, value: Key): void => {
	set(record, to_index(node) + to_key_index_delta(offset), value);
}

export const set_value = (record: Record, node: ID, offset: Offset, value: Value): void => {
	set(record, to_index(node) + to_value_index_delta(offset), value);
}

// 空Node作成
export const init_node = (): Node => {
	const result: Node = {
		data: []
	};
	for (let offset = 0; offset < node_bytes(); offset++) {
		result.data.push(0);
	}
	return result;
}

//　NodeのEntry数
export const fill_count = (mut_node: Record, node: ID): number => {
	let result: number = 0;
	for (let offset: Offset = 1; offset <= entry_count; offset++) {
		if (!key(mut_node, node, offset) && !value(mut_node, node, offset)) {
			break;
		} else {
			result += 1;
		}
	}
	return result;
}

// recordからNodeをコピー
export const node_record = (record: Record, node: ID): Node => {
	const result: Node = {
		data: []
	};
	const start: number = to_index(node);
	const size: number = node_bytes();
	for (let offset = 0; offset < size; offset++) {
		result.data.push(get(record, start + offset));
	}
	return result;
}

// Nodeを分割（中央値より小さい、中央値、中央値より大きい)
export const split_node = (mut_node: Node): Node[] => {
	const result: Node[] = [];
	result.push(init_node());
	result.push(init_node());
	result.push(init_node());
	const count: number = fill_count(mut_node, 1);
	const full_bytes: number = to_byte(count);
	const separate_bytes: number = to_byte(Math.floor(count / 2)); // 中央値で分割
	let source_offset: Offset = 0
	for (let dist_offset = 0; source_offset < separate_bytes; source_offset++, dist_offset++) {
		result[0].data[dist_offset] = mut_node.data[source_offset];
	}
	source_offset--;
	for (let dist_offset = 0; source_offset < separate_bytes + entry_size; source_offset++, dist_offset++) {
		result[1].data[dist_offset] = mut_node.data[source_offset];
	}
	source_offset--;
	for (let dist_offset = 0; source_offset < full_bytes; source_offset++, dist_offset++) {
		result[2].data[dist_offset] = mut_node.data[source_offset];
	}
	return result;
}

//　Node更新
export const update_record = (record: Record, node: ID, mut_node: Node): void => {
	const start: number = to_index(node);
	for (let offset = 0; offset < node_bytes(); offset++) {
		set(record, start + offset, mut_node.data[offset]);
	}
}

//　Node追加
export const append_record = (record: Record, mut_node: Node): number => {
	for (let offset = 0; offset < node_bytes(); offset++) {
		append(record, mut_node.data[offset]);
	}
	return bytes_to_node(record.data.length);
}

// 一つのノードからEntryを削除
export const erase_entry = (record: Record, node: ID, offset: Offset): void => {
	const mut_node: Node = node_record(record, node);
	mut_node.data.splice(to_byte(offset - 1) - 1, 3); // Keyが内輪で最大の「前」に追加。
	mut_node.data.push(0, 0, 0);
	update_record(record, node, mut_node);
}

// 一つのノードからキーを検索
export const exactly_offset = (record: Record, node: ID, find_key: Key): Offset => {
	let result: Offset = -1;
	const count = fill_count(record, node);
	for (let offset = 1; offset <= count; offset++) {
		const target_key: number = key(record, node, offset);
		if (target_key === find_key) {
			result = offset;
		}
	}
	return result;
}

// Less than
export const less_than = (record: Record, node: ID, entry_index: Key): ID => {

	const closest_min_node = (record: Record, node: ID): ID => {
		const min_node: ID = min_entry(record, node)[0];
		if (min_node) {
			return closest_min_node(record, min_node);
		} else {
			return node;
		}
	}

	const min_node: ID = lesser(record, node, entry_index);
	if (min_node) {
		return closest_min_node(record, min_node);
	} else {
		return node;
	}
}

// grater than
export const grater_than = (record: Record, node: ID, entry_index: Key): ID => {

	const closest_max_node = (record: Record, node: ID): ID => {

		const max_node: ID = max_entry(record, node)[0];
		if (max_node) {
			return closest_max_node(record, max_node);
		} else {
			return node;
		}
	}

	const max_node: ID = grater(record, node, entry_index);
	if (max_node) {
		return closest_max_node(record, max_node);
	} else {
		return node;
	}
}

// binary search
export const find_at_node2 = (record: Record, node: ID, find_key: Key): [node: ID, value: Value] => {

	const search = (mut_node: Node, find_key: Key, range: number = 0): number => {

		const compare = (data: Node, search: number, start: number, end: number, near: number): number => {
			let result: number = -1;
			const _range: number = end - start;
			const pivot: number = (Math.floor(_range / 2)) + start;
			const _key = key(data, 1, pivot);
			if (_range > 1) {
				if (_key === search) {
					result = pivot;
				} else if (_key > search) {
					result = compare(data, search, start, pivot, near);
				} else {
					result = compare(data, search, pivot, end, near);
				}
			} else if (_range <= 1) {
				if (_key === search) {
					result = pivot;
				} else if (near === 0) {
					result = -1;
				} else if ((_key > search) && near < 0) {
					result = pivot - 1;
				} else if ((_key < search) && near > 0) {
					result = pivot + 1;
				} else {
					result = pivot;
				}
			}
			return result;
		}

		return compare(mut_node, find_key, 1, fill_count(mut_node, 1) + 1, range);

	}

	let result_value: number = -1;
	let result_node: number = 0;

	const _node: Node = node_record(record, node);

	const offset = search(_node, find_key, -1);
	if (key(_node, 1, offset) > find_key) {
		result_node = lesser(record, node, offset);
		result_value = -1;
	} else if (key(_node, 1, offset) === find_key) {
		result_node = node;
		result_value = value(record, node, offset);
	} else {
		result_node = grater(record, node, offset);
		result_value = -1;
	}
	return [result_node, result_value];
}

// serial
export const find_at_node = (record: Record, node: ID, find_key: Key): [node: ID, value: Value] => {
	let result_value: number = -1;
	let result_node: number = 0;
	const count = fill_count(record, node);
	for (let offset = 1; offset <= count; offset++) {
		const target_key: number = key(record, node, offset);
		if (target_key > find_key) {
			result_node = lesser(record, node, offset);
			result_value = -1;
			break;
		} else if (target_key === find_key) {
			result_node = node;
			result_value = value(record, node, offset);
			break;
		} else {
			result_node = grater(record, node, offset);
			result_value = -1;
		}
	}
	return [result_node, result_value];
}


// lesser: number, new_key: number, value: number, grater: number
// 一つのノードに正しい順序でEntryを追加。Entry個数は追加
export const insert_to_node = (mut_node: Node, entry: Entry): Node => {
	let result: Node = {
		data: []
	};
	const count = fill_count(mut_node, 1);
	for (let offset = 0; offset <= count; offset++) {
		const target_key: number = key(mut_node, 1, offset);
		if (target_key > entry[1]) {
			mut_node.data.splice(to_byte(offset - 1) - 1, 1, entry[0], entry[1], entry[2], entry[3]); // Keyが内輪で最大の「前」に追加。
			result = mut_node;
			break;
		} else if (target_key === entry[1]) {
			result = mut_node;
			break;
		} else if (offset === count) {
			mut_node.data.splice(to_byte(offset) - 1, 4, entry[0], entry[1], entry[2], entry[3]); // Keyが内輪で最大の「前」に追加。
			result = mut_node;
			break;
		}
	}
	return result;
}

// 一つのノードを更新
export const update_to_node = (mut_node: Node, _key: Key, update_value: Value): void => {
	const count = fill_count(mut_node, 1);
	for (let offset = 0; offset <= count; offset++) {
		const target_key: number = key(mut_node, 1, offset);
		if (target_key === _key) {
			set_value(mut_node, 1, offset, update_value);
			break;
		}
	}
}

//　検索
export const find = (record: Record, parent_node: number[], root_node: ID, find_key: Key): [parent_node: number[], node: ID, value: Value] => {
	const result = find_at_node2(record, root_node, find_key);
	if ((result[1] < 0) && (result[0] != 0)) {
		parent_node.push(root_node);
		return find(record, parent_node, result[0], find_key);
	} else {
		return [parent_node, root_node, result[1]];
	}
}

// 挿入
export const insert = (record: Record, root_node: ID, insert_key: Key, insert_value: Value): boolean => {

	const _insert = (target: ID, parent: ID, new_entry: Entry): boolean => {

		const _split = (inserted_node: Node) => {
			const split_nodes: Node[] = split_node(inserted_node);
			const lesser: number = append_record(record, split_nodes[0]);
			const grater: number = append_record(record, split_nodes[2]);
			set_lesser(split_nodes[1], 1, 1, lesser);
			set_grater(split_nodes[1], 1, 1, grater);
			update_record(record, target, split_nodes[1]);
		}

		const target_node: Node = node_record(record, target);
		const inserted_node: Node = insert_to_node(target_node, new_entry);
		if ((fill_count(inserted_node, 1) + 1) <= (entry_count)) { // not overflow
			update_record(record, target, inserted_node);
		} else {
			if (parent) {
				const parent_node = node_record(record, parent);
				if (fill_count(parent_node, 1) === (entry_count)) {
					_split(inserted_node); // parent full
				} else {
					// 親nodeに空きがあれば、親nodeにinsert。
					// targetnodeを再利用。
					const split_nodes: Node[] = split_node(inserted_node);
					const lesser: number = target;
					update_record(record, lesser, split_nodes[0]);
					const grater: number = append_record(record, split_nodes[2]);
					const _key = key(split_nodes[1], 1, 1);
					const _value = value(split_nodes[1], 1, 1);
					insert_to_node(parent_node, [lesser, _key, _value, grater]);
					update_record(record, parent, parent_node);
				}
			} else {
				_split(inserted_node);  // root
			}
		}
		return true;
	}

	const _update = (target: ID): boolean => {
		const target_node: Node = node_record(record, target);
		update_to_node(target_node, insert_key, insert_value);
		update_record(record, target, target_node);
		return true;
	}

	let result: boolean = false;
	let [parents, found_node_index, _value] = find(record, [], root_node, insert_key);
	if (_value < 0) { // not_found then
		let new_entry = [0, insert_key, insert_value, 0];
		const parent_node_index: any = parents.pop();
		result = _insert(found_node_index, parent_node_index, new_entry)
	} else {
		result = _update(found_node_index);
	}
	return result;
}

// 更新
export const update = (record: Record, root_node: ID, insert_key: Key, insert_value: Value): boolean => {

	const _update = (target: number): boolean => {
		const target_node = node_record(record, target);
		update_to_node(target_node, insert_key, insert_value);
		update_record(record, target, target_node);
		return true;
	}

	let result: boolean = false;
	let [parents, found_node_index, _value] = find(record, [], root_node, insert_key);
	if (_value >= 0) { // not_found then
		result = _update(found_node_index);
	}

	return result;
}

//　削除
export const erase = (record: Record, root_node: ID, key: Key): boolean => {

	if (key === 2142) {
		const a = 1
	}

	let result: boolean = false;
	let [parents, found_node_index, _value] = find(record, [], root_node, key);
	if (_value > 0) {
		const offset: Offset = exactly_offset(record, found_node_index, key);
		const lesser_node_index: ID = lesser(record, found_node_index, offset);
		const grater_node_index: ID = grater(record, found_node_index, offset);
		const less_than_node: ID = less_than(record, found_node_index, offset);
		const grater_than_node: ID = grater_than(record, found_node_index, offset);

		if (lesser_node_index) {
			const erase: Entry = max_entry(record, less_than_node);
			erase_entry(record, less_than_node, fill_count(record, less_than_node));
			if (fill_count(record, less_than_node) === 0) {
				set_lesser(record, found_node_index, offset, 0);
			}
			set_key(record, found_node_index, offset, erase[1]);
			set_value(record, found_node_index, offset, erase[2]);
		} else if (grater_node_index) {
			const erase: Entry = min_entry(record, grater_than_node);
			erase_entry(record, grater_than_node, 1);
			if (fill_count(record, grater_than_node) === 0) {
				set_grater(record, found_node_index, offset, 0);
			}
			set_key(record, found_node_index, offset, erase[1]);
			set_value(record, found_node_index, offset, erase[2]);
		} else {
			erase_entry(record, found_node_index, offset);
		}
		/*
				if (fill_count(record, found_node_index) === 0) {
					if (parents.length > 0) {
						const parent = parents[parents.length - 1];
						for (let offset = 1; offset < fill_count(record, parent) + 1; offset++) {
							if (lesser(record, parent, offset) === closest_min_node) {
								set_lesser(record, parent, offset, 0);
							}
							if (grater(record, parent, offset) === closest_max_node) {
								set_grater(record, parent, offset, 0);
							}
						}
					}
				}
		*/
		result = true;
	} else {
		console.log(key, JSON.stringify(record));
	}
	return result;
}

export const Find = (record: Record, find_key: Key): [parent_node: number[], node: ID, value: Value] => {
	return find(record, [], 1, find_key);
}

export const Insert = (record: Record, insert_key: Key, insert_value: Value): boolean => {
	return insert(record, 1, insert_key, insert_value);
}

export const Update = (record: Record, find_key: Key, update_value: Value): boolean => {
	return update(record, 1, find_key, update_value);
}

export const Erase = (record: Record, key: Key): boolean => {
	return erase(record, 1, key);
}

// バイナリーサーチ
export const BinarySearch = (data: number[], key: number, near: number = 0): number => {

	const compare = (data: number[], search: number, start: number, end: number, near: number): number => {
		var result: number = -1;
		var key: number;
		var _range: number = end - start;
		var pivot: number = (Math.floor(_range / 2)) + start;
		key = data[pivot];
		if (_range > 1) {
			if (key == search) {
				result = pivot;
			} else if (key > search) {
				result = compare(data, search, start, pivot, near);
			} else {
				result = compare(data, search, pivot, end, near);
			}
		} else if (_range <= 1) {
			if (key == search) {
				result = pivot;
			} else if (near == 0) {
				result = -1;
			} else if ((key > search) && near < 0) {
				result = pivot - 1;
			} else if ((key < search) && near > 0) {
				result = pivot + 1;
			} else {
				result = pivot;
			}
		}
		return result;
	}

	return compare(data, key, 0, data.length, near);
}


// adler32 Hash
export const adler32 = (S: string): number => {
	let A = 1, B = 0, p = 0;
	for (let offset = 0; offset < S.length; offset++) {
		A += S.charCodeAt(offset);
		p = A;
		B += p;
	}
	return (B * 65536) + A;
}

export const read = () => {
	const buff1 = new Buffer([0x31, 0x32, 0x33, 0x34]);
	const buff2 = Buffer.alloc(4);
	const fd = fs.openSync(__dirname + "/data.dat", "a+");
	const position = adler32("Wikipedia");
	fs.writeSync(fd, buff1, 0, 4, position);
	fs.readSync(fd, buff2, 0, 4, 1);
//	fs.appendFileSync(fd, "hoge");
	const a = buff2[0];
	fs.closeSync(fd);
}
