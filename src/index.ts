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

// うちわで最も近いEntryを含むNode
export const closest_min = (record: Record, node: ID, entry_index: Key): ID => {

	const closest_min_node = (record: Record, node: ID): ID => {
		const min_node: ID = min_entry(record, node)[0];
		if (min_node) {
			return closest_min_node(record, min_node);
		} else {
			return node;
		}
	}

	const _entry: Entry = entry(record, node, entry_index);
	const min_node: ID = _entry[0];
	if (min_node) {
		return closest_min_node(record, min_node);
	} else {
		return node;
	}
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
	const result = find_at_node(record, root_node, find_key);
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

	const _update = (target: ID) => {
		const target_node: Node = node_record(record, target);
		update_to_node(target_node, insert_key, insert_value);
		update_record(record, target, target_node);
	}

	let result: boolean = false;
	let [parents, found_node_index, _value] = find(record, [], root_node, insert_key);
	if (_value < 0) { // not_found then
		let new_entry = [0, insert_key, insert_value, 0];
		const parent_node_index: any = parents.pop();
		result = _insert(found_node_index, parent_node_index, new_entry)
	} else {
		_update(found_node_index)
	}
	return result;
}

// 更新
export const update = (record: Record, root_node: ID, insert_key: Key, insert_value: Value): boolean => {

	const _update = (target: number) => {
		const target_node = node_record(record, target);
		update_to_node(target_node, insert_key, insert_value);
		update_record(record, target, target_node);
	}

	let result: boolean = false;
	let [parents, found_node_index, _value] = find(record, [], root_node, insert_key);
	if (_value >= 0) { // not_found then
		_update(found_node_index);
	}
	return result;
}

//　削除
export const erase = (record: Record, root_node: ID, key: Key): boolean => {
	let result: boolean = false;
	let [parents, found_node_index, _value] = find(record, [], root_node, key);
	if (_value > 0) {
		const offset: Offset = exactly_offset(record, found_node_index, key);
		const _entry: Entry = entry(record, found_node_index, offset);
		const lesser_node_index = _entry[0];
		if (lesser_node_index) {
			const closest_min_node: ID = closest_min(record, found_node_index, offset);
			const erase: Entry = max_entry(record, closest_min_node);
			erase_entry(record, closest_min_node, fill_count(record, closest_min_node));
			set_key(record, found_node_index, offset, erase[1]);
			set_value(record, found_node_index, offset, erase[2]);
		} else {
			erase_entry(record, found_node_index, offset);
		}
		result = true;
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
export const binary_search = (data: number[], key: number): number => {

	const compare = (data: number[], search: number, pivot: number, delta: number): number => {
		let result: number = -1;
		if (delta > 1) {
			delta = Math.ceil(delta / 2);
			if (data[pivot] === search) {
				result = pivot;
			} else if (data[pivot] > search) {
				result = compare(data, search, pivot - delta, delta);
			} else {
				result = compare(data, search, pivot + delta, delta);
			}
		} else if (delta === 1) {
			if (data[pivot] === search) {
				result = pivot;
			} else {
				result = -1;
			}
		}
		return result;
	}

	return compare(data, key, Math.ceil((data.length - 1) / 2), ((data.length - 1) / 2));
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
