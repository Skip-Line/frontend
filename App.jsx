import React from 'react'
import StakingWidget from './components/StakingWidget'
import './components/StakingWidget.css'

function App() {
    return (
        <>
            <header>
            </header>

            <main>
                <section className="hero">
                    <pre className="ascii-art">
                        {`      _______. __  ___  __  .______    __       __  .__   __.  _______ 
    /       ||  |/  / |  | |   _  \\  |  |     |  | |  \\ |  | |   ____|
   |   (----\`|  '  /  |  | |  |_)  | |  |     |  | |   \\|  | |  |__   
    \\   \\    |        |  | |   ___/  |  |     |  | |  . \`  | |   __|  
.----    |   |  .  \\  |  | |  |      |  \`----.|  | |  |\\   | |  |____ 
|_______/    |__|\\__\\ |__| | _|      |_______||__| |__| \\__| |_______|
                                                                                            
                       `}
                    </pre>

                    <p className="mission-statement">
                        We dedicate our intellectual, social, and computational capital to catalyzing the cryptoeconomic
                        networks of the future.
                    </p>

                    <StakingWidget validatorAddress="sdo2QoiSsPknraeCts5GeBkV3AYDdtuxJ3VpYCS1CxR" />
                </section>

                <section className="networks">
                    <h2>Networks</h2>

                    <p className="networks-intro">
                        we operate validators with strong delegation across the following networks:
                    </p>

                    <ul className="network-list">
                        <li>
                            <a href="#" className="network-link">Ethereum</a> (testnet, mainnet)
                        </li>
                        <li>
                            <a href="https://www.validators.app/validators/32nTAQSAxzSbvURguFvfz5FX1g4enbvgyttMYHr1KJqM?locale=en&network=testnet"
                                className="network-link">Solana</a> (testnet, mainnet soon)
                        </li>
                    </ul>
                </section>

                <section className="networks">
                    <h2>Projects</h2>

                    <p className="networks-intro">
                        We also BUIDL and contribute to projects that enhance the cryptoeconomic ecosystem.
                        Below are some of the projects we are currently involved in:
                        <br />
                    </p>

                    <ul className="network-list">
                        <li>
                            <a href="https://github.com/skip-line/sdo" className="network-link">SDO</a> (A tool to help operators of
                            Solana validators, build and deploy)
                        </li>
                    </ul>
                </section>

                <section className="networks">
                    <h2>About</h2>
                    <p className="networks-intro">
                        As crypto-native node operators and builders, we're on a mission to empower the next generation of
                        blockchains and decentralized networks from their very inception.
                    </p>
                </section>
                <hr />
                Please, contact us at <a href="mailto:admin@skipline.xyz">admin@skipline.xyz</a>
            </main>
        </>
    )
}

export default App
