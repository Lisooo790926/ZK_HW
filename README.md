# ZK_HW 
### Homework Link
https://hackmd.io/@ChiHaoLu/ZKPlayground-HW0

### Implementation
0. Create Alchemy account to get testnet's provider Url\
   https://www.alchemy.com/
1. **HW_1**: Use web3 to send transaction to contract (SendTransaction.js)
    -> Binding private key into account 
    ```
        const account = web3.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
        web3.eth.accounts.wallet.add(account)
        web3.eth.defaultAddress = account.address
    ```
    -> Estimate the transaction gas
    ```
        web3.eth.estimateGas(tx)
    ```
    -> Create basic transaction 
    ```
        web3.eth.sendTransaction(tx, CONTRACT_ADDRESS
    ```
2. **HW_2**: MACI (Minimum Anti-collusion infrasturcutre) 
    ```
     TODO 
    ```
3. **HW_3**: ReturnFee.js, call claim abi to interact with contract\
    -> Prepare JSON RPC abi based on item's function\
    -> Create contract and use contract claim(1) method
    ```
        const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS)
        const claim = contract.methods.claim(1)
    ```
    -> Interact with contract and use method.estimateGas 
    ```
        const tx = {
            from: MY_ADDRESS,
            to: CONTRACT_ADDRESS, 
            gas: await claim.estimateGas({from: MY_ADDRESS}),
            data: claim.encodeABI()
        }
    ```
4. **HW_4**: MerkleProof.js
    - Understand the merkleProof method\
      It is the way to easily prove the exist item in the merkleTree structure and save gas (contract only save root) \
      *Example*: We should prepare **blue blocks** to proof your leaf is existing
      ![image](https://user-images.githubusercontent.com/48560984/185973935-1d18dc40-3569-499d-86dd-22f2e74fffdf.png)

    - Build the merkleProof keys array and there are two ways
      - **First** is library(markleTree.js)
         ```
            const merkleTree = new MerkleTree(hashes, keccak256, { sortPairs: true }); // because sorted required
            const merkleProofKeys = merkleTree.getHexProof(hashes[0])
            const merkleProof = contract.methods.merkleProof(merkleProofKeys)
         ```
      - **Second** is directly build it
         ```
           // get all hashes, then manually build the merkleTree and merkleProof keys
           const level1 = hashes[1]
           const level2 = hashWithSorted(hashes[2], hashes[3])
           const level3_1 = hashWithSorted(hashes[4], hashes[5])
           const level3 = hashWithSorted(hashes[6], level3_1)

           const levelHash = hashWithSorted(hashes[0], level1)
           const level2Hash =  hashWithSorted(levelHash, level2)
           const root = hashWithSorted(level2Hash, level3)
           console.log(root)

           // because sorted required (based on function `_hashPair`)
           function hashWithSorted(hash1, hash2) {
               if(hash1 > hash2) return web3.utils.soliditySha3(hash2, hash1);
               else return web3.utils.soliditySha3(hash1, hash2);
           }
        ```
    - Call merkleProof method to verify the keyword (the same as HW_3)
    
### Reference 
- MerkleProof : https://medium.com/crypto-0-nite/merkle-proofs-explained-6dd429623dc5
- MerkleProof2 : https://coinsbench.com/smart-contract-whitelist-mechanism-fbe3464159ed
- Web3.js doc: https://web3js.readthedocs.io/en/v1.2.11/web3-eth.html#
- MACI : https://hackmd.io/@OFccBlU5TNCiRhpIyT1m7g/SkXv-gO5r (TODO)
