import 'regenerator-runtime/runtime'
import Wallet from '@project-serum/sol-wallet-adapter';
import {Connection, PublicKey, SystemProgram, Transaction} from '@solana/web3.js'


let connection = new Connection("http://localhost:8899");
let wallet = new Wallet('https://www.sollet.io');
wallet.on('connect', publicKey => console.log('Connected to ' + publicKey.toBase58()));
wallet.on('disconnect', () => console.log('Disconnected'));

export async function connectWallet() {
    await wallet.connect();
}

export async function sendTx() {
    const recipient = new PublicKey("G7kqxtbrw6KbpChGc1u853eAXG1JXHgKjuAe8fTGktEe");
    let transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: recipient,
            lamports: 500_000_000,
        })
    );
    let {blockhash} = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    let signed = await wallet.signTransaction(transaction);
    let txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
}

