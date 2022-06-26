// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "./LPTokenExchange.sol";

contract Factory {
    mapping(address => address) public tokenToExchange;

    function createExchange(address token_) public returns (address) {
        require(token_ != address(0), "Token cannot be null address");
        require(tokenToExchange[token_] == address(0), "Exchange already exists for this token");
        CoffeeSwapExchange exchange = new CoffeeSwapExchange(token_);
        tokenToExchange[token_] = address(exchange);
        return address(exchange);
    }

    function getExchange(address token_) public view returns (address) {
        return tokenToExchange[token_];
    }
}