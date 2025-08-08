import React, { useState, useEffect } from 'react'
import {
    Connection,
    PublicKey,
    StakeProgram,
    Authorized,
    Lockup,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    Keypair
} from '@solana/web3.js'

const StakingWidget = ({ validatorAddress = 'sdo2QoiSsPknraeCts5GeBkV3AYDdtuxJ3VpYCS1CxR' }) => {
    const [amount, setAmount] = useState('')
    const [isConnected, setIsConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [balance, setBalance] = useState(0)
    const [transactionSignature, setTransactionSignature] = useState('')
    const [stakeAccounts, setStakeAccounts] = useState([])
    const [selectedWallet, setSelectedWallet] = useState('')
    const [availableWallets, setAvailableWallets] = useState([])

    // Solana connection (mainnet-beta for production)
    const connection = new Connection('https://solana-rpc.publicnode.com', 'confirmed')

    // Wallet configurations
    const walletConfigs = {
        phantom: {
            name: 'Phantom',
            icon: '👻',
            getProvider: () => window?.solana?.isPhantom ? window.solana : null
        },
        solflare: {
            name: 'Solflare',
            icon: '🔥',
            getProvider: () => window?.solflare?.isSolflare ? window.solflare : null
        },
        backpack: {
            name: 'Backpack',
            icon: '🎒',
            getProvider: () => window?.backpack?.isBackpack ? window.backpack : null
        },
        slope: {
            name: 'Slope',
            icon: '⛷️',
            getProvider: () => window?.Slope ? window.Slope : null
        },
        sollet: {
            name: 'Sollet',
            icon: '💼',
            getProvider: () => window?.sollet ? window.sollet : null
        },
        mathWallet: {
            name: 'MathWallet',
            icon: '🧮',
            getProvider: () => window?.solana?.isMathWallet ? window.solana : null
        },
        coin98: {
            name: 'Coin98',
            icon: '🪙',
            getProvider: () => window?.coin98?.sol ? window.coin98.sol : null
        },
        clover: {
            name: 'Clover',
            icon: '🍀',
            getProvider: () => window?.clover_solana ? window.clover_solana : null
        }
    }

    // Check available wallets
    const checkAvailableWallets = () => {
        const available = Object.entries(walletConfigs)
            .filter(([key, config]) => config.getProvider() !== null)
            .map(([key, config]) => ({ key, ...config }))

        setAvailableWallets(available)

        // Auto-select first available wallet if none selected
        if (available.length > 0 && !selectedWallet) {
            setSelectedWallet(available[0].key)
        }
    }

    // Get current wallet provider
    const getProvider = () => {
        if (!selectedWallet || !walletConfigs[selectedWallet]) {
            return null
        }
        return walletConfigs[selectedWallet].getProvider()
    }

    // Connect to selected wallet
    const connectWallet = async () => {
        const provider = getProvider()
        if (!provider) {
            const walletName = walletConfigs[selectedWallet]?.name || 'Selected wallet'
            alert(`${walletName} not found! Please install ${walletName}.`)
            return
        }

        try {
            setIsLoading(true)

            let response
            // Handle different wallet connection methods
            if (selectedWallet === 'slope') {
                response = await provider.connect()
            } else if (selectedWallet === 'coin98') {
                response = await provider.connect()
            } else if (selectedWallet === 'clover') {
                response = await provider.connect()
            } else {
                // Standard connection for most wallets
                response = await provider.connect()
            }

            const publicKey = response.publicKey.toString()
            setWalletAddress(publicKey)
            setIsConnected(true)

            // Get wallet balance
            const balanceInLamports = await connection.getBalance(response.publicKey)
            setBalance(balanceInLamports / LAMPORTS_PER_SOL)

            // Get stake accounts
            await getStakeAccounts(response.publicKey)
        } catch (error) {
            console.error('Error connecting to wallet:', error)
            alert('Failed to connect wallet: ' + (error.message || 'Unknown error'))
        } finally {
            setIsLoading(false)
        }
    }

    // Disconnect wallet
    const disconnectWallet = async () => {
        const provider = getProvider()
        if (provider) {
            try {
                // Handle different wallet disconnection methods
                if (selectedWallet === 'slope') {
                    await provider.disconnect()
                } else if (provider.disconnect) {
                    await provider.disconnect()
                }

                setIsConnected(false)
                setWalletAddress('')
                setBalance(0)
                setStakeAccounts([])
                setTransactionSignature('')
            } catch (error) {
                console.error('Error disconnecting wallet:', error)
                // Force disconnect even if there's an error
                setIsConnected(false)
                setWalletAddress('')
                setBalance(0)
                setStakeAccounts([])
                setTransactionSignature('')
            }
        }
    }

    // Get user's stake accounts
    const getStakeAccounts = async (walletPubkey) => {
        try {
            const accounts = await connection.getParsedProgramAccounts(
                StakeProgram.programId,
                {
                    filters: [
                        {
                            memcmp: {
                                offset: 12, // Authorized staker offset
                                bytes: walletPubkey.toBase58(),
                            },
                        },
                    ],
                }
            )

            const stakes = accounts.map(account => ({
                pubkey: account.pubkey.toString(),
                lamports: account.account.lamports,
                state: account.account.data.parsed.info.stake?.delegation?.state || 'inactive'
            }))

            setStakeAccounts(stakes)
        } catch (error) {
            console.error('Error fetching stake accounts:', error)
        }
    }

    // Handle staking - Production Implementation
    const handleStake = async () => {
        if (!amount || !isConnected) {
            alert('Please connect wallet and enter amount')
            return
        }

        const stakeAmount = parseFloat(amount)
        if (stakeAmount < 0.1) {
            alert('Minimum stake amount is 0.1 SOL')
            return
        }

        if (stakeAmount > balance) {
            alert('Insufficient balance')
            return
        }

        const provider = getProvider()
        if (!provider) {
            alert('Wallet not connected')
            return
        }

        try {
            setIsLoading(true)
            setTransactionSignature('')

            // Convert SOL to lamports
            const lamports = Math.floor(stakeAmount * LAMPORTS_PER_SOL)

            // Create keypairs
            const fromPubkey = provider.publicKey
            const validatorPubkey = new PublicKey(validatorAddress)
            const stakeAccount = Keypair.generate()

            // Calculate rent exemption for stake account
            const rentExemption = await connection.getMinimumBalanceForRentExemption(
                StakeProgram.space
            )

            // Total amount needed (stake + rent exemption)
            const totalLamports = lamports + rentExemption

            if (totalLamports > balance * LAMPORTS_PER_SOL) {
                alert(`Insufficient balance. Need ${(totalLamports / LAMPORTS_PER_SOL).toFixed(4)} SOL (including rent exemption)`)
                return
            }

            // Create transaction
            const transaction = new Transaction()

            // 1. Create stake account
            const createStakeAccountInstruction = StakeProgram.createAccount({
                fromPubkey: fromPubkey,
                stakePubkey: stakeAccount.publicKey,
                authorized: new Authorized(fromPubkey, fromPubkey),
                lockup: new Lockup(0, 0, fromPubkey),
                lamports: totalLamports
            })

            // 2. Delegate stake to validator
            const delegateInstruction = StakeProgram.delegate({
                stakePubkey: stakeAccount.publicKey,
                authorizedPubkey: fromPubkey,
                votePubkey: validatorPubkey
            })

            transaction.add(createStakeAccountInstruction)
            transaction.add(delegateInstruction)

            // Get recent blockhash
            const { blockhash } = await connection.getLatestBlockhash()
            transaction.recentBlockhash = blockhash
            transaction.feePayer = fromPubkey

            // Partially sign with stake account
            transaction.partialSign(stakeAccount)

            // Sign and send transaction
            const signedTransaction = await provider.signTransaction(transaction)
            const signature = await connection.sendRawTransaction(signedTransaction.serialize())

            // Confirm transaction
            const confirmation = await connection.confirmTransaction(signature, 'confirmed')

            if (confirmation.value.err) {
                throw new Error('Transaction failed: ' + confirmation.value.err)
            }

            setTransactionSignature(signature)
            alert(`Successfully staked ${stakeAmount} SOL!\n\nTransaction: ${signature}\n\nStake Account: ${stakeAccount.publicKey.toString()}`)

            // Refresh balance
            const newBalance = await connection.getBalance(fromPubkey)
            setBalance(newBalance / LAMPORTS_PER_SOL)
            setAmount('')

        } catch (error) {
            console.error('Error staking:', error)
            alert('Staking failed: ' + (error.message || 'Unknown error'))
        } finally {
            setIsLoading(false)
        }
    }

    // Handle unstaking
    const handleUnstake = async (stakeAccountAddress) => {
        const provider = getProvider()
        if (!provider || !isConnected) {
            alert('Wallet not connected')
            return
        }

        try {
            setIsLoading(true)

            const stakeAccountPubkey = new PublicKey(stakeAccountAddress)
            const fromPubkey = provider.publicKey

            // Create transaction to deactivate stake
            const transaction = new Transaction()

            const deactivateInstruction = StakeProgram.deactivate({
                stakePubkey: stakeAccountPubkey,
                authorizedPubkey: fromPubkey
            })

            transaction.add(deactivateInstruction)

            // Get recent blockhash
            const { blockhash } = await connection.getLatestBlockhash()
            transaction.recentBlockhash = blockhash
            transaction.feePayer = fromPubkey

            // Sign and send transaction
            const signedTransaction = await provider.signTransaction(transaction)
            const signature = await connection.sendRawTransaction(signedTransaction.serialize())

            // Confirm transaction
            const confirmation = await connection.confirmTransaction(signature, 'confirmed')

            if (confirmation.value.err) {
                throw new Error('Transaction failed: ' + confirmation.value.err)
            }

            alert(`Stake deactivation initiated!\n\nTransaction: ${signature}\n\nNote: It takes ~2-4 epochs for stake to become inactive and withdrawable.`)

        } catch (error) {
            console.error('Error unstaking:', error)
            alert('Unstaking failed: ' + (error.message || 'Unknown error'))
        } finally {
            setIsLoading(false)
        }
    }

    // Check for available wallets and setup listeners
    useEffect(() => {
        // Check available wallets on mount
        checkAvailableWallets()

        // Recheck wallets periodically (in case they're loaded after component mount)
        const interval = setInterval(checkAvailableWallets, 1000)

        // Clear interval after 10 seconds
        setTimeout(() => clearInterval(interval), 10000)

        return () => clearInterval(interval)
    }, [])

    // Setup wallet event listeners when wallet is selected
    useEffect(() => {
        if (!selectedWallet) return

        const provider = getProvider()
        if (provider) {
            const handleConnect = async () => {
                setIsConnected(true)
                const publicKey = provider.publicKey?.toString() || ''
                setWalletAddress(publicKey)

                // Get balance when connecting
                if (provider.publicKey) {
                    try {
                        const balanceInLamports = await connection.getBalance(provider.publicKey)
                        setBalance(balanceInLamports / LAMPORTS_PER_SOL)
                        await getStakeAccounts(provider.publicKey)
                    } catch (error) {
                        console.error('Error fetching balance:', error)
                    }
                }
            }

            const handleDisconnect = () => {
                setIsConnected(false)
                setWalletAddress('')
                setBalance(0)
                setTransactionSignature('')
                setStakeAccounts([])
            }

            // Setup event listeners based on wallet type
            if (provider.on) {
                provider.on('connect', handleConnect)
                provider.on('disconnect', handleDisconnect)
            }

            // Check if already connected
            if (provider.isConnected || provider.connected) {
                handleConnect()
            }

            return () => {
                if (provider.removeAllListeners) {
                    provider.removeAllListeners()
                } else if (provider.off) {
                    provider.off('connect', handleConnect)
                    provider.off('disconnect', handleDisconnect)
                }
            }
        }
    }, [selectedWallet])

    return (
        <div className="staking-container">
            <div className="staking-widget">
                <div className="staking-card">
                    <h3>Stake SOL with SkipLine</h3>
                    <p className="validator-info">
                        Validator: <code>{validatorAddress}</code>
                    </p>

                    {!isConnected ? (
                        <div className="wallet-connection">
                            <p>Select and connect your Solana wallet to start staking</p>

                            {availableWallets.length === 0 ? (
                                <div className="no-wallets">
                                    <p>No Solana wallets detected. Please install one of the following:</p>
                                    <ul className="wallet-install-list">
                                        <li>Phantom - <a href="https://phantom.app/" target="_blank" rel="noopener noreferrer">phantom.app</a></li>
                                        <li>Solflare - <a href="https://solflare.com/" target="_blank" rel="noopener noreferrer">solflare.com</a></li>
                                        <li>Backpack - <a href="https://backpack.app/" target="_blank" rel="noopener noreferrer">backpack.app</a></li>
                                    </ul>
                                </div>
                            ) : (
                                <>
                                    <div className="wallet-selector">
                                        <label htmlFor="wallet-select">Choose your wallet:</label>
                                        <select
                                            id="wallet-select"
                                            value={selectedWallet}
                                            onChange={(e) => setSelectedWallet(e.target.value)}
                                            className="wallet-select"
                                        >
                                            {availableWallets.map((wallet) => (
                                                <option key={wallet.key} value={wallet.key}>
                                                    {wallet.icon} {wallet.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <button
                                        onClick={connectWallet}
                                        disabled={isLoading || !selectedWallet}
                                        className="connect-btn"
                                    >
                                        {isLoading ? 'Connecting...' : `Connect ${walletConfigs[selectedWallet]?.name || 'Wallet'}`}
                                    </button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="staking-form">
                            <div className="wallet-info">
                                <div>
                                    <p>Connected via: <strong>{walletConfigs[selectedWallet]?.icon} {walletConfigs[selectedWallet]?.name}</strong></p>
                                    <p>Address: <code>{walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}</code></p>
                                    <p>Balance: <strong>{balance.toFixed(4)} SOL</strong></p>
                                </div>
                                <button onClick={disconnectWallet} className="disconnect-btn">
                                    Disconnect
                                </button>
                            </div>

                            <div className="amount-input">
                                <label htmlFor="stake-amount">Amount to stake (SOL):</label>
                                <input
                                    id="stake-amount"
                                    type="number"
                                    step="0.1"
                                    min="0"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="Enter SOL amount"
                                    className="stake-input"
                                />
                            </div>

                            <button
                                onClick={handleStake}
                                disabled={isLoading || !amount}
                                className="stake-btn"
                            >
                                {isLoading ? 'Processing Transaction...' : `Stake ${amount || '0'} SOL`}
                            </button>

                            {transactionSignature && (
                                <div className="transaction-result">
                                    <p><strong>✅ Transaction Successful!</strong></p>
                                    <p>
                                        <a
                                            href={`https://explorer.solana.com/tx/${transactionSignature}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="transaction-link"
                                        >
                                            View on Solana Explorer
                                        </a>
                                    </p>
                                </div>
                            )}

                            <div className="existing-stakes">
                                <h4>Your Existing Stake Accounts</h4>
                                {stakeAccounts.length === 0 ? (
                                    <p>No active stake accounts found. Create your first stake to get started!</p>
                                ) : (
                                    <ul className="stake-accounts-list">
                                        {stakeAccounts.map((stake) => (
                                            <li key={stake.pubkey} className="stake-account">
                                                <div className="stake-details">
                                                    <strong>Account:</strong> <code>{stake.pubkey.slice(0, 8)}...{stake.pubkey.slice(-8)}</code><br />
                                                    <strong>Amount:</strong> {((stake.lamports / LAMPORTS_PER_SOL)).toFixed(4)} SOL<br />
                                                    <strong>Status:</strong> <span className={`status-${stake.state}`}>{stake.state}</span>
                                                </div>
                                                <div className="stake-actions">
                                                    {stake.state === 'active' ? (
                                                        <button
                                                            onClick={() => handleUnstake(stake.pubkey)}
                                                            className="unstake-btn"
                                                            disabled={isLoading}
                                                        >
                                                            {isLoading ? 'Processing...' : 'Deactivate'}
                                                        </button>
                                                    ) : stake.state === 'inactive' ? (
                                                        <button
                                                            onClick={() => alert('Withdrawing inactive stakes coming soon!')}
                                                            className="withdraw-btn"
                                                            disabled={isLoading}
                                                        >
                                                            Withdraw
                                                        </button>
                                                    ) : (
                                                        <span className="status-info">Activating...</span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div className="staking-info">
                                <p><small>
                                    • Minimum stake: 0.1 SOL<br />
                                    • Rent exemption: ~0.00228 SOL (refundable)<br />
                                    • Staking rewards are distributed automatically<br />
                                    • Unstaking has a 2-4 epoch cooldown period<br />
                                    • This is on Solana mainnet-beta
                                </small></p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default StakingWidget
