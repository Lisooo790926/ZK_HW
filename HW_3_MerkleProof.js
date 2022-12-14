const Web3 = require('Web3')
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");

require('dotenv').config();
const { API_URL, PRIVATE_KEY, MY_ADDRESS, CONTRACT_ADDRESS } = process.env;

async function merkleProof() {
    
    const web3 = new Web3(API_URL)
    const abi = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "hashes",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32[]",
                    "name": "proof",
                    "type": "bytes32[]"
                }
            ],
            "name": "merkleProof",
            "outputs": [],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)

    const ary = [4, 0, 1, 2, 3, 5, 6] // give the order for this (based on item's hashed order)

    let hashes = []
    for(let i=0;i<7;i++) {
        // query this hashes
        hashes[i] = await contract.methods.hashes(ary[i]).call() 
    }

    // use markleTree method
    // const merkleTree = new MerkleTree(hashes, keccak256, { sortPairs: true });
    // const rootHash = merkleTree.getHexRoot();
    // console.log(rootHash)

    // const result = merkleTree.getHexProof(hashes[0])
    // console.log(result)

    // use self build method
    const level1 = hashes[1]
    const level2 = hashWithSorted(hashes[2], hashes[3])
    const level3_1 = hashWithSorted(hashes[4], hashes[5])
    const level3 = hashWithSorted(hashes[6], level3_1)

    const levelHash = hashWithSorted(hashes[0], level1)
    const level2Hash =  hashWithSorted(levelHash, level2)
    const root = hashWithSorted(level2Hash, level3)
    console.log(root)

    // because sorted required
    function hashWithSorted(hash1, hash2) {
        if(hash1 > hash2) return web3.utils.soliditySha3(hash2, hash1);
        else return web3.utils.soliditySha3(hash1, hash2);
    }

    // transaction definition
    const tx = {
        from: MY_ADDRESS,
        to: CONTRACT_ADDRESS, 
        gas: 1153200, // self defined gas
        data: contract.methods.merkleProof(result).encodeABI()
    }

    // create the signature 
    const signature = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    
    // send the signed transaction
    web3.eth.sendSignedTransaction(signature.rawTransaction).on(
        "receipt", (receipt) => {console.log(receipt)}
    )

}


// simple version 
async function merkleProof_simple() {

    const web3 = new Web3(API_URL)

    // directly bind private key with account
    const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
    web3.eth.accounts.wallet.add(account)
    web3.eth.defaultAddress = account.address

    
    const abi = [
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "name": "hashes",
            "outputs": [
                {
                    "internalType": "bytes32",
                    "name": "",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "bytes32[]",
                    "name": "proof",
                    "type": "bytes32[]"
                }
            ],
            "name": "merkleProof",
            "outputs": [],
            "stateMutability": "view",
            "type": "function"
        }
    ]

    const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)

    // fetch all hashes
    const ary = [4, 0, 1, 2, 3, 5, 6] // give the order for this (based on item's hashed order)
    let hashes = []
    for(let i=0;i<7;i++) {
        hashes[i] = await contract.methods.hashes(ary[i]).call() 
    }
    // use markleTree method
    const merkleTree = new MerkleTree(hashes, keccak256, { sortPairs: true });
    const merkleProofKeys = merkleTree.getHexProof(hashes[0])
    const merkleProof = contract.methods.merkleProof(merkleProofKeys)

    const tx = {
        from: MY_ADDRESS,
        to: CONTRACT_ADDRESS, 
        gas: await merkleProof.estimateGas({from: MY_ADDRESS}),
        data: merkleProof.encodeABI()
    }

    web3.eth.sendTransaction(tx, CONTRACT_ADDRESS, function(error, hash) {
        if (!error) {
            console.log(" The hash of your transaction is: ", hash);
        } else {
            console.log("RAISE THE ERROR", error)
        }
    });

}


// merkleProof()
merkleProof_simple()