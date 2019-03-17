'use strict';

const Long = require('long');

class FileTime {

    /**
     * Convert a Win32 FILETIME structure to a `Date` object
     * @param {int} low
     * @param {int} high
     * @returns {number} A unix time. Can be converted to Date lie "new Date(time)"
     */
    static toUnix(low, high) {
        
        if (typeof low === 'object' && high === undefined) {
            high = arguments[0].high;
            low = arguments[0].low;
        }
        
        var ulong = new Long(low, high, true).div(10000);
        var epochBase = ulong.sub(11644473600000);
        
        if (epochBase.greaterThan(ulong)) {
            epochBase = epochBase.toSigned();
        }

        return epochBase.toNumber();
    }

    /**
     * Convert a unix timestamp or `Date` object to a Win32 FILETIME structure
     * @param {Date|number} date object or unix time
     * @returns {{low: int, high: int}}
     */
    static fromUnix(date) {

        const timestamp = +date;
        const long = Long
            .fromNumber(timestamp, timestamp >= 0)
            .add(11644473600000)
            .mul(10000);
        
        return { low: long.getLowBitsUnsigned(), high: long.getHighBitsUnsigned() };
    }

    /**
     * Convert a `Date` object to a Win32 FILETIME structure
     * @param {Date} date
     * @returns {{low: int, high: int}}
     */
    static fromDate(date) {
        return FileTime.fromUnix(date);
    }
    
    /**
     * Convert a Win32 FILETIME structure to a `Date` object
     * @param {int} low
     * @param {int} high
     * @returns {Date} A javascript Date object.
     */
    static toDate(low, high) {
        return new Date(FileTime.toUnix(low, high));
    }
    
    /**
     * Convert a Win32 FILETIME structure to a `Date` object
     * @param {int} low
     * @param {int} high
     * @returns {number} A unix time. Can be converted to Date lie "new Date(time)"
     * @deprecated use `FileTime.toUnix(low, high)` instead
     */
    static fromFileTime(low, high) {
        return FileTime.toUnix(low, high);
    }
    
    /**
     * Convert a js timestamp or `Date` object to a Win32 FILETIME structure
     * @param {Date|number} date object or unix time
     * @returns {{low: int, high: int}}
     * @deprecated use `FileTime.fromUnix(low, high)` instead
     */
    static toFileTime(date) {
        return FileTime.fromUnix(date);
    }

};

/** @type {typeof FileTime} */
module.exports = FileTime;
