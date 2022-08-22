const Web3 = require('Web3')
require('dotenv').config();
const { API_URL, PRIVATE_KEY, MY_ADDRESS, CONTRACT_ADDRESS } = process.env;

async function sendTransaction() {

    const web3 = new Web3(API_URL)
    
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    web3.eth.accounts.wallet.add(account)
    web3.eth.defaultAddress = account.address

    var tx = {
        from: MY_ADDRESS,
        to: CONTRACT_ADDRESS, 
        gas: 0,
        value: Web3.utils.toWei('0.001', 'ether') 
    }

    // evaluate the estimate gas
    tx.gas = await web3.eth.estimateGas(tx)

    web3.eth.sendTransaction(tx, CONTRACT_ADDRESS, function(error, hash) {
        if (!error) {
            console.log(" The hash of your transaction is: ", hash);
        } else {
            console.log("RAISE THE ERROR", error)
        }
    });

}

sendTransaction()