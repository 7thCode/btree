/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const node_size = 4;

export const node_bytes = (): number => {
	return ((node_size * 3) + 1);
}

export const bytes_to_node = (bytes:number): number => {
	return Math.floor(bytes / node_bytes());
}

export const to_byte = (node:number): number => {
	return (node * 3) + 1;
}

export const to_index = (node: number): number => {
	return (node - 1) * node_bytes();
}

const to_lesser_index_delta = (index: number): number => {
	return (index * 3) - 3;
}

const to_key_index_delta = (index: number): number => {
	return (index * 3) - 2;
}

const to_value_index_delta = (index: number): number => {
	return (index * 3) - 1;
}

const to_graiter_index_delta = (index: number): number => {
	return (index * 3);
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



export const init_node = (): number[] => {
	const result:number[] = [];
	for (let offset = 0; offset < node_bytes(); offset++) {
		result.push(0);
	}
	return result;
}

export const fill_count = (record: number[], node: number):number => {
	let result = 0;
	for (let offset = 1; offset <= node_size; offset++) {
		if (!key(record, node, offset)) {
			break;
		} else {
			result+=1;
		}
	}
	return result;
}

export const node_record = (record: number[], node:number): number[] => {
	const result = [];
	const start = to_index(node);
	const size = node_bytes();
	for (let offset = 0; offset < size; offset++) {
		result.push(record[start + offset]);
	}
	return result;
}

// split by ratio
export const split = (mut_node: number[]): number[][] => {
	const result:number[][] = [];
	result.push(init_node());
	result.push(init_node());
	const count = fill_count(mut_node, 1);
	const full_bytes = to_byte(count);
	const half_bytes = Math.floor(full_bytes /2);
	let source_offset = 0
	let dist_offset = 0;
	for (; source_offset <= half_bytes; source_offset++, dist_offset++) {
		result[0][dist_offset] = mut_node[source_offset];
	}
	dist_offset = 0;
	for (; source_offset <= full_bytes; source_offset++, dist_offset++) {
		result[1][dist_offset] = mut_node[source_offset - 1];
	}
	return result;
}

export const update_record = (record: number[],node:number, data:number[]): void => {
	const start = to_index(node);
	for (let offset = 0; offset < node_bytes(); offset++) {
		record[start + offset] = data[offset];
	}
}

export const append_record = (record: number[], data:number[]): number => {
	for (let offset = 0; offset < node_bytes(); offset++) {
		record.push(data[offset]);
	}
	return bytes_to_node(record.length);
}

export const copy_entry = (mut_node: number[] , index1:number, index2:number): void => {
	for (let offset = 0; offset < 3; offset++) {
		mut_node[((index2 - 1) * 3) + offset] = mut_node[((index1 - 1) * 3) + offset];
	}
}


// serial
export const find_at_node = (record: number[], node: number, find_key: number): [node: number, value: number] => {
	let result_value: number = -1;
	let result_node: number = 0;
	const count = fill_count(record,node);
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
	return [result_node,result_value];
}

export const find = (record: number[], parent_node:number,  root_node: number, find_key: number): [parent_node: number,node: number, value: number] => {
	const result = find_at_node(record, root_node, find_key);
	if (result[0]) {
		return find(record,root_node, result[0], find_key);
	} else {
		return [parent_node,root_node,result[1]];
	}
}

export const insert_to_node = (record: number[], node: number, new_key: number, value:number) : boolean => {
	let result = false;
	const mut_node = node_record(record,node);
	const count = fill_count(mut_node,1);
	for (let offset = 1; offset <= count; offset++) {
		const target_key: number = key(mut_node, 1, offset);
		if (target_key > new_key) {
			copy_entry(mut_node, 2,3);
			mut_node.splice(to_byte(offset - 1), 3, new_key, value, 0);
			update_record(record,node, mut_node);
			result = true;
			break;
		} else if (target_key === new_key) {
			result = false;
			break;
		}
	}
	return result;
}

export const insert = (record:number[],root_node:number, key:number, value:number):[root_node:number, node:number] => {
	let [parent, node, _value] = find(record, 0,  root_node, key);
	const fills = fill_count(record,node);
	if (fills === node_size) {

	} else {
		if (insert_to_node(record,node,key,value)) {

		}
	}
	return [parent, node];
}

