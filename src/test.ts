/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {append_record, find, find_at_node, grater, insert, insert_to_node, key, lesser, move_entry, node_record, set_grater, set_key, set_lesser, set_value, split_node, update_record, value} from "./index";


describe('balanced tree', () => {

	const keys: number[] = [
		973, 974, 763, 977, 23, 21, 28, 860, 782, 760,
		4, 6, 594, 9, 210, 213, 211, 599, 2, 590,
		14, 16, 966, 19, 220, 223, 221, 960, 12, 965,
		214, 216, 37, 219, 969, 961, 968, 779, 982, 5,
		224, 226, 976, 229, 979, 971, 978, 781, 992, 15,
		989, 988, 981, 995, 42, 239, 25, 234, 236, 986,
		990, 35, 249, 246, 997, 212, 0, 991, 993, 244,
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
		884, 922, 611, 616, 889, 890, 886, 893, 891, 845,
		664, 523, 433, 432, 663, 139, 666, 133, 138, 205,
		134, 452, 443, 441, 137, 149, 136, 141, 148, 480,
		790, 794, 737, 717, 798, 725, 795, 869, 723, 732,
		868, 861, 864, 747, 756, 863, 735, 579, 733, 742,
		578, 571, 574, 757, 796, 573, 745, 589, 743, 752,
		588, 581, 583, 793, 866, 587, 761, 768, 765, 792,
		764, 766, 862, 755, 576, 767, 771, 778, 775, 720,
		774, 776, 572, 799, 584, 777, 787, 785, 780, 730,
		784, 786, 582, 865, 867, 788, 597, 591, 595, 740
	];


	it("etc", () => {
		const records = [
			0, 10, 100,
			0, 20, 200,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 30, 300,
			0, 40, 400,
			0, 0, 0,
			0, 0, 0,
			0,
			1, 25, 500,
			2, 45, 600,
			4, 65, 0,
			5, 85, 0,
			6,
			0, 50, 500,
			0, 60, 600,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 70, 700,
			0, 80, 800,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 90, 900,
			0, 100, 1000,
			0, 0, 0,
			0, 0, 0,
			0
		]

		let node = [
			1, 10, 100,
			2, 20, 200,
			3, 30, 300,
			4, 40, 400,
			5, 50, 500,
			6]

		let remain = move_entry(node, 1);
		expect(node).toStrictEqual([
			1, 10, 100,
			1, 10, 100,
			2, 20, 200,
			3, 30, 300,
			4, 40, 400,
			5])
		expect(remain).toStrictEqual([
			5, 50, 500,
			6])

		node = [
			1, 10, 100,
			2, 20, 200,
			3, 30, 300,
			4, 40, 400,
			5, 50, 500,
			6]

		remain = move_entry(node, 2);
		expect(node).toStrictEqual([
			1, 10, 100,
			2, 20, 200,
			2, 20, 200,
			3, 30, 300,
			4, 40, 400,
			5])
		expect(remain).toStrictEqual([
			5, 50, 500,
			6])


		node = [
			1, 10, 100,
			2, 20, 200,
			3, 30, 300,
			4, 40, 400,
			5, 50, 500,
			6]

		remain = move_entry(node, 3);
		expect(node).toStrictEqual([
			1, 10, 100,
			2, 20, 200,
			3, 30, 300,
			3, 30, 300,
			4, 40, 400,
			5])
		expect(remain).toStrictEqual([
			5, 50, 500,
			6])

		node = [
			1, 10, 100,
			2, 20, 200,
			3, 30, 300,
			4, 40, 400,
			5, 50, 500,
			6]

		remain = move_entry(node, 4);
		expect(node).toStrictEqual([
			1, 10, 100,
			2, 20, 200,
			3, 30, 300,
			4, 40, 400,
			4, 40, 400,
			5])
		expect(remain).toStrictEqual([
			5, 50, 500,
			6])

	});

	it("accessor", () => {
		const records = [
			0, 10, 100,
			0, 20, 200,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 30, 300,
			0, 40, 400,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			1, 25, 500,
			2, 45, 600,
			4, 65, 0,
			5, 85, 0,
			6, 0, 0,
			0,
			0, 50, 500,
			0, 60, 600,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 70, 700,
			0, 80, 800,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 90, 900,
			0, 100, 1000,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0
		]


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

	it("split node", () => {

		const node = [
			1, 10, 100,
			2, 20, 200,
			3, 30, 300,
			4, 40, 400,
			5, 50, 500,
			6, 60, 600,
			7
		]

		expect(split_node(node)[0]).toStrictEqual([
				1, 10, 100,
				2, 20, 200,
				3, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0
			]
		);

		expect(split_node(node)[1]).toStrictEqual([
				3, 30, 300,
				4, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0
			]
		);

		expect(split_node(node)[2]).toStrictEqual([
				4, 40, 400,
				5, 50, 500,
				6, 60, 600,
				7, 0, 0,
				0, 0, 0,
				0
			]
		);

	})

	it("find at node", () => {


		const node = [2, 10, 100, 3, 20, 200, 4, 30, 300, 5, 40, 400, 6, 50, 500, 7];

		const a = find_at_node(node, 1, 15);

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

	it("find", () => {
		const records = [
			0, 10, 100,
			0, 20, 200,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 30, 300,
			0, 40, 400,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			1, 25, 500,
			2, 45, 600,
			4, 65, 0,
			5, 85, 0,
			6, 0, 0,
			0,
			0, 50, 500,
			0, 60, 600,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 70, 700,
			0, 80, 800,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 90, 900,
			0, 100, 1000,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0
		]

		const result = find(records, [3, 2], 3, 40)

		expect(find(records, [], 3, 40)).toStrictEqual([[3, 2], 2, 400])
		expect(find(records, [], 3, 41)).toStrictEqual([[3, 2], 2, -1])

		expect(split_node(node_record(records, 3))[0]).toStrictEqual([
				1, 25, 500,
				2, 45, 600,
				4, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0
			]
		);

		expect(split_node(node_record(records, 3))[1]).toStrictEqual([
				4, 65, 0,
				5, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0
			]
		);

		expect(split_node(node_record(records, 3))[2]).toStrictEqual([
				5, 85, 0,
				6, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0, 0, 0,
				0
			]
		);

		expect(append_record(records, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16])).toBe(7)

		const records2 = [
			0, 10, 100,
			0, 20, 200,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 30, 300,
			0, 40, 400,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			1, 25, 500,
			2, 45, 600,
			4, 65, 0,
			5, 85, 0,
			6, 0, 0,
			0,
			0, 50, 500,
			0, 60, 600,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 70, 700,
			0, 80, 800,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 90, 900,
			0, 100, 1000,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16
		];

		expect(records).toStrictEqual(records2);

		const records3 = [
			0, 10, 100,
			0, 20, 200,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 30, 300,
			0, 40, 400,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			1, 25, 500,
			2, 45, 600,
			4, 65, 0,
			5, 85, 0,
			6, 0, 0,
			0,
			0, 50, 500,
			0, 60, 600,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 70, 700,
			0, 80, 800,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 90, 900,
			0, 100, 1000,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0, 0, 0,
			0
		];

		update_record(records2, 7, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
		expect(records2).toStrictEqual(records3);


	});

	it("find 2", () => {
		const records = [
			2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7,
			8, 10, 2000, 9, 20, 2000, 10, 30, 2000, 11, 40, 2000, 12, 50, 2000, 13,
			0, 110, 3000, 0, 120, 3000, 0, 130, 3000, 0, 140, 3000, 0, 150, 3000, 0,
			0, 210, 4000, 0, 220, 4000, 0, 230, 4000, 0, 240, 4000, 0, 250, 4000, 0,
			0, 310, 5000, 0, 320, 5000, 0, 330, 5000, 0, 340, 5000, 0, 350, 5000, 0,
			0, 410, 6000, 0, 420, 6000, 0, 430, 6000, 0, 440, 6000, 0, 450, 6000, 0,
			0, 510, 7000, 0, 520, 7000, 0, 530, 7000, 0, 540, 7000, 0, 550, 7000, 0,
			0, 1, 8000, 0, 2, 8000, 0, 3, 8000, 0, 4, 8000, 0, 5, 8000, 0,
			0, 11, 9000, 0, 12, 9000, 0, 13, 9000, 0, 14, 9000, 0, 15, 9000, 0,
			0, 21, 10000, 0, 22, 10000, 0, 23, 10000, 0, 24, 10000, 0, 25, 10000, 0,
			0, 31, 11000, 0, 32, 11000, 0, 33, 11000, 0, 34, 11000, 0, 35, 11000, 0,
			0, 41, 12000, 0, 42, 12000, 0, 43, 12000, 0, 44, 12000, 0, 45, 12000, 0,
			0, 51, 13000, 0, 52, 13000, 0, 53, 13000, 0, 54, 13000, 0, 55, 13000, 0
		]

		expect(find_at_node(records, 1, 1)).toStrictEqual([2, -1]);
		expect(find_at_node(records, 1, 300)).toStrictEqual([0, 1000]);
		expect(find_at_node(records, 1, 301)).toStrictEqual([5, -1]);

		const _parent: number[] = [];

		expect(find(records, _parent, 1, 33)).toStrictEqual([[1, 2, 11], 11, 11000]);

	});

	it("split", () => {
		const records = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 650, 5, 85, 850, 6, 105, 1050, 7,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]

		const hoge = split_node(node_record(records, 3));

		expect(split_node(node_record(records, 3))[0]).toStrictEqual(
			[1, 25, 500, 2, 45, 600, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		);

		expect(split_node(node_record(records, 3))[1]).toStrictEqual(
			[4, 65, 650, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		);

		expect(split_node(node_record(records, 3))[2]).toStrictEqual(
			[5, 85, 850, 6, 105, 1050, 7, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		);

	});

	it("append", () => {
		const records = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 0, 0, 0,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]

		expect(append_record(records, [1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 11, 12, 13, 14, 15, 16])).toBe(7)

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

	it('insert', () => {
		const records = [
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 40, 400, 0, 41, 410, 0, 42, 420, 0, 0, 0, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 105, 0, 7,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 110, 1100, 0, 120, 1200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		]

		let [root_node, node] = insert(records, 3, 32, 110);
		expect(records).toStrictEqual([
			0, 10, 100, 0, 20, 200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 30, 300, 0, 32, 110, 0, 40, 400, 0, 41, 410, 0, 42, 420, 0,
			1, 25, 500, 2, 45, 600, 4, 65, 0, 5, 85, 0, 6, 105, 0, 7,
			0, 50, 500, 0, 60, 600, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 70, 700, 0, 80, 800, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 90, 900, 0, 100, 1000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
			0, 110, 1100, 0, 120, 1200, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
		)

		console.log(root_node, node)
		const a = find(records, [], 3, 32);
		const b = find(records, [], 3, 110);
		console.log(a, b)


		const records2 = [
			2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7,
			8, 10, 2000, 9, 20, 2000, 10, 30, 2000, 11, 40, 2000, 12, 50, 2000, 13,
			0, 110, 3000, 0, 120, 3000, 0, 130, 3000, 0, 140, 3000, 0, 150, 3000, 0,
			0, 210, 4000, 0, 220, 4000, 0, 230, 4000, 0, 240, 4000, 0, 250, 4000, 0,
			0, 310, 5000, 0, 320, 5000, 0, 330, 5000, 0, 340, 5000, 0, 350, 5000, 0,
			0, 410, 6000, 0, 420, 6000, 0, 430, 6000, 0, 440, 6000, 0, 450, 6000, 0,
			0, 510, 7000, 0, 520, 7000, 0, 530, 7000, 0, 540, 7000, 0, 550, 7000, 0,
			0, 1, 8000, 0, 2, 8000, 0, 3, 8000, 0, 4, 8000, 0, 5, 8000, 0,
			0, 11, 9000, 0, 12, 9000, 0, 13, 9000, 0, 14, 9000, 0, 15, 9000, 0,
			0, 21, 10000, 0, 22, 10000, 0, 23, 10000, 0, 24, 10000, 0, 25, 10000, 0,
			0, 31, 11000, 0, 33, 11000, 0, 34, 11000, 0, 35, 11000, 0, 0, 0, 0,
			0, 41, 12000, 0, 42, 12000, 0, 43, 12000, 0, 44, 12000, 0, 45, 12000, 0,
			0, 51, 13000, 0, 52, 13000, 0, 53, 13000, 0, 54, 13000, 0, 55, 13000, 0
		];

		insert(records2, 1, 32, 1010);
		expect(records2).toStrictEqual([
			2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7,
			8, 10, 2000, 9, 20, 2000, 10, 30, 2000, 11, 40, 2000, 12, 50, 2000, 13,
			0, 110, 3000, 0, 120, 3000, 0, 130, 3000, 0, 140, 3000, 0, 150, 3000, 0,
			0, 210, 4000, 0, 220, 4000, 0, 230, 4000, 0, 240, 4000, 0, 250, 4000, 0,
			0, 310, 5000, 0, 320, 5000, 0, 330, 5000, 0, 340, 5000, 0, 350, 5000, 0,
			0, 410, 6000, 0, 420, 6000, 0, 430, 6000, 0, 440, 6000, 0, 450, 6000, 0,
			0, 510, 7000, 0, 520, 7000, 0, 530, 7000, 0, 540, 7000, 0, 550, 7000, 0,
			0, 1, 8000, 0, 2, 8000, 0, 3, 8000, 0, 4, 8000, 0, 5, 8000, 0,
			0, 11, 9000, 0, 12, 9000, 0, 13, 9000, 0, 14, 9000, 0, 15, 9000, 0,
			0, 21, 10000, 0, 22, 10000, 0, 23, 10000, 0, 24, 10000, 0, 25, 10000, 0,
			0, 31, 11000, 0, 32, 1010, 0, 33, 11000, 0, 34, 11000, 0, 35, 11000, 0,
			0, 41, 12000, 0, 42, 12000, 0, 43, 12000, 0, 44, 12000, 0, 45, 12000, 0,
			0, 51, 13000, 0, 52, 13000, 0, 53, 13000, 0, 54, 13000, 0, 55, 13000, 0]
		)


		const records3 = [
			2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7,
			8, 10, 2000, 9, 20, 2000, 10, 30, 2000, 11, 40, 2000, 12, 50, 2000, 13,
			0, 110, 3000, 0, 120, 3000, 0, 130, 3000, 0, 140, 3000, 0, 150, 3000, 0,
			0, 210, 4000, 0, 220, 4000, 0, 230, 4000, 0, 240, 4000, 0, 250, 4000, 0,
			0, 310, 5000, 0, 320, 5000, 0, 330, 5000, 0, 340, 5000, 0, 350, 5000, 0,
			0, 410, 6000, 0, 420, 6000, 0, 430, 6000, 0, 440, 6000, 0, 450, 6000, 0,
			0, 510, 7000, 0, 520, 7000, 0, 530, 7000, 0, 540, 7000, 0, 550, 7000, 0,
			0, 1, 8000, 0, 2, 8000, 0, 3, 8000, 0, 4, 8000, 0, 5, 8000, 0,
			0, 11, 9000, 0, 12, 9000, 0, 13, 9000, 0, 14, 9000, 0, 15, 9000, 0,
			0, 21, 10000, 0, 22, 10000, 0, 23, 10000, 0, 24, 10000, 0, 25, 10000, 0,
			0, 31, 11000, 0, 33, 11000, 0, 34, 11000, 0, 35, 11000, 0, 0, 0, 0,
			0, 41, 12000, 0, 42, 12000, 0, 43, 12000, 0, 44, 12000, 0, 45, 12000, 0,
			0, 51, 13000, 0, 52, 13000, 0, 53, 13000, 0, 54, 13000, 0, 55, 13000, 0
		];
		insert(records3, 1, 56, 1010);

	});


	it('insert 1', () => {
		const records = [
			2, 10, 1000, 3, 20, 2000, 4, 30, 3000, 5, 40, 4000, 6, 50, 5000, 7,
			0, 1, 100, 0, 2, 200, 0, 3, 300, 0, 4, 400, 0, 5, 500, 0,
			0, 11, 1100, 0, 12, 1200, 0, 13, 1300, 0, 14, 1400, 0, 15, 1500, 0,
			0, 21, 2100, 0, 22, 2200, 0, 23, 2300, 0, 24, 2400, 0, 25, 2500, 0,
			0, 31, 3100, 0, 32, 3200, 0, 33, 3300, 0, 34, 3400, 0, 35, 3500, 0,
			0, 41, 4100, 0, 42, 4200, 0, 43, 4300, 0, 44, 4400, 0, 45, 4500, 0,
			0, 51, 5100, 0, 52, 5200, 0, 53, 5300, 0, 54, 5400, 0, 55, 5500, 0]


	//	let [root_node, node] = insert(records, 1, 6, 600);
		//	insert(records, 3, 33, 330);

		console.log(JSON.stringify(records));

		/*
		expect(records).toStrictEqual([
			0, 10, 100,0, 20, 200,0, 0,  0,0, 0,  0,0,  0,  0,0,
			0, 30, 300,0, 32, 320,0,40,400,0,41,410,0, 42,420,0,
			1, 25, 500,2, 45, 600,4,65,  0,5,85,  0,6,105,  0,7,
			0, 50, 500,0, 60, 600,0, 0,  0,0, 0,  0,0,  0,  0,0,
			0, 70, 700,0, 80, 800,6, 0,  0,0, 0,  0,0,  0,  0,0,
			0, 90, 900,0,100,1000,7, 0,  0,0, 0,  0,0,  0,  0,0,
			0,110,1100,0,120,1200,0, 0,  0,0, 0,  0,0,  0,  0,0
			]
		)
*/
		let x = find(records, [], 1, 1);
		expect(x).toStrictEqual([[1, 2], 2, 100]);

		x = find(records, [], 1, 2);
		expect(x).toStrictEqual([[1, 2], 2, 200]);

		x = find(records, [], 1, 3);
		expect(x).toStrictEqual([[1, 2], 2, 300]);

		x = find(records, [], 1, 4);
		expect(x).toStrictEqual([[1, 2], 2, 400]);

		x = find(records, [], 1, 5);
		expect(x).toStrictEqual([[1, 2], 2, 500]);

		x = find(records, [], 1, 11);
		expect(x).toStrictEqual([[1, 3], 3, 1100]);

		x = find(records, [], 1, 12);
		expect(x).toStrictEqual([[1, 3], 3, 1200]);

		x = find(records, [], 1, 13);
		expect(x).toStrictEqual([[1, 3], 3, 1300]);

		x = find(records, [], 1, 14);
		expect(x).toStrictEqual([[1, 3], 3, 1400]);

		x = find(records, [], 1, 15);
		expect(x).toStrictEqual([[1, 3], 3, 1500]);

		x = find(records, [], 1, 21);
		expect(x).toStrictEqual([[1, 4], 4, 2100]);

		x = find(records, [], 1, 22);
		expect(x).toStrictEqual([[1, 4], 4, 2200]);

		x = find(records, [], 1, 23);
		expect(x).toStrictEqual([[1, 4], 4, 2300]);

		x = find(records, [], 1, 24);
		expect(x).toStrictEqual([[1, 4], 4, 2400]);

		x = find(records, [], 1, 25);
		expect(x).toStrictEqual([[1, 4], 4, 2500]);

		x = find(records, [], 1, 31);
		expect(x).toStrictEqual([[1, 5], 5, 3100]);

		x = find(records, [], 1, 32);
		expect(x).toStrictEqual([[1, 5], 5, 3200]);

		x = find(records, [], 1, 33);
		expect(x).toStrictEqual([[1, 5], 5, 3300]);

		x = find(records, [], 1, 34);
		expect(x).toStrictEqual([[1, 5], 5, 3400]);

		x = find(records, [], 1, 35);
		expect(x).toStrictEqual([[1, 5], 5, 3500]);

		x = find(records, [], 1, 41);
		expect(x).toStrictEqual([[1, 6], 6, 4100]);

		x = find(records, [], 1, 42);
		expect(x).toStrictEqual([[1, 6], 6, 4200]);

		x = find(records, [], 1, 43);
		expect(x).toStrictEqual([[1, 6], 6, 4300]);

		x = find(records, [], 1, 44);
		expect(x).toStrictEqual([[1, 6], 6, 4400]);

		x = find(records, [], 1, 45);
		expect(x).toStrictEqual([[1, 6], 6, 4500]);


	});

	it('insert 2', () => {

		const records3 = [
			2, 100, 1000, 3, 200, 1000, 4, 300, 1000, 5, 400, 1000, 6, 500, 1000, 7,
			8, 10, 2000, 9, 20, 2000, 10, 30, 2000, 11, 40, 2000, 12, 50, 2000, 13,
			0, 110, 3000, 0, 120, 3000, 0, 130, 3000, 0, 140, 3000, 0, 150, 3000, 0,
			0, 210, 4000, 0, 220, 4000, 0, 230, 4000, 0, 240, 4000, 0, 250, 4000, 0,
			0, 310, 5000, 0, 320, 5000, 0, 330, 5000, 0, 340, 5000, 0, 350, 5000, 0,
			0, 410, 6000, 0, 420, 6000, 0, 430, 6000, 0, 440, 6000, 0, 450, 6000, 0,
			0, 510, 7000, 0, 520, 7000, 0, 530, 7000, 0, 540, 7000, 0, 550, 7000, 0,
			0, 1, 8000, 0, 2, 8000, 0, 3, 8000, 0, 4, 8000, 0, 5, 8000, 0,
			0, 11, 9000, 0, 12, 9000, 0, 13, 9000, 0, 14, 9000, 0, 15, 9000, 0,
			0, 21, 10000, 0, 22, 10000, 0, 23, 10000, 0, 24, 10000, 0, 25, 10000, 0,
			0, 31, 11000, 0, 33, 11000, 0, 34, 11000, 0, 35, 11000, 0, 0, 0, 0,
			0, 41, 12000, 0, 42, 12000, 0, 43, 12000, 0, 44, 12000, 0, 45, 12000, 0,
			0, 51, 13000, 0, 52, 13000, 0, 53, 13000, 0, 54, 13000, 0, 55, 13000, 0
		];
		insert(records3, 1, 56, 1010);

		const r = find(records3, [], 1, 56);
		console.log(JSON.stringify(records3));

	});

	it('insert_to_node', () => {

		const hoge1 = insert_to_node([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			7], [0, 800, 2500, 1]);

		expect(hoge1).toStrictEqual([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			0, 800, 2500,
			1
		])

		expect(insert_to_node([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			7], [0, 800, 2500, 1])).toStrictEqual([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			0, 800, 2500,
			1])

		const reading = insert_to_node([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			7], [0, 50, 2500, 1]);

		expect(reading).toStrictEqual([
			0, 50, 2500,
			1, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			7]);

		const trailing = insert_to_node([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			7], [0, 800, 2500, 1]);

		expect(trailing).toStrictEqual([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			0, 800, 2500,
			1]);

		const middle = insert_to_node([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			7], [0, 250, 2500, 1]);

		expect(middle).toStrictEqual([
			2, 100, 1000,
			3, 200, 1000,
			0, 250, 2500,
			1, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			7]);

		const middle2 = insert_to_node([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			5, 400, 1000,
			6, 500, 1000,
			7], [0, 350, 2500, 1]);

		expect(middle2).toStrictEqual([
			2, 100, 1000,
			3, 200, 1000,
			4, 300, 1000,
			0, 350, 2500,
			1, 400, 1000,
			6, 500, 1000,
			7]);


	})

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
