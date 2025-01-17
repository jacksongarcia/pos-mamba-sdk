function pad(val, len = 2) {
  return String(val).padStart(len, '0');
}

/** Adapted from http://blog.stevenlevithan.com/archives/date-time-format */
const maskPattern = /dd?|mm?|yy(?:yy)?|([HhMs])\1?/g;
export function format(date, mask) {
  if (typeof date.getFullYear !== 'function') {
    throw new Error('Must pass a Date object to format it');
  }

  if (typeof mask !== 'string' || !mask.length) {
    throw new Error(
      "Invalid mask passed. Must be a string of these characters: 'dd', 'm', 'mm', 'yy', 'yyyy', 'h', 'hh', 'H', 'HH', 'M', 'MM', 's', 'ss'",
    );
  }
  const d = date.getDate();
  const year = date.getFullYear();
  const m = date.getMonth() + 1;
  const H = date.getHours();
  const M = date.getMinutes();
  const s = date.getSeconds();

  /** Support for: dd, m, mm, yy, yyyy, h, hh, H, HH, M, MM, s, ss */
  const flags = {
    d,
    dd: pad(d),
    m,
    mm: pad(m),
    yy: String(year).substring(2),
    yyyy: year,
    h: H % 12 || 12,
    hh: pad(H % 12 || 12),
    H,
    HH: pad(H),
    M,
    MM: pad(M),
    s,
    ss: pad(s),
  };

  return mask.replace(maskPattern, match => {
    /* istanbul ignore next */
    return flags[match] || match;
  });
}

export function isValidDate(date) {
  return (
    typeof date === 'object' &&
    typeof date.getTime === 'function' &&
    !Number.isNaN(date.getTime())
  );
}

export function isValidTime(time) {
  return /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(time);
}

export function compareTime(timeA, timeB) {
  if (isValidTime(timeA) && isValidTime(timeB)) {
    const datetimeA = new Date();
    datetimeA.setHours(...timeA.split(':'));
    const datetimeB = new Date();
    datetimeB.setHours(...timeB.split(':'));
    const timeDiff = datetimeA - datetimeB;

    if (timeDiff > 0) {
      return 1;
    }
    if (timeDiff < 0) {
      return -1;
    }
    return 0;
  }
  return NaN;
}
