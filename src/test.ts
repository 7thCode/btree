/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {create_node, Entry, Find, Insert} from "./index";

describe('BTree', () => {
	/*
		it("etc", () => {

			expect(between(100, 99, 101)).toBeTruthy();

			const entry: Entry = {
				key: null,
				value: null,
				lesser: null,
				grater: null
			}

			expect(is_empty_entry(entry)).toBeTruthy();

			const empty_node: Entry[] = create_node();

			expect(is_empty_node(empty_node, 0)).toBeTruthy();

		});
	*/

	it("find", () => {

		let records = [
			{"key": 150, "value": 1, "lesser": 9, "grater": null},
			{"key": 200, "value": 2, "lesser": null, "grater": null},
			{"key": 300, "value": 3, "lesser": null, "grater": 5},
			{"key": null, "value": null, "lesser": null, "grater": null},

			{"key": 320, "value": 4, "lesser": null, "grater": null},
			{"key": 600, "value": 5, "lesser": null, "grater": null},
			{"key": null, "value": null, "lesser": null, "grater": null},
			{"key": null, "value": null, "lesser": null, "grater": null},

			{"key": 3, "value": 6, "lesser": null, "grater": null},
			{"key": 100, "value": 7, "lesser": null, "grater": null},
			{"key": null, "value": null, "lesser": null, "grater": null},
			{"key": null, "value": null, "lesser": null, "grater": null},

		];

		const entry1: any = Find(records, 150);
		const entry2: any = Find(records, 200);
		const entry3: any = Find(records, 300);
		const entry4: any = Find(records, 320);
		const entry5: any = Find(records, 600);
		const entry6: any = Find(records, 3);
		const entry7: any = Find(records, 100);

		expect(entry1.value).toBe(1);
		expect(entry2.value).toBe(2);
		expect(entry3.value).toBe(3);
		expect(entry4.value).toBe(4);
		expect(entry5.value).toBe(5);
		expect(entry6.value).toBe(6);
		expect(entry7.value).toBe(7);

//		console.log(JSON.stringify(records));
	});

	it('insert', () => {

		let records: Entry[] = create_node();

		let keys = [3, 600, 100, 320, 150, 300, 200, 160, 120, 1, 310, 2, 420, 12, 80, 72, 65, 82, 88, 273, 432, 99, 437, 998, 286];

		for (let index = 0; index < keys.length; index++) {
			Insert(records, keys[index], index);
		}

		for (let index = 0; index < keys.length; index++) {
			const entry: any = Find(records, keys[index]);
			expect(entry.value).toBe(index);
		}

		console.log(records.length / keys.length);

	});

	it('seq insert', () => {

		let records: Entry[] = create_node();

		for (let index = 1; index < 1000; index++) {
			Insert(records, index, index + 1);
		}

		for (let index = 1; index < 1000; index++) {
			let found: Entry = Find(records, index);
			if (found) {
				expect(found.value).toBe(index + 1);
			}
		}

		console.log("seq insert : " + records.length / 1000);
	});

	it('random insert 2', () => {

		let records: Entry[] = create_node();

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

		for (let index = 0; index < keys.length; index++) {
			Insert(records, keys[index], index);
		}

		for (let index = 0; index < keys.length; index++) {
			const value: Entry = Find(records, keys[index]);
			if (!value) {
				console.log(keys[index])
			}
		}

		console.log(records.length / 1000);
	});

	it('random insert 3', () => {

		let records: Entry[] = create_node();

		const keys: number[] = []

		for (let index = 0; index < 10000; index++) {
			const new_key = Math.floor(Math.random() * 10000) + 1;
			if (!keys.find(a => a === new_key)) {
				keys.push(new_key)
			}
		}

		for (let index = 0; index < keys.length; index++) {
			Insert(records, keys[index], index);
		}

		const startTime = new Date().getTime();

		for (let index = 0; index < keys.length; index++) {
			const value: Entry = Find(records, keys[index]);
			if (value) {
				expect(value.key).toBe(keys[index]);
			} else {
				expect(true).toBe(false);
			}
		}

		const endTime = new Date().getTime();

		console.log("time : " + ((endTime - startTime) / keys.length));
		console.log("space : " + records.length / keys.length);
	});

	/*
		it('erase', () => {

			let records = [
				{"key":150,"value":1,"lesser":9,"grater":null},
				{"key":200,"value":2,"lesser":null,"grater":null},
				{"key":300,"value":3,"lesser":null,"grater":5},
				{"key":null,"value":null,"lesser":null,"grater":null},

				{"key":320,"value":4,"lesser":null,"grater":null},
				{"key":600,"value":5,"lesser":null,"grater":null},
				{"key":null,"value":null,"lesser":null,"grater":null},
				{"key":null,"value":null,"lesser":null,"grater":null},

				{"key":3,"value":6,"lesser":null,"grater":null},
				{"key":100,"value":7,"lesser":null,"grater":null},
				{"key":null,"value":null,"lesser":null,"grater":null},
				{"key":null,"value":null,"lesser":null,"grater":null},

			];

			erase(records,  1,320);
			erase(records,  1,600);

			console.log(JSON.stringify(records));

		});
	*/
	/*
		it('erase 2', () => {

			let records: Entry[] = create_node();

			let keys = [3, 600, 100, 320, 150, 300, 200, 160, 120, 1, 310, 2, 420,12, 80, 72,65,82, 88,273,432,99,437,998,286];

			for (let index = 0; index < keys.length; index++) {
				Insert(records,  keys[index], index);
			}

			for (let index = 0; index < keys.length; index++) {
				const entry: any = Find(records, keys[index]);
				expect(entry.value).toBe(index);
			}

			for (let index = 0; index < keys.length; index++) {
				const entry: boolean = erase(records,1, keys[index]);
			}

			console.log(JSON.stringify(records));

		});
	*/
	/*
	it('test', () => {

		let a = 0;

		const startTime = new Date().getTime();

		for (let index1 = 0; index1 < 1000000000; index1++ ) {
			a = index1 * 1000;
		}

		const endTime = new Date().getTime();

		console.log((endTime - startTime));

	});
*/


});


