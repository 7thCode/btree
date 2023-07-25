/**
 * Copyright © 2020 2021 2022 7thCode.(http://seventh-code.com/)
 * This software is released under the MIT License.
 * opensource.org/licenses/mit-license.php
 */

"use strict";

import {Entry, insert, find, insert_entry} from "./index";

describe('BTree', () => {

    it('find', () => {

        const records: Entry[] = [
                {key: 150, value: 3, lesser: 4, grater: null},
                {key: 200, value: 4, lesser: null, grater: 16},
                {key: null, value: null, lesser: null, grater: null},
                {key: null, value: null, lesser: null, grater: null},

                {key: 3, value: 0, lesser: null, grater: null},
                {key: 100, value: 1, lesser: null, grater: null},
                {key: 120, value: 2, lesser: null, grater: null},
                {key: null, value: null, lesser: null, grater: null},

                {key: 320, value: 5, lesser: null, grater: null},
                {key: 330, value: 6, lesser: null, grater: null},
                {key: 340, value: 7, lesser: null, grater: null},
                {key: 350, value: 8, lesser: null, grater: null},

                {key: 400, value: 10, lesser: null, grater: null},
                {key: 500, value: 11, lesser: null, grater: null},
                {key: 600, value: 12, lesser: null, grater: null},
                {key: null, value: null, lesser: null, grater: null},

                {key: 360, value: 9, lesser: 8, grater: 12},
                {key: null, value: null, lesser: null, grater: null},
                {key: null, value: null, lesser: null, grater: null},
                {key: null, value: null, lesser: null, grater: null},
            ]

       expect(insert(records, 0, 361, 100)).toBe(16);
       expect(find(records, 0, 0, 3)[2].value).toBe(0);
        expect(find(records, 0, 0, 100)[2].value).toBe(1);
        expect(find(records, 0, 0, 120)[2].value).toBe(2);
        expect(find(records, 0, 0, 150)[2].value).toBe(3);
        expect(find(records, 0, 0, 200)[2].value).toBe(4);
        expect(find(records, 0, 0, 320)[2].value).toBe(5);
        expect(find(records, 0, 0, 330)[2].value).toBe(6);
        expect(find(records, 0, 0, 340)[2].value).toBe(7);
        expect(find(records, 0, 0, 350)[2].value).toBe(8);
        expect(find(records, 0, 0, 360)[2].value).toBe(9);
        expect(find(records, 0, 0, 361)[2].value).toBe(100);
        expect(find(records, 0, 0, 400)[2].value).toBe(10);
        expect(find(records, 0, 0, 500)[2].value).toBe(11);
        expect(find(records, 0, 0, 600)[2].value).toBe(12);

        let records2: Entry[] = [
            {key: 100, value: null, lesser: 1, grater: null},
            {key: 200, value: null, lesser: null, grater: 8},
            {key: null, value: null, lesser: null, grater: null},
            {key: null, value: null, lesser: null, grater: null},
        ];

        insert_entry(records2, 0, 350, 200);
        expect(find(records2, 0, 0, 350)[2].value).toBe(200);

/*



		insert(records2, 0,  3, 1);

		console.log(records2);

		insert(records2, 0,  100, 2);
		insert(records2, 0,  120, 3);
		insert(records2, 0,  150, 4);
		insert(records2, 0,  200, 5);
		insert(records2, 0,  320, 6);
		insert(records2, 0,  330, 7);
		insert(records2, 0,  340, 8);
		insert(records2, 0,  350, 9);
		insert(records2, 0,  360, 10);
		insert(records2, 0,  361, 11);
		insert(records2, 0,  400, 12);
		insert(records2, 0,  500, 13);
		insert(records2, 0,  600, 14);

*/

    });

    it('insert', () => {

        let records: Entry[] = [
            {key: 100, value: null, lesser: 1, grater: null},
            {key: 200, value: null, lesser: null, grater: 8},
            {key: null, value: null, lesser: null, grater: null},
            {key: null, value: null, lesser: null, grater: null},
        ];

        insert_entry(records, 0, 350, 200);
        expect(find(records, 0, 0, 350)[2].value).toBe(200);

        /*



				insert(records2, 0,  3, 1);

				console.log(records2);

				insert(records2, 0,  100, 2);
				insert(records2, 0,  120, 3);
				insert(records2, 0,  150, 4);
				insert(records2, 0,  200, 5);
				insert(records2, 0,  320, 6);
				insert(records2, 0,  330, 7);
				insert(records2, 0,  340, 8);
				insert(records2, 0,  350, 9);
				insert(records2, 0,  360, 10);
				insert(records2, 0,  361, 11);
				insert(records2, 0,  400, 12);
				insert(records2, 0,  500, 13);
				insert(records2, 0,  600, 14);

		*/

    });

});
