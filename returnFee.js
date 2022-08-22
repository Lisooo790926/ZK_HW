const Web3 = require('Web3')
require('dotenv').config();

async function returnFee() {
    
    const { API_URL, PRIVATE_KEY, MY_ADDRESS, CONTRACT_ADDRESS } = process.env;
    const web3 = new Web3(API_URL)
    
    // test to get balance
    // web3.eth.getBalance(MY_ADDRESS,
    //      (call, wei) => { console.log(web3.utils.fromWei(wei, 'ether'))})

 
    let abi = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_amountInFinney",
                    "type": "uint256"
                }
            ],
            "name": "claim",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
    ]
    
    // create the new contract related to abi
    const contract = await new web3.eth.Contract(abi, CONTRACT_ADDRESS)
    // transaction definition
    const tx = {
        from: MY_ADDRESS,
        to: CONTRACT_ADDRESS, 
        gas: 1153200,
        data: contract.encodeABI()
    }

    // create the signature 
    const signature = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    
    // send the signed transaction
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt", (receipt) => {console.log(receipt)}
    )
}

returnFee()
