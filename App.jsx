import React from 'react'
import StakingWidget from './components/StakingWidget'
import './components/StakingWidget.css'
import './style.css'

function App() {
    return (
        <>
            <header className="sl-header">
                <div className="sl-navbar">
                    <div className="sl-logo">

                        <span className="sl-title">SkipLine</span>
                    </div>
                    <nav className="sl-nav">
                        <a href="#staking" className="sl-nav-link">Stake</a>
                        <a href="#networks" className="sl-nav-link">Projects</a>
                        <a href="#projects" className="sl-nav-link">Networks</a>
                        <a href="#about" className="sl-nav-link">About</a>
                    </nav>
                </div>
            </header>

            <main className="sl-main">
                <section className="sl-hero" id="staking">
                    <div className="sl-hero-content">
                        <div className="sl-hero-text">
                            <h1 className="sl-hero-title">We Power The Chains</h1>
                            <p className="sl-hero-desc">
                                Secure, non-custodial staking. Delegate your assets to our high-performance validators and earn rewards while supporting network security.
                            </p>
                            <p className="sl-hero-features">
                                <span>🔒 Non-custodial & secure</span>
                                <span>⚡ High uptime & performance</span>
                                <span>💸 Transparent rewards</span>
                                <span>🛡️ Trusted by the Community</span>
                            </p>
                        </div>

                    </div>
                    <section className="sl-section" id="networks">
                        <h3 className="sl-section-networks-title">Networks</h3>
                        <div className="sl-networks-list">
                            <div className="sl-network-card">

                                <span className="sl-network-name">Solana</span>
                                <span className="sl-network-status sl-status-mainnet">Mainnet</span>
                            </div>
                            <div className="sl-network-card">

                                <span className="sl-network-name">Ethereum</span>
                                <span className="sl-network-status sl-status-testnet">Testnet</span>
                            </div>
                        </div>
                    </section>
                </section>

                <section className="sl-section" id="projects">
                    <h2 className="sl-section-title">Our Projects</h2>
                    <div className="sl-projects-list">
                        <div className="sl-project-card">
                            <a href="https://github.com/skip-line/sdo" target="_blank" rel="noopener noreferrer" className="sl-project-link">
                                <span className="sl-project-title">SDO</span>
                                <span className="sl-project-desc" style={{ "marginLeft": "8px" }}>Solana validator operator toolkit</span>
                            </a>
                            <p>
                                SDO is a comprehensive toolkit designed for Solana validator operators, providing essential tools and resources to deploy new, upgrade existing, and manage their validator infrastructure effectively.
                            </p>
                        </div>
                    </div>
                </section>


                <section className="sl-section" id="about">
                    <h2 className="sl-section-title">About SkipLine</h2>
                    <div className="sl-about-content">
                        <p>
                            SkipLine is a crypto-native node operator and builder, empowering the next generation of blockchains and decentralized networks from their inception. We dedicate our intellectual, social, and computational capital to catalyzing cryptoeconomic networks of the future.
                        </p>
                        <div className='flex' style={{ "marginTop": "16px" }}>
                            <a href="mailto:admin@skipline.xyz" className="sl-contact-link">Email</a>
                            <a href="https://t.me/cloudusk_admin" className="sl-contact-link">Telegram</a>
                            <a href="https://twitter.com/engineered_head" className="sl-contact-link">Twitter</a>
                            <a href="https://github.com/skip-line" className="sl-contact-link">Github</a>
                        </div>
                    </div>
                </section>


                <section >
                    <StakingWidget validatorAddress="sdo2QoiSsPknraeCts5GeBkV3AYDdtuxJ3VpYCS1CxR" />
                </section>

            </main>
        </>
    )
}

export default App
