// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./BasicToken.sol";

contract BasicExchange {
    address public tokenAddress;

    constructor(address token_) {
        require(token_ != address(0), "Token address can't be null address");
        tokenAddress = token_;
    }

    // Allows the caller to add their tokens to the liquidity pool
    // note: In order for this to work, the caller (msg.sender) first
    // needs to provide an allowance for this exchange contract with
    // the token. Otherwise, this will fail. Is this because
    // msg.sender changes to the exchange's address with the call
    // to transferFrom on line 23?
    // TODO: Enforce price ratio of reserves. Currently, a user can add an 
    // arbitrarty amonut of liquidity and destabalize the price in the pool.
    function provideLiquidity(uint256 tokenAmount_) public payable {
        BasicToken token = BasicToken(tokenAddress);
        token.transferFrom(msg.sender, address(this), tokenAmount_);
    }

    // Checks the token's balance sheet to see how many tokens
    // this exchange's address holds
    function reserves() public view returns (uint256) {
        return BasicToken(tokenAddress).balanceOf(address(this));
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
        BasicToken(tokenAddress).transfer(msg.sender, tokenAmount);
    }

    function tokenToEthSwap(uint256 tokenAmount_, uint256 ethMinimum_) public {
        uint256 ethAmount = calculateEthAmount(tokenAmount_);
        require(ethAmount >= ethMinimum_, "Insufficient ether amount");
        BasicToken(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount_);
        payable(msg.sender).transfer(ethAmount);
    }
}