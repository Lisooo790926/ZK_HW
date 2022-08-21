const Web3 = require('Web3')
const keccak256 = require("keccak256");
const { MerkleTree } = require("merkletreejs");
require('dotenv').config();

async function markleProof() {
    
    const { API_URL, PRIVATE_KEY } = process.env;
    const web3 = new Web3(API_URL)
    const myAddress = '0x67E73B3d9883e647D4f67bCB535913951268DA46'
    const contractAddress = "0x847FB490b9255758738c1DBddD9E3049E9bC86c8"

    const abi = [
        {
            "inputs": [
                {
                    "internalType": "bytes32",
                    "name": "_root",
                    "type": "bytes32"
                }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
        },
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

    // const ary = ["zkpenguin","zkpancake","zkpolice","zkpig","zkplayground","zkpigeon","zkpoison"]

    const contract = await new web3.eth.Contract(abi, contractAddress)

    // check contract hash is the same as below soliditySha3 method
    // await contract.methods.hashes(i).call()
    // web3.utils.soliditySha3(ary[0])

    const ary = [4, 0, 1, 2, 3, 5, 6]

    let hashes = []
    for(let i=0;i<7;i++) {
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

    function hashWithSorted(hash1, hash2) {
        if(hash1 > hash2) return web3.utils.soliditySha3(hash2, hash1);
        else return web3.utils.soliditySha3(hash1, hash2);
    }

    // console.log(memoryAry)

    // // transaction definition
    // const tx = {
    //     from: myAddress,
    //     to: contractAddress, 
    //     gas: 1153200,
    //     data: contract.methods.merkleProof(result).encodeABI()
    // }

    // // create the signature 
    // const signature = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY)
    
    // // send the signed transaction
    // web3.eth.sendSignedTransaction(signature.rawTransaction).on(
    //     "receipt", (receipt) => {console.log(receipt)}
    // )


}



markleProof()