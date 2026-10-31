/**
 * subnet-calculator.js - IPv4 Subnet & CIDR Calculation Engine
 * Designed for Network Engineers & CCNA Students
 * Author: Sabbir Hasan (https://sabbirhasan.com)
 */

function ipToInt(ip) {
    return ip.split('.').reduce((acc, octet) => ((acc << 8) + parseInt(octet, 10)) >>> 0, 0);
}

function intToIp(int) {
    return [
        (int >>> 24) & 255,
        (int >>> 16) & 255,
        (int >>> 8) & 255,
        int & 255
    ].join('.');
}

function intToBinary(int) {
    return [
        ((int >>> 24) & 255).toString(2).padStart(8, '0'),
        ((int >>> 16) & 255).toString(2).padStart(8, '0'),
        ((int >>> 8) & 255).toString(2).padStart(8, '0'),
        (int & 255).toString(2).padStart(8, '0')
    ].join('.');
}

function isValidIpv4(ip) {
    const parts = ip.trim().split('.');
    if (parts.length !== 4) return false;
    return parts.every(part => {
        if (!/^\d+$/.test(part)) return false;
        const num = parseInt(part, 10);
        return num >= 0 && num <= 255 && String(num) === part;
    });
}

function getIpScope(firstOctet, secondOctet) {
    if (firstOctet === 10) return 'Private (RFC 1918 Class A)';
    if (firstOctet === 172 && secondOctet >= 16 && secondOctet <= 31) return 'Private (RFC 1918 Class B)';
    if (firstOctet === 192 && secondOctet === 168) return 'Private (RFC 1918 Class C)';
    if (firstOctet === 127) return 'Loopback / Host';
    if (firstOctet === 169 && secondOctet === 254) return 'Link-Local / APIPA';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Multicast (Class D)';
    if (firstOctet >= 240) return 'Experimental (Class E)';
    return 'Public Internet';
}

function getIpClass(firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126) return 'Class A';
    if (firstOctet === 127) return 'Loopback';
    if (firstOctet >= 128 && firstOctet <= 191) return 'Class B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'Class C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'Class D (Multicast)';
    return 'Class E (Reserved)';
}

function calculateSubnet() {
    const ipInput = document.getElementById('ipInput');
    const cidrSelect = document.getElementById('cidrSelect');
    if (!ipInput || !cidrSelect) return;

    let ipStr = ipInput.value.trim();
    // Support CIDR notation entered directly into IP input (e.g. 192.168.1.1/24)
    if (ipStr.includes('/')) {
        const parts = ipStr.split('/');
        ipStr = parts[0].trim();
        const cidrVal = parseInt(parts[1], 10);
        if (cidrVal >= 1 && cidrVal <= 32) {
            cidrSelect.value = cidrVal;
        }
    }

    if (!isValidIpv4(ipStr)) {
        document.getElementById('resNetwork').innerText = 'Invalid IP Address';
        document.getElementById('resBroadcast').innerText = '-';
        document.getElementById('resFirstHost').innerText = '-';
        document.getElementById('resLastHost').innerText = '-';
        document.getElementById('resUsableHosts').innerText = '0';
        return;
    }

    const cidr = parseInt(cidrSelect.value, 10);
    const ipInt = ipToInt(ipStr);
    const maskInt = cidr === 0 ? 0 : (((0xFFFFFFFF << (32 - cidr))) >>> 0);
    const wildcardInt = (~maskInt) >>> 0;

    const networkInt = (ipInt & maskInt) >>> 0;
    const broadcastInt = (networkInt | wildcardInt) >>> 0;

    const networkIp = intToIp(networkInt);
    const broadcastIp = intToIp(broadcastInt);
    const maskIp = intToIp(maskInt);
    const wildcardIp = intToIp(wildcardInt);
    const binaryMask = intToBinary(maskInt);

    let firstHostIp = '-';
    let lastHostIp = '-';
    let usableHosts = 0;

    if (cidr === 31) {
        // RFC 3021 point-to-point links
        firstHostIp = intToIp(networkInt);
        lastHostIp = intToIp(broadcastInt);
        usableHosts = 2;
    } else if (cidr === 32) {
        // Single host route
        firstHostIp = intToIp(networkInt);
        lastHostIp = intToIp(networkInt);
        usableHosts = 1;
    } else {
        firstHostIp = intToIp((networkInt + 1) >>> 0);
        lastHostIp = intToIp((broadcastInt - 1) >>> 0);
        usableHosts = Math.pow(2, 32 - cidr) - 2;
    }

    const octets = ipStr.split('.').map(Number);
    const ipClass = getIpClass(octets[0]);
    const ipScope = getIpScope(octets[0], octets[1]);

    // Update UI elements
    document.getElementById('resNetwork').innerText = `${networkIp} /${cidr}`;
    document.getElementById('resBroadcast').innerText = broadcastIp;
    document.getElementById('resFirstHost').innerText = firstHostIp;
    document.getElementById('resLastHost').innerText = lastHostIp;
    document.getElementById('resUsableHosts').innerText = usableHosts.toLocaleString();
    document.getElementById('resSubnetMask').innerText = maskIp;
    document.getElementById('resWildcard').innerText = wildcardIp;
    document.getElementById('resIpClass').innerText = `${ipClass} · ${ipScope}`;
    document.getElementById('resBinaryMask').innerText = binaryMask;

    // Cisco IOS Snippet
    const ciscoSnippet = `! Cisco IOS Configuration Example
interface GigabitEthernet0/0
 description Primary Gateway Interface
 ip address ${firstHostIp} ${maskIp}
 no shutdown
exit
! Network Route Example
ip route ${networkIp} ${maskIp} GigabitEthernet0/0`;

    document.getElementById('ciscoSnippet').innerText = ciscoSnippet;
}

function initCidrDropdown() {
    const select = document.getElementById('cidrSelect');
    if (!select) return;
    select.innerHTML = '';

    for (let c = 32; c >= 1; c--) {
        const maskInt = c === 0 ? 0 : (((0xFFFFFFFF << (32 - c))) >>> 0);
        const maskIp = intToIp(maskInt);
        const option = document.createElement('option');
        option.value = c;
        option.text = `/${c} — ${maskIp}`;
        if (c === 24) option.selected = true;
        select.appendChild(option);
    }
}

function applyPreset(ip, cidr) {
    document.getElementById('ipInput').value = ip;
    document.getElementById('cidrSelect').value = cidr;
    calculateSubnet();
}

function copyValue(elementId) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const text = el.innerText;
    navigator.clipboard.writeText(text).then(() => {
        if (window.showToast) window.showToast('Copied: ' + text);
        else alert('Copied: ' + text);
    });
}

function copyCiscoConfig(btn) {
    const code = document.getElementById('ciscoSnippet').innerText;
    navigator.clipboard.writeText(code).then(() => {
        const orig = btn.innerText;
        btn.innerText = '✅ Copied!';
        setTimeout(() => btn.innerText = orig, 2000);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initCidrDropdown();
    calculateSubnet();

    const ipInput = document.getElementById('ipInput');
    const cidrSelect = document.getElementById('cidrSelect');

    if (ipInput) ipInput.addEventListener('input', calculateSubnet);
    if (cidrSelect) cidrSelect.addEventListener('change', calculateSubnet);
});
