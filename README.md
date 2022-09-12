# Overview
CoffeeSwap is a simple Decentralized Exchange (DEX) based on [Uniswap V1](https://docs.uniswap.org/protocol/V1/introduction). It's used for exchanging ERC20 tokens on the Ethereum Blockchain.

Currently, this project is intended only for educational purposes. The front end is currently unstable pending some updates.

The smart contracts are as follows:

Token.sol: This is just a standard ERC20 token based off of OpenZepplin's implementation
LPTokenExchange.sol: This sets up a liquidity pool between an ERC20 token and eth. It uses a constand product AMM for maintaining liquidity. Liquidity tokens are issued to providers of liquidity, which can later be burned in exchange for ERC20/eth tokens
Factory.sol: This is used for creating liquidity pools for ERC20/eth pairs.

# Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, a sample script that deploys that contract, and an example of a task implementation, which simply lists the available accounts.

Try running some of the following tasks:

```shell
npx hardhat compile
```
