import {basename} from 'path';
import deburr from 'lodash/deburr';

export default section => deburr(basename(section).replace(/\s+/g, '-'))
