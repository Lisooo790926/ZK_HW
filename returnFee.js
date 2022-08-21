const Web3 = require('Web3')
require('dotenv').config();

async function returnFee() {
    
    const { API_URL, PRIVATE_KEY } = process.env;
    const web3 = new Web3(API_URL)
    const myAddress = '0x67E73B3d9883e647D4f67bCB535913951268DA46'
    const contractAddress = "0x847FB490b9255758738c1DBddD9E3049E9bC86c8"
    web3.eth.getBalance(myAddress,
         (call, wei) => { console.log(web3.utils.fromWei(wei, 'ether'))})

 
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
    const contract = await new web3.eth.Contract(abi, contractAddress)
    // transaction definition
    const tx = {
        from: myAddress,
        to: contractAddress, 
        gas: 1153200,
        data: contract.methods.claim(1).encodeABI()
    }

    // create the signature 
    const signature = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    
    // send the signed transaction
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt", (receipt) => {console.log(receipt)}
    )
}

returnFee()
