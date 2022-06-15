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
    function provideLiquidity(uint256 tokenAmount_) public payable {
        BasicToken token = BasicToken(tokenAddress);
        token.transferFrom(msg.sender, address(this), tokenAmount_);
    }

    // Checks the token's balance sheet to see how many tokens
    // this exchange's address holds
    function reserves() public view returns (uint256) {
        return BasicToken(tokenAddress).balanceOf(address(this));
    }

    // Currently, these swap functions are naive, and allow
    // the liquidity pool to be completely drained.
    // TODO: Update this exchange to use a constant product market model
    // to provide asynmptotically infinite liquidity
    function ethToTokenSwap(uint256 tokenMinimum_) public payable {
        // for now, just swap ETH and token at 1-1
        // TODO: This needs to change immediately.
        uint256 reserveAmount = reserves();
        require(reserveAmount >= tokenMinimum_, "Not enough tokens in reserve");
        BasicToken(tokenAddress).transfer(msg.sender, tokenMinimum_);
    }
    function tokenToEthSwap(uint256 tokenAmount_, uint256 ethMinimum_) public {
         // for now, just swap ETH and token at 1-1
        // TODO: This needs to change immediately.
        BasicToken(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount_);
        payable(msg.sender).transfer(ethMinimum_);
    }
}