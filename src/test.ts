/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {append_record, fill_count, find, find_at_node, grater, insert, insert_to_node, key, lesser, node_record, set_grater, set_key, set_lesser, set_value, split_node, update_record, value} from "./index";


describe('balanced tree', () => {

	it("accessor", () => {
		const records = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 0, 0, 0,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		];

		expect(lesser(records, 3, 1)).toBe(1);
		expect(key(records, 3, 1)).toBe(25);
		expect(value(records, 3, 1)).toBe(500);
		expect(grater(records, 3, 1)).toBe(2);

		set_lesser(records, 3, 2, 100)
		set_key(records, 3, 2, 200)
		set_value(records, 3, 2, 300)
		set_grater(records, 3, 2, 400)

		expect(lesser(records, 3, 2)).toBe(100);
		expect(key(records, 3, 2)).toBe(200);
		expect(value(records, 3, 2)).toBe(300);
		expect(grater(records, 3, 2)).toBe(400);

	});

	it("fill_count", () => {

		const node1 = [1, 10, 100, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		expect(fill_count(node1, 1)).toBe(1);

		const node2 = [1, 10, 100, 2, 20, 200, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		expect(fill_count(node2, 1)).toBe(2);

		const node3 = [1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		expect(fill_count(node3, 1)).toBe(3);

		const node4 = [1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 40, 400, 5, 0, 0, 0, 0, 0, 0];
		expect(fill_count(node4, 1)).toBe(4);

		const node5 = [1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 40, 400, 5, 50, 500, 6, 0, 0, 0];
		expect(fill_count(node5, 1)).toBe(5);

		const node6 = [1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 40, 400, 5, 50, 500, 6, 60, 600, 7];
		expect(fill_count(node6, 1)).toBe(5);

	})

	it("split_node", () => {

		const node = [1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 40, 400, 5, 50, 500, 6,]
		expect(split_node(node)[0]).toStrictEqual([1, 10, 100, 2, 20, 200, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		expect(split_node(node)[1]).toStrictEqual([3, 30, 300, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		expect(split_node(node)[2]).toStrictEqual([4, 40, 400, 5, 50, 500, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

	})

	it("find_at_node", () => {

		const node = [2, 10, 100, 3, 20, 200, 4, 30, 300, 5, 40, 400, 6, 50, 500, 7];

		expect(find_at_node(node, 1, 5)).toStrictEqual([2, -1]);
		expect(find_at_node(node, 1, 10)).toStrictEqual([1, 100]);
		expect(find_at_node(node, 1, 15)).toStrictEqual([3, -1]);
		expect(find_at_node(node, 1, 20)).toStrictEqual([1, 200]);
		expect(find_at_node(node, 1, 25)).toStrictEqual([4, -1]);
		expect(find_at_node(node, 1, 30)).toStrictEqual([1, 300]);
		expect(find_at_node(node, 1, 35)).toStrictEqual([5, -1]);
		expect(find_at_node(node, 1, 40)).toStrictEqual([1, 400]);
		expect(find_at_node(node, 1, 45)).toStrictEqual([6, -1]);
		expect(find_at_node(node, 1, 50)).toStrictEqual([1, 500]);
		expect(find_at_node(node, 1, 55)).toStrictEqual([7, -1]);

	})

	it('insert_to_node', () => {

		const source = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		insert_to_node(source, [1, 10, 100, 2]);
		expect(source).toStrictEqual([1, 10, 100, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		insert_to_node(source, [2, 20, 200, 3]);
		expect(source).toStrictEqual([1, 10, 100, 2, 20, 200, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		insert_to_node(source, [3, 30, 300, 4]);
		expect(source).toStrictEqual([1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 0, 0, 0, 0, 0, 0]);
		insert_to_node(source, [4, 40, 400, 5]);
		expect(source).toStrictEqual([1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 40, 400, 5, 0, 0, 0]);
		insert_to_node(source, [5, 50, 500, 6]);
		expect(source).toStrictEqual([1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 40, 400, 5, 50, 500, 6]);
		insert_to_node(source, [6, 60, 600, 7]);
		expect(source).toStrictEqual([1, 10, 100, 2, 20, 200, 3, 30, 300, 4, 40, 400, 5, 50, 500, 6, 60, 600, 7])
		const source1 = insert_to_node([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7], [0, 800, 2500, 1]);
		expect(source1).toStrictEqual([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 0, 800, 2500, 1]);
		expect(insert_to_node([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7], [0, 800, 2500, 1])).toStrictEqual([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 0, 800, 2500, 1]);
		const reading = insert_to_node([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7], [0, 50, 2500, 1]);
		expect(reading).toStrictEqual([0, 50, 2500, 1, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7]);
		const trailing = insert_to_node([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7], [0, 800, 2500, 1]);
		expect(trailing).toStrictEqual([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 0, 800, 2500, 1]);
		const middle = insert_to_node([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7], [0, 250, 2500, 1]);
		expect(middle).toStrictEqual([2, 100, 1000, 3, 200, 1000, 0, 250, 2500, 1, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7]);
		const middle2 = insert_to_node([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7], [0, 350, 2500, 1]);
		expect(middle2).toStrictEqual([2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 0, 350, 2500, 1, 400, 1000, 6, 500, 1000, 7]);
	});

	it("split", () => {
		const records = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 650, 5, 85, 850, 6, 105, 1050, 7,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		expect(split_node(node_record(records, 3))[0]).toStrictEqual([1, 25, 500, 2, 45, 600, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		expect(split_node(node_record(records, 3))[1]).toStrictEqual([4, 65, 650, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		expect(split_node(node_record(records, 3))[2]).toStrictEqual([5, 85, 850, 6, 105, 1050, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
	});

	it("append", () => {
		const records = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 0, 0, 0,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		];

		expect(append_record(records, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16])).toBe(7);

		const records2 = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 0, 0, 0,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16
		];

		expect(records).toStrictEqual(records2);

		const records3 = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 0, 0, 0,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		];

		update_record(records2, 7, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		expect(records2).toStrictEqual(records3);

	});

	it("find", () => {
		const records = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 0, 0, 0,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]

		expect(find(records, [], 3, 40)).toStrictEqual([[3], 2, 400]);
		expect(find(records, [], 3, 41)).toStrictEqual([[3], 2, -1]);

		expect(split_node(node_record(records, 3))[0]).toStrictEqual([1, 25, 500, 2, 45, 600, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

		expect(split_node(node_record(records, 3))[1]).toStrictEqual([4, 65, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

		expect(split_node(node_record(records, 3))[2]).toStrictEqual([5, 85, 0, 6, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

		expect(append_record(records, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16])).toBe(7);

		const records2 = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 0, 0, 0,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16
		];

		expect(records).toStrictEqual(records2);

		const records3 = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 0, 0, 0,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		];

		update_record(records2, 7, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		expect(records2).toStrictEqual(records3);

	});

	it('insert and find (seq)', () => {

		const records: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
		const count = 100;

		for (let data = 1; data < count; data++) {
			insert(records, 1, data, data * 10);
		}

		let each_depth: any[] = [];
		let depth_sum: number = 0;
		for (let data = 1; data < count; data++) {
			const x = find(records, [], 1, data);
			each_depth.push(x[0].length);
			depth_sum += x[0].length;
			expect(x[2]).toBe(data * 10);
		}

		const ave_depth = depth_sum / count;

		let sum = 0;
		for (let index = 1; index < count; index++) {
			if (index === 99) {
				const a = 1;
			}
			sum += (each_depth[index- 1] - ave_depth) ** 2;
		}

		const dispersion = sum / count;

		const space_efficiency = records.length / count;

		console.log("ave_depth : " + ave_depth + " dispersion : " + dispersion + " space_efficiency : " + space_efficiency);

	});

	it('insert and find (random)', () => {

		const keys: number[] = [
			973, 974, 763, 977, 23, 21, 28, 860, 782, 760,
			4, 6, 594, 9, 210, 213, 211, 599, 2, 590,
			14, 16, 966, 19, 220, 223, 221, 960, 12, 965,
			214, 216, 37, 219, 969, 961, 968, 779, 982, 5,
			224, 226, 976, 229, 979, 971, 978, 781, 992, 15,
			989, 988, 981, 995, 42, 239, 25, 234, 236, 986,
			990, 35, 249, 246, 997, 212, 1000, 991, 993, 244,
			320, 45, 319, 316, 47, 222, 10, 321, 323, 314,
			324, 331, 333, 232, 218, 330, 329, 326, 217, 20,
			334, 341, 343, 242, 228, 340, 339, 336, 227, 30,
			344, 346, 237, 349, 350, 353, 351, 40, 312, 238,
			354, 356, 247, 359, 360, 363, 361, 215, 322, 248,
			371, 373, 364, 332, 315, 370, 267, 366, 317, 225,
			263, 268, 374, 261, 342, 277, 328, 376, 327, 235,
			325, 335, 368, 284, 369, 372, 289, 358, 286, 357,

			789, 994, 996, 783, 999, 43, 41, 48, 580, 962,
			383, 384, 386, 293, 282, 389, 365, 279, 275, 381,
			34, 32, 985, 36, 980, 17, 39, 240, 243, 241,
			308, 306, 377, 265, 309, 269, 304, 272, 301, 355,
			292, 393, 54, 56, 51, 53, 59, 391, 390, 303,
			302, 401, 394, 396, 285, 399, 408, 400, 380, 375,
			762, 1, 592, 593, 575, 596, 8, 3, 577, 750,
			295, 404, 406, 50, 409, 80, 81, 83, 260, 382,
			298, 345, 378, 294, 379, 262, 299, 291, 296, 367,
			305, 84, 86, 307, 89, 519, 511, 518, 270, 52,
			512, 514, 387, 517, 539, 531, 538, 280, 392, 388,
			44, 46, 27, 49, 313, 311, 318, 769, 972, 998,
			532, 534, 57, 537, 60, 63, 61, 290, 402, 58,
			64, 66, 397, 398, 69, 548, 549, 300, 541, 82,
			542, 544, 559, 407, 405, 547, 558, 385, 551, 513,

			273, 278, 352, 338, 266, 264, 245, 271, 287, 337,
			552, 554, 569, 568, 55, 87, 88, 557, 561, 533,
			562, 564, 639, 638, 395, 516, 515, 567, 631, 62,
			632, 634, 70, 73, 403, 536, 535, 637, 71, 543,
			684, 686, 699, 698, 450, 131, 135, 683, 691, 152,
			694, 696, 673, 675, 490, 143, 145, 693, 678, 162,
			672, 674, 99, 98, 660, 153, 155, 677, 93, 502,
			963, 964, 13, 18, 791, 586, 585, 967, 11, 772,
			283, 288, 274, 348, 276, 281, 362, 297, 347, 310,
			92, 94, 163, 97, 100, 101, 103, 130, 682, 165,
			983, 984, 773, 987, 33, 31, 38, 570, 598, 770,
			104, 106, 507, 109, 113, 508, 119, 140, 692, 118,
			734, 736, 951, 959, 935, 940, 958, 936, 895, 952,
			114, 116, 687, 117, 123, 685, 129, 150, 671, 128,
			124, 126, 697, 127, 183, 695, 180, 160, 91, 181,

			184, 186, 676, 189, 193, 670, 190, 505, 102, 191,
			194, 196, 96, 199, 701, 95, 709, 680, 112, 708,
			704, 706, 107, 703, 605, 108, 606, 690, 122, 600,
			602, 603, 111, 604, 818, 115, 817, 679, 182, 815,
			814, 816, 121, 813, 828, 125, 827, 90, 192, 825,
			824, 826, 187, 823, 840, 841, 848, 105, 702, 188,
			802, 804, 707, 806, 850, 851, 858, 120, 812, 705,
			844, 846, 197, 849, 803, 805, 800, 110, 608, 198,
			613, 614, 811, 629, 628, 625, 195, 842, 617, 810,
			164, 166, 503, 167, 501, 500, 497, 440, 495, 132,
			623, 624, 821, 929, 928, 925, 700, 808, 627, 820,
			854, 856, 601, 859, 619, 618, 615, 185, 822, 609,
			834, 836, 801, 870, 873, 871, 819, 612, 833, 809,
			884, 922, 611, 616, 889, 890, 886, 893, 891, 845,

			664, 523, 433, 432, 663, 139, 666, 133, 138, 205,
			134, 452, 443, 441, 137, 149, 136, 141, 148, 480,
			790, 794, 737, 717, 798, 725, 795, 869, 723, 732,
			874, 876, 883, 853, 879, 881, 880, 857, 829, 622,
			894, 896, 903, 621, 909, 901, 900, 626, 807, 832,
			914, 916, 931, 937, 938, 939, 838, 610, 830, 882,
			904, 906, 913, 921, 919, 911, 910, 926, 855, 872,
			714, 716, 721, 908, 915, 728, 729, 897, 875, 932,
			724, 726, 731, 918, 930, 738, 739, 907, 885, 942,
			24, 26, 7, 29, 506, 233, 231, 970, 22, 975,
			923, 924, 847, 837, 835, 831, 607, 852, 927, 843,
			933, 230, 934, 941, 892, 899, 948, 949, 877, 620,
			953, 878, 954, 946, 898, 749, 741, 748, 839, 912,
			744, 950, 746, 956, 945, 955, 753, 957, 905, 712,

			943, 710, 944, 887, 888, 719, 711, 718, 920, 902,
			74, 947, 76, 67, 68, 170, 173, 171, 85, 553,
			154, 79, 156, 451, 453, 169, 161, 168, 437, 662,
			174, 157, 176, 546, 545, 419, 418, 410, 510, 563,
			144, 179, 146, 526, 525, 159, 151, 158, 427, 492,
			504, 147, 667, 665, 509, 689, 681, 688, 520, 142,
			758, 751, 917, 759, 715, 797, 713, 722, 754, 727,
			414, 411, 556, 415, 259, 258, 253, 530, 633, 555,
			254, 251, 566, 255, 469, 468, 465, 65, 72, 565,
			464, 466, 636, 467, 479, 478, 470, 540, 172, 635,
			474, 476, 77, 475, 647, 645, 643, 550, 416, 78,
			642, 644, 177, 640, 657, 655, 653, 560, 256, 178,
			652, 654, 412, 650, 209, 201, 200, 630, 462, 413,
			204, 206, 472, 250, 252, 208, 483, 488, 489, 75,
			484, 486, 641, 463, 461, 485, 429, 428, 420, 175,

			424, 421, 651, 471, 477, 425, 439, 438, 430, 417,
			434, 431, 202, 648, 646, 435, 449, 448, 445, 257,
			444, 446, 482, 658, 656, 447, 529, 521, 528, 460,
			522, 426, 203, 207, 527, 459, 524, 458, 455, 473,
			454, 436, 481, 487, 457, 499, 456, 491, 498, 649,
			494, 442, 423, 422, 493, 669, 496, 661, 668, 659,
			868, 861, 864, 747, 756, 863, 735, 579, 733, 742,
			578, 571, 574, 757, 796, 573, 745, 589, 743, 752,
			588, 581, 583, 793, 866, 587, 761, 768, 765, 792,
			764, 766, 862, 755, 576, 767, 771, 778, 775, 720,
			774, 776, 572, 799, 584, 777, 787, 785, 780, 730,
			784, 786, 582, 865, 867, 788, 597, 591, 595, 740
		];

		const records: any[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

		for (let data = 0; data < keys.length; data++) {
			insert(records, 1, keys[data], keys[data] * 10);
		}

		let each_depth: any[] = [];
		let depth_sum: number = 0;
		for (let data = 0; data < keys.length; data++) {
			const x = find(records, [], 1, keys[data]);
			each_depth.push(x[0].length);
			depth_sum += x[0].length;
			expect(x[2]).toBe(keys[data] * 10);
		}

		const ave_depth = depth_sum / keys.length;

		let sum = 0;
		for (let index = 0; index < keys.length; index++) {
			sum += (each_depth[index] - ave_depth) ** 2;
		}

		const dispersion = sum / keys.length;

		const space_efficiency = records.length / keys.length;

		console.log("ave_depth : " + ave_depth + " dispersion : " + dispersion + " space_efficiency : " + space_efficiency);

	});

});

/*
describe('example', () => {

	it('test', () => {

		let a = 0;

		const startTime = new Date().getTime();

		for (let index1 = 0; index1 < 1000000000; index1++) {
			a = index1 * 1000;
		}

		const endTime = new Date().getTime();

		console.log((endTime - startTime),a);

	});
})
*/
