const Web3 = require('Web3')
require('dotenv').config();
const { API_URL, PRIVATE_KEY, MY_ADDRESS, CONTRACT_ADDRESS } = process.env;

async function returnFee() {

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

async function returnFee_simple() {

    const web3 = new Web3(API_URL)
    
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    web3.eth.accounts.wallet.add(account)
    web3.eth.defaultAddress = account.address

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

    const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)
    const claim = contract.methods.claim(1)

    const tx = {
        from: MY_ADDRESS,
        to: CONTRACT_ADDRESS, 
        gas: await claim.estimateGas({from: MY_ADDRESS}),
        data: claim.encodeABI()
    }

    web3.eth.sendTransaction(tx, function(error, hash) {
        if (!error) {
            console.log(" The hash of your transaction is: ", hash);
        } else {
            console.log("RAISE THE ERROR", error)
        }
    });

}

// returnFee()
returnFee_simple()
