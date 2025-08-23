// Copyright (c) 2018-2025, Brandon Lehmann <brandonlehmann@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import assert from 'assert';
import { it, describe } from 'mocha';
import Logger from '../src';
import { existsSync, statSync } from 'fs';

describe('Logger Tests', () => {
    it('Log path exists', () => {
        assert.equal(existsSync(Logger.path), true);
    });

    it('Enable Default Log', () => {
        Logger.enableDefaultLog();
    });

    it('Creates file log', () => {
        Logger.debug('Test');

        assert.equal(existsSync(Logger.defaultFilenamePath), true);
    });

    describe('Disable Log File', () => {
        let size = 0;

        before(() => {
            size = statSync(Logger.defaultFilenamePath).size;
        });

        it('Verify Log File Size Does Not Increase', () => {
            Logger.disableDefaultLog();

            Logger.debug('Insert record');

            const _size = statSync(Logger.defaultFilenamePath).size;

            assert.equal(size, _size);
        });
    });
});
