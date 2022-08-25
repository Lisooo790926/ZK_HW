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
2. **HW_2**: MACI (Minimum Anti-collusion infrasturcutre, My understanding)\
    - Background:\
      MACI make collusion among participants difficult. Although MACI can provide collusion resistance only if the coordinator is honest, a dishonest coordinator neither censor nor tamper with its execution.
    - Role
      - Coordinator: who holds the participants public keys 
      - Participants: who are in whitelist of the contract and when he/she want to vote, the vote is encrypted by their own private key and Coordinator's public key
    - SignUp(Add into whitelist):\
      Put participants into whiltelist. This behavior is quite similar as merkleproof. Once someone signup, he/she will provider key to signup. After checking, whitelist will build the leaf and change the root. 
    - Vote(Send ecrypted message):\
      Participants encrypt their message by three things
         - private key (which public key has been signed on)
         - random key 
         - coordinator public key
      So it could replace the pair based on changing keypair in signup ???
    - Result \
       According to this way, there is no way to bribe the every participant. Because participants could change keypair to coordinator in contract
      ![image](https://user-images.githubusercontent.com/48560984/186554775-5f17f972-ad31-4a66-b547-595613ab66a5.png)
    - TODO
      - What is EdDSA? 
      - About coordinator processing still confusing.
      
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
