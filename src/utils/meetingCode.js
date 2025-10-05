const crypto = require('crypto');

// Generates a URL-safe meeting code in the format xxx-xxx-xxx
// Each 'x' is an alphanumeric lowercase character (a-z0-9).
function generateMeetingCode(groups = 3, groupLength = 3) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const bytes = crypto.randomBytes(groups * groupLength);
  const chars = [];

  for (let i = 0; i < bytes.length; i++) {
    // Map byte to alphabet index
    chars.push(alphabet[bytes[i] % alphabet.length]);
  }

  const groupsArr = [];
  for (let g = 0; g < groups; g++) {
    groupsArr.push(chars.slice(g * groupLength, (g + 1) * groupLength).join(''));
  }

  return groupsArr.join('-');
}

module.exports = {
  generateMeetingCode
};
// Utility to generate a Google-Meet-like random meeting code
// Pattern used: 3-4-3 (total 10 chars) with lowercase letters and digits
function generateMeetingCode() {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const pick = (n) => {
    let s = '';
    for (let i = 0; i < n; i++) {
      s += chars[Math.floor(Math.random() * chars.length)];
    }
    return s;
  };

  // 3-4-3
  return `${pick(3)}-${pick(3)}-${pick(3)}`;
}

module.exports = {
  generateMeetingCode
};
