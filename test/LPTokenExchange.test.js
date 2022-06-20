const { expect } = require("chai");

const toWei = (value) => ethers.utils.parseEther(value.toString());

const getBalance = ethers.provider.getBalance;


describe("LP Token Exchange", function () {
    let owner;
    let user;
    let token;
    let exchange;
    
    beforeEach(async () => {
        [owner, user] = await ethers.getSigners();

        const Token = await ethers.getContractFactory("Token");
        token = await Token.deploy("Token", "TKN", toWei(1000000));

        const ownerBalance = await token.balanceOf(owner.address);
        expect(await token.totalSupply()).to.equal(ownerBalance);

        const Exchange = await ethers.getContractFactory("CoffeeSwapExchange");
        exchange = await Exchange.deploy(token.address);
    });

    describe("provideLiquidity", () => {
        it("should mint liquidity tokens equal to initial ether deposit the first time liquidity is provided", async () => {
            await token.approve(exchange.address, toWei(200));
            await exchange.provideLiquidity(toWei(200), { value: toWei(100)});
    
            expect(await getBalance(exchange.address)).to.equal(toWei(100));
            expect(await exchange.reserves()).to.equal(toWei(200));
            
            // Provider of liquidity should have recieved 100 liquidity tokens
            expect(await exchange.balanceOf(owner.address)).to.equal(toWei(100));
        });

        it("should mint liquidity tokens equal to reserve ratios after initial liquidity is provided", async () => {
            await token.approve(exchange.address, toWei(200));
            await exchange.provideLiquidity(toWei(200), { value: toWei(100)});
    
            expect(await getBalance(exchange.address)).to.equal(toWei(100));
            expect(await exchange.reserves()).to.equal(toWei(200));
            
            // Provider of liquidity should have recieved 100 liquidity tokens
            expect(await exchange.balanceOf(owner.address)).to.equal(toWei(100));

            await exchange.provideLiquidity(toWei(200), { value: toWei(100)});
        });
    });
});