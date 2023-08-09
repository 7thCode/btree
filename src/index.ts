/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const entry_size = 3;
const node_size = 5;

export const node_bytes = (): number => {
	return ((node_size * entry_size) + 1);
}

export const bytes_to_node = (bytes: number): number => {
	return Math.floor(bytes / node_bytes());
}

export const to_byte = (node: number): number => {
	return (node * entry_size) + 1;
}

export const to_index = (node: number): number => {
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

export const lesser = (record: number[], node: number, offset: number): number => {
	return record[to_index(node) + to_lesser_index_delta(offset)];
}

export const grater = (record: number[], node: number, offset: number): number => {
	return record[to_index(node) + to_graiter_index_delta(offset)];
}

export const key = (record: number[], node: number, offset: number): number => {
	return record[to_index(node) + to_key_index_delta(offset)];
}

export const value = (record: number[], node: number, offset: number): number => {
	return record[to_index(node) + to_value_index_delta(offset)];
}

export const set_lesser = (record: number[], node: number, offset: number, value: number): void => {
	record[to_index(node) + to_lesser_index_delta(offset)] = value;
}

export const set_grater = (record: number[], node: number, offset: number, value: number): void => {
	record[to_index(node) + to_graiter_index_delta(offset)] = value;
}

export const set_key = (record: number[], node: number, offset: number, value: number): void => {
	record[to_index(node) + to_key_index_delta(offset)] = value;
}

export const set_value = (record: number[], node: number, offset: number, value: number): void => {
	record[to_index(node) + to_value_index_delta(offset)] = value;
}

//
export const init_node = (): number[] => {
	const result: number[] = [];
	for (let offset = 0; offset < node_bytes(); offset++) {
		result.push(0);
	}
	return result;
}

//
export const fill_count = (record: number[], node: number): number => {
	let result = 0;
	for (let offset = 1; offset <= node_size; offset++) {
		if (!key(record, node, offset)) {
			break;
		} else {
			result += 1;
		}
	}
	return result;
}

//
export const node_record = (record: number[], node: number): number[] => {
	const result = [];
	const start = to_index(node);
	const size = node_bytes();
	for (let offset = 0; offset < size; offset++) {
		result.push(record[start + offset]);
	}
	return result;
}

// split by ratio
export const split_node = (mut_node: number[]): number[][] => {
	const result: number[][] = [];
	result.push(init_node());
	result.push(init_node());
	result.push(init_node());
	const count = fill_count(mut_node, 1);
	const full_bytes = to_byte(count);
	const half_bytes = to_byte(Math.floor(count / 2));
	let source_offset = 0
	let dist_offset = 0;
	for (; source_offset < half_bytes; source_offset++, dist_offset++) {
		result[0][dist_offset] = mut_node[source_offset];
	}
	dist_offset = 0;
	for (; source_offset <= half_bytes + 3; source_offset++, dist_offset++) {
		result[1][dist_offset] = mut_node[source_offset -1];
	}
	dist_offset = 0;
	for (; source_offset <= full_bytes + 1; source_offset++, dist_offset++) {
		result[2][dist_offset] = mut_node[source_offset - 2];
	}
	return result;
}

//
export const update_record = (record: number[], node: number, data: number[]): void => {
	const start = to_index(node);
	for (let offset = 0; offset < node_bytes(); offset++) {
		record[start + offset] = data[offset];
	}
}

//
export const append_record = (record: number[], data: number[]): number => {
	for (let offset = 0; offset < node_bytes(); offset++) {
		record.push(data[offset]);
	}
	return bytes_to_node(record.length);
}

//
export const move_entry = (mut_node: number[], count: number): void => {
	const _count = node_size - count;
	const start = node_bytes();
	const end = start - (entry_size * _count) - 1;
	for (let offset = start; offset > end; offset--) {
		mut_node[offset - 1] = mut_node[offset - entry_size - 1];
	}
}

// serial
export const find_at_node = (record: number[], node: number, find_key: number): [node: number, value: number] => {
	let result_value: number = -1;
	let result_node: number = 0;
	const count = fill_count(record, node);
	for (let offset = 1; offset <= count; offset++) {
		const target_key: number = key(record, node, offset);
		if (target_key > find_key) {
			result_node = lesser(record, node, offset);
			break;
		} else if (target_key === find_key) {
			result_node = 0;
			result_value = value(record, node, offset);
			break;
		}
		result_node = grater(record, node, offset);
	}
	return [result_node, result_value];
}

//
export const find = (record: number[], parent_node: number, root_node: number, find_key: number): [parent_node: number, node: number, value: number] => {
	const result = find_at_node(record, root_node, find_key);
	if (result[0]) {
		return find(record, root_node, result[0], find_key);
	} else {
		return [parent_node, root_node, result[1]];
	}
}

// フルの場合は使えない。
export const insert_to_node = (mut_node: number[], lesser: number, new_key: number, value: number, grater: number): number[] => {
	let result: any = null;
	const count = fill_count(mut_node, 1);
	for (let offset = 1; offset <= count; offset++) {
		const target_key: number = key(mut_node, 1, offset);
		if (target_key > new_key) {
			move_entry(mut_node, offset); //　退避
			mut_node.splice(to_byte(offset - 1) - 1, 4, lesser, new_key, value, grater); // Keyが内輪で最大の「前」に追加。
			result = mut_node;
			break;
		} else if (target_key === new_key) {
			result = null;
			break;
		}
	}
	return result;
}

const split = (record: number[], target_node: number, update_node: number): void => {
	const mut_node: number[] = node_record(record, target_node);
	const mut_new_nodes: number[][] = split_node(mut_node);
	const lesser:number = target_node;
	update_record(record, lesser, mut_new_nodes[0]);	// lesser 再利用 const lesser: number = append_record(record, mut_new_nodes[0]);
	const grater: number = append_record(record, mut_new_nodes[2]);
	const _key = key(mut_new_nodes[1], 1, 1);
	const _value = value(mut_new_nodes[1], 1, 1);
	const _update_node = node_record(record, update_node);
	const _insert_node = insert_to_node(_update_node, lesser, _key, _value, grater);
	update_record(record, update_node, _insert_node);
}

//
export const insert = (record: number[], root_node: number, insert_key: number, insert_value: number): [root_node: number, node: number, success: boolean] => {
	let [parent, node, _value] = find(record, 0, root_node, insert_key);
	let root = parent;
	let success = false;
	if (_value < 0) { // not_found.

		if (fill_count(record, parent) === node_size) {
	//		split(record, parent, parent);
		}

		if (fill_count(record, node) === node_size) {
			split(record, node, parent);
			[root, node, success] = insert(record, root_node, insert_key, insert_value);
		} else {
			update_record(record, node, insert_to_node(node_record(record, node), 0, insert_key, insert_value, 0));
		}
	}
	return [root, node, success];
}

