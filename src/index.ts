/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const entry_size = 3;
const entry_count = 101;

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
		if (!key(record, node, offset) && !value(record, node, offset)) {
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
	const separate_bytes = to_byte(Math.floor(count / 2)); // 中央値で分割
	let source_offset = 0
	for (let dist_offset = 0; source_offset < separate_bytes; source_offset++, dist_offset++) {
		result[0][dist_offset] = mut_node[source_offset];
	}
	source_offset--;
	for (let dist_offset = 0; source_offset < separate_bytes + entry_size; source_offset++, dist_offset++) {
		result[1][dist_offset] = mut_node[source_offset];
	}
	source_offset--;
	for (let dist_offset = 0; source_offset < full_bytes; source_offset++, dist_offset++) {
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

// lesser: number, new_key: number, value: number, grater: number
export const insert_to_node = (mut_node: number[], entry: number[]): number[] => {
	let result: number[] = [];
	const count = fill_count(mut_node, 1);
	for (let offset = 0; offset <= count; offset++) {
		const target_key: number = key(mut_node, 1, offset);
		if (target_key > entry[1]) {
			mut_node.splice(to_byte(offset - 1) - 1, 1, entry[0], entry[1], entry[2], entry[3]); // Keyが内輪で最大の「前」に追加。
			result = mut_node;
			break;
		} else if (target_key === entry[1]) {
			result = [];
			break;
		} else if (offset === count) {
			mut_node.splice(to_byte(offset) - 1, 4, entry[0], entry[1], entry[2], entry[3]); // Keyが内輪で最大の「前」に追加。
			result = mut_node;
			break;
		}
	}
	return result;
}

export const update_to_node = (mut_node: number[], _key: number, update_value: number): void => {
	const count = fill_count(mut_node, 1);
	for (let offset = 0; offset <= count; offset++) {
		const target_key: number = key(mut_node, 1, offset);
		if (target_key === _key) {
			set_value(mut_node, 1, offset, update_value);
			break;
		}
	}
}

//
export const find = (record: number[], parent_node: number[], root_node: number, find_key: number): [parent_node: number[], node: number, value: number] => {
	const result = find_at_node(record, root_node, find_key);
	if ((result[1] < 0) && (result[0] != 0)) {
		parent_node.push(root_node);
		return find(record, parent_node, result[0], find_key);
	} else {
		return [parent_node, root_node, result[1]];
	}
}

export const insert = (record: number[], root_node: number, insert_key: number, insert_value: number): boolean => {

	const _insert = (target: number, parent: number, new_entry: number[]): boolean => {

		const _split = (inserted_node: number[]) => {
			const split_nodes: number[][] = split_node(inserted_node);
			const lesser: number = append_record(record, split_nodes[0]);
			const grater: number = append_record(record, split_nodes[2]);
			set_lesser(split_nodes[1], 1, 1, lesser);
			set_grater(split_nodes[1], 1, 1, grater);
			update_record(record, target, split_nodes[1]);
		}

		const target_node = node_record(record, target);
		const inserted_node = insert_to_node(target_node, new_entry);
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
					const split_nodes: number[][] = split_node(inserted_node);
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

	const _update = (target: number) => {
		const target_node = node_record(record, target);
		update_to_node(target_node, insert_key, insert_value);
		update_record(record, target, target_node);
	}

	let result = false;
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

export const update = (record: number[], root_node: number, insert_key: number, insert_value: number): boolean => {

	const _update = (target: number) => {
		const target_node = node_record(record, target);
		update_to_node(target_node, insert_key, insert_value);
		update_record(record, target, target_node);
	}

	let result = false;
	let [parents, found_node_index, _value] = find(record, [], root_node, insert_key);
	if (_value >= 0) { // not_found then
		_update(found_node_index);
	}
	return result;
}





export const binary_search = (data:number[], key:number):number => {

	const compare = (data: number[], search: number, pivot: number, delta:number): number => {
		let result:number = -1;
		if (delta > 1) {
			delta = Math.ceil(delta / 2);
			if (data[pivot] === search) {
				result = pivot;
			} else if (data[pivot] > search) {
				result = compare(data, search, pivot - delta, delta);
			} else {
				result = compare(data, search, pivot + delta, delta);
			}
		}
		return result;
	}

	return compare(data, key, Math.ceil((data.length - 1) / 2), ((data.length - 1) / 2));
}

