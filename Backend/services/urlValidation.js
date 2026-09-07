const dns = require('dns').promises;
const net = require('net');

const isPrivateIpv4 = (address) => {
  const octets = address.split('.').map(Number);
  return octets[0] === 10 || octets[0] === 127 || (octets[0] === 169 && octets[1] === 254) ||
    (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) || (octets[0] === 192 && octets[1] === 168);
};

const isPrivateAddress = (address) => {
  if (net.isIPv4(address)) return isPrivateIpv4(address);
  return net.isIPv6(address) && (address === '::1' || address.toLowerCase().startsWith('fc') || address.toLowerCase().startsWith('fd') || address.toLowerCase().startsWith('fe80'));
};

const validateExternalUrl = async (value) => {
  let parsed;
  try {
    parsed = new URL(value);
  } catch {
    throw new Error('A valid RSS URL is required.');
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || parsed.username || parsed.password) {
    throw new Error('Only public HTTP(S) URLs are allowed.');
  }

  if (parsed.hostname === 'localhost' || parsed.hostname.endsWith('.localhost') || parsed.hostname === 'metadata.google.internal') {
    throw new Error('Private network URLs are not allowed.');
  }

  const addresses = net.isIP(parsed.hostname) ? [parsed.hostname] : (await dns.lookup(parsed.hostname, { all: true })).map(result => result.address);
  if (!addresses.length || addresses.some(isPrivateAddress)) {
    throw new Error('Private network URLs are not allowed.');
  }

  return parsed.toString();
};

module.exports = { validateExternalUrl };