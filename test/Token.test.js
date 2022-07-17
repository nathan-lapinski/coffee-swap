const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ERC-20 Token contract", () => {
    let owner;
    let token;
    const TOKEN_NAME = "Test Coffee Token";
    const TOKEN_SYMBOL = "TCT";
    const TOKEN_INITIAL_SUPPLY = 8675309;

    before(async () => {
        // signers is an abstraction of an Ethereum account, used for signing
        // messages and transactions. Basically a mock EOA.
         [owner] = await ethers.getSigners();
         const Token = await ethers.getContractFactory("Token");
         token = await Token.deploy(TOKEN_NAME, TOKEN_SYMBOL, TOKEN_INITIAL_SUPPLY);
         await token.deployed();
    });

    it("Sets token name and symbol and initial supply", async () => {
        expect(await token.name()).to.equal(TOKEN_NAME);
        expect(await token.symbol()).to.equal(TOKEN_SYMBOL);
        expect(await token.totalSupply()).to.equal(TOKEN_INITIAL_SUPPLY);
    });

    it("Sens all initial tokens to contract creator", async () => {
        expect(await token.balanceOf(owner.address)).to.equal(TOKEN_INITIAL_SUPPLY);
    });
});