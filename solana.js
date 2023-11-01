const fs = require('fs');
const https = require('https');

// Read the wallet addresses from the file
fs.readFile('wallet.txt', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading the file:', err);
        return;
    }

    const addresses = data.split('\n');

    // Function to fetch address details with a delay
    function fetchAddressWithDelay(index) {
        if (index < addresses.length) {
            const address = addresses[index].trim();
            fetchAddressDetails(address);
            
            // Add a 2-second delay before fetching the next address
            setTimeout(() => {
                fetchAddressWithDelay(index + 1);
            }, 3000); // 5000 milliseconds = 2 seconds
        }
    }

    // Start fetching addresses with a delay
    fetchAddressWithDelay(0);
});

function fetchAddressDetails(address) {
    const url = `https://airdrop.pyth.network/api/grant/v1/solana_breakdown?identity=${address}`;

    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            console.log(`Data for ${address}:`, JSON.parse(data));
        });

    }).on('error', (err) => {
        console.error(`Error fetching data for ${address}:`, err);
    });
}
