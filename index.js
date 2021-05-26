import 'regenerator-runtime/runtime'
import Wallet from '@project-serum/sol-wallet-adapter';
import {clusterApiUrl, Connection, SystemProgram, Transaction} from '@solana/web3.js'

async function index() {
    let connection = new Connection(clusterApiUrl('testnet'));
    let providerUrl = 'https://www.sollet.io';
    let wallet = new Wallet(providerUrl);
    wallet.on('connect', publicKey => console.log('Connected to ' + publicKey.toBase58()));
    wallet.on('disconnect', () => console.log('Disconnected'));
    await wallet.connect();

    let transaction = new Transaction().add(
        SystemProgram.transfer({
            fromPubkey: wallet.publicKey,
            toPubkey: wallet.publicKey,
            lamports: 100,
        })
    );
    let {blockhash} = await connection.getRecentBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = wallet.publicKey;
    let signed = await wallet.signTransaction(transaction);
    let txid = await connection.sendRawTransaction(signed.serialize());
    await connection.confirmTransaction(txid);
}

export function z1() {
    console.log("z1")
}


index().catch(err => console.error(err))