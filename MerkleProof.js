const Web3 = require('Web3')
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
require('dotenv').config();

async function markleProof() {
    
    const { API_URL, PRIVATE_KEY, MY_ADDRESS, CONTRACT_ADDRESS } = process.env;
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

    const contract = await new web3.eth.Contract(abi, CONTRACT_ADDRESS)

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
    const level3_1 = hashWithSorted(hashes[5], hashes[4])
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



markleProof()