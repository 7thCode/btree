/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

const node_size = 4;

export const to_index = (node: number): number => {
	return (node - 1) * ((node_size * 3) + 1);
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

export const find_at_node = (record: number[], node: number, find_key: number): [node: number, value: number] => {
	let result_value: number = 0
	let result_node: number = 0;
	for (let offset = 1; offset <= node_size; offset++) {
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
