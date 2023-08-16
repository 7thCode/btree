/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const entry_size = 3;
const entry_count = 5;

export const node_bytes = (): number => {
	return ((entry_count * entry_size) + 1);
}

export const bytes_to_node = (bytes: number): number => {
	return Math.floor(bytes / node_bytes());
}

export const to_byte = (entry_count: number): number => {
	return (entry_count * entry_size) + 1;
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
	for (let offset = 1; offset <= entry_count; offset++) {
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
	const full_bytes = to_byte(count + 1);
	const separate_bytes = to_byte(Math.floor(count / 2));
	let source_offset = 0
	let dist_offset = 0;
	for (; source_offset < separate_bytes; source_offset++, dist_offset++) {
		result[0][dist_offset] = mut_node[source_offset];
	}
	source_offset--;
	dist_offset = 0;
	for (; source_offset < separate_bytes + entry_size; source_offset++, dist_offset++) {
		result[1][dist_offset] = mut_node[source_offset];
	}
	source_offset--;
	dist_offset = 0;
	for (; source_offset < full_bytes; source_offset++, dist_offset++) {
		result[2][dist_offset] = mut_node[source_offset];
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
export const move_entry = (mut_node: number[], count: number): number[] => {
	let result: number[] = [];
	const offset_count = entry_count - count;
	const start = node_bytes();
	const end = start - (entry_size * offset_count);
	for (let offset = start; offset > end; offset--) {
		result.push(mut_node[offset - entry_size - 1]);
	}
	return result;
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

//
export const find = (record: number[], parent_node: number[], root_node: number, find_key: number): [parent_node: number[], node: number, value: number] => {
	const result = find_at_node(record, root_node, find_key);
	parent_node.push(root_node);
	if (result[1] < 0) {
		return find(record, parent_node, result[0], find_key);
	} else {
		return [parent_node, root_node, result[1]];
	}
}

// lesser: number, new_key: number, value: number, grater: number
export const insert_to_node = (mut_node: number[], entry: number[]): number[] => {
	let result: number[] = [];
	const count = fill_count(mut_node, 1);
	for (let offset = 1; offset <= count; offset++) {
		const target_key: number = key(mut_node, 1, offset);
		if (target_key > entry[1]) {
			mut_node.splice(to_byte(offset - 1) - 1, 1, entry[0], entry[1], entry[2], entry[3]); // Keyが内輪で最大の「前」に追加。
			result = mut_node;
			break;
		} else if (target_key === entry[1]) {
			result = [];
			break;
		} else if (offset === 5) {
			mut_node.pop();
			mut_node.push(entry[0], entry[1], entry[2], entry[3]);
			result = mut_node;
			break;
		}
	}
	return result;
}

export const insert = (record: number[], root_node: number, insert_key: number, insert_value: number): [root_node: number[], node: number] => {

	const _insert = (parents:number[],new_entry: number[]): boolean => {
		let oya: any = parents.pop();
		let overflow = null;
		if (oya) {
			const oya_node = node_record(record, oya);
			overflow = insert_to_node(oya_node, new_entry);
			if (fill_count(overflow, 1) < entry_count) {
				update_record(record, oya, overflow);
			} else {
				const mut_new_nodes: number[][] = split_node(overflow);
				const lesser: number = oya;
				update_record(record, lesser, mut_new_nodes[0]); // lesser 再利用 const lesser: number = append_record(record, mut_new_nodes[0]);
				const grater: number = append_record(record, mut_new_nodes[2]);
				const _key = key(mut_new_nodes[1], 1, 1);
				const _value = value(mut_new_nodes[1], 1, 1);
				if (oya === root_node) {
					const new_root: number = append_record(record, mut_new_nodes[1]);
				} else {
					_insert(parents, [lesser, _key, _value, grater]);
				}

			}
		} else {
			console.log(overflow);
		}
		return true;
	}

	let [parents, found_node_index, _value] = find(record, [], root_node, insert_key);
	if (_value < 0) { // not_found then
		let new_entry = [0, insert_key, insert_value, 0];
		_insert(parents, new_entry)
	}
	return [parents, 1];
}

/*
export const insert = (record: number[], root_node: number, insert_key: number, insert_value: number): [root_node: number[], node: number, success: boolean] => {
	let [parents, found_node_index, _value] = find(record, [], root_node, insert_key);
	let success = false;
	if (_value < 0) { // not_found.
		const found_node = node_record(record, found_node_index);
		let overflow = insert_to_node(found_node, [0, insert_key, insert_value, 0]);
		for (; parents.length > 0;) {
			const oya: number | undefined = parents.pop();
			if (overflow.length <= to_byte(entry_count)) {
				update_record(record, found_node_index, overflow);
			} else {
				if (oya) {
					const mut_new_nodes: number[][] = split_node(overflow);
					const lesser: number = found_node_index;
					update_record(record, lesser, mut_new_nodes[0]); // lesser 再利用 const lesser: number = append_record(record, mut_new_nodes[0]);

					const grater: number = append_record(record, mut_new_nodes[2]);
					const _key = key(mut_new_nodes[1], 1, 1);
					const _value = value(mut_new_nodes[1], 1, 1);

					const oya_node = node_record(record, oya);
					let insert_node = insert_to_node(oya_node, [lesser, _key, _value, grater]);
					update_record(record, oya, insert_node);
				}
			}
		}
	}
	success = true;
	return [parents, 1, success];
}
*/
