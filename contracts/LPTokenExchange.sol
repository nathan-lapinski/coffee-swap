// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./Token.sol";

interface IFactory {
    function getExchange(address tokenAddress_) external returns (address);
}

contract CoffeeSwapExchange is ERC20 {
    address public tokenAddress;
    address public factoryAddress;

    constructor(address token_) ERC20("CoffeeSwap-V1", "COFFEE-V1") {
        require(token_ != address(0), "Token address can't be null address");
        tokenAddress = token_;
        factoryAddress = msg.sender;
    }

    // Allows the caller to add their tokens to the liquidity pool
    // note: In order for this to work, the caller (msg.sender) first
    // needs to provide an allowance for this exchange contract with
    // the token. Otherwise, this will fail. Is this because
    // msg.sender changes to the exchange's address with the call
    // to transferFrom on line 23?
    function provideLiquidity(uint256 tokenAmount_) public payable returns (uint256) {
        Token token = Token(tokenAddress);
        // The first time liquidity is provided, the price ratio will be
        // set for the first time.
        if (reserves() == 0) {
            token.transferFrom(msg.sender, address(this), tokenAmount_);
            // Need to set initial amount of liquidity tokens.
            // Uniswap did this based on the amount of ether initially supplied.
            uint256 liquidity = address(this).balance;
            _mint(msg.sender, liquidity);
            return liquidity;
        } else {
            uint256 etherReserves = address(this).balance - msg.value;
            uint256 tokenReserves = reserves();
            uint256 tokenAmountBasedOnReserveRatio = (msg.value * tokenReserves) / etherReserves;

            require(tokenAmount_ >= tokenAmountBasedOnReserveRatio, "The supplied number of tokens is insufficient");
            token.transferFrom(msg.sender, address(this), tokenAmountBasedOnReserveRatio);

            uint256 liquidity = (totalSupply() * msg.value) / etherReserves;
            _mint(msg.sender, liquidity);

            return liquidity;
        }
    }

    // TODO: In future, considering adding a deadline paramater. This was in Uniswap V1
    function removeLiquidity(uint256 amount_) public returns (uint256, uint256) {
        require(amount_ > 0, "Amounts must be greater than 0");
        uint256 totalLiquidity = totalSupply();
        require(totalLiquidity > 0, "There is no liquidity left in the pool");
        // These are liquidity tokens...or should this be the ERC20 token?
        uint256 tokenReserves = balanceOf(address(this));
        // eth is in wei
        uint256 ethAmount = (amount_ * address(this).balance) / totalLiquidity;
        uint256 tokenAmount = (amount_ * tokenReserves) / totalLiquidity;

        // burn the liquidity tokens
        _burn(msg.sender, amount_);

        // Now that the liquidity tokens have been burned, give msg sender their eth and tokens
        payable(address(msg.sender)).transfer(ethAmount);
        Token(tokenAddress).transfer(msg.sender, tokenAmount);

        // fire some logs/events about liquidity removal and transfer
        return (
            ethAmount,
            tokenAmount
        );
    }

    // Checks the token's balance sheet to see how many tokens
    // this exchange's address holds
    function reserves() public view returns (uint256) {
        return Token(tokenAddress).balanceOf(address(this));
    }

    // Returns the amount of eth held in this pool
    function etherReserves() public view returns (uint256) {
        return balanceOf(address(this));
    }

    // Constant Product Pricing method for swap
    // (x+Δx)(y−Δy)=xy
    // Δy= yΔx / x+Δx
    function calculateSwapAmount(uint256 inputAmount_, uint256 inputReserveLevel_, uint256 outputReserveLevel_) private pure returns (uint256) {
        require(inputReserveLevel_ > 0 && outputReserveLevel_ > 0, "insufficient reserve levels");
        return (inputAmount_ * outputReserveLevel_) / (inputAmount_ + inputReserveLevel_);
    }

    function calculateTokenAmount(uint256 ethAmount_) public view returns (uint256) {
        require(ethAmount_ > 0, "Amount of ether must be greater than 0");
        uint256 tokenReserves = reserves();
        return calculateSwapAmount(ethAmount_, address(this).balance, tokenReserves);
    }

    function calculateEthAmount(uint256 tokenAmount_) public view returns (uint256) {
        require(tokenAmount_ > 0, "Amount of tokens must be greater than 0");
        uint256 tokenReserves = reserves();
        return calculateSwapAmount(tokenAmount_, tokenReserves, address(this).balance);
    }

    function ethToTokenSwap(uint256 tokenMinimum_) public payable {
        uint256 tokenAmount = calculateTokenAmount(msg.value);
        require(tokenAmount >= tokenMinimum_, "Insufficient token amount");
        Token(tokenAddress).transfer(msg.sender, tokenAmount);
    }

    function tokenToEthSwap(uint256 tokenAmount_, uint256 ethMinimum_) public {
        uint256 ethAmount = calculateEthAmount(tokenAmount_);
        require(ethAmount >= ethMinimum_, "Insufficient ether amount");
        Token(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount_);
        payable(msg.sender).transfer(ethAmount);
    }

    function tokenToTokenSwap(uint256 tokenAmount_, uint256 minTokenAmount_, address targetToken_) public {
        require(IFactory(factoryAddress).getExchange(targetToken_) != address(0), "Target token does not exist");
    }
}