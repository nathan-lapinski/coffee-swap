// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exchange {
  // stores an ERC20 token used in the exchange
  address public tokenAddress;

  constructor(address _token) {
    require(_token != address(0), "can't use null address");
    tokenAddress = _token;
  }

  function provideLiquidity(uint256 _numOfTokens) public payable {
    IERC20 token = IERC20(tokenAddress);
    token.transferFrom(msg.sender, address(this), _numOfTokens);
  }

  function getReserve() public view returns (uint256) {
    return IERC20(tokenAddress).balanceOf(address(this));
  }

  function getAmount(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) private pure returns (uint256) {
    require(inputReserve > 0 && outputReserve > 0, "insufficient reserves");

    // Δy = yΔx / (x + Δx) by constant product formula
    return (outputReserve * inputAmount) / (inputReserve + inputAmount);
  }

  function getTokenAmount(uint256 _ethSold) public view returns (uint256) {
    require(_ethSold > 0, "eth amount is too small");

    uint256 tokenReserve = getReserve();

    return getAmount(_ethSold, address(this).balance, tokenReserve);
  }

  function getEthAmount(uint256 _tokenSold) public view returns (uint256) {
    require(_tokenSold > 0, "token amount is too small");

    uint256 tokenReserve = getReserve();

    return getAmount(_tokenSold, tokenReserve, address(this).balance);
  }

  // buy tokens with eth. Price of tokens will go up, price of eth will go down
  function ethToTokenSwap(uint256 _minTokens) public payable {
    uint256 tokenReserve = getReserve();
    uint256 tokensBought = getAmount(msg.value, address(this).balance - msg.value, tokenReserve);

    // to protect against front-running
    require(tokensBought >= _minTokens, "insufficient amount of tokens for transaction");
    IERC20(tokenAddress).transfer(msg.sender, tokensBought);
  }

  function tokenToEthSwap(uint256 _tokensSold, uint256 _minEth) public {
    uint256 tokenReserve = getReserve();
    uint256 ethBought = getAmount(
      _tokensSold,
      tokenReserve,
      address(this).balance
    );

    require(ethBought >= _minEth, "insufficient amount of eth for transaction");

    IERC20(tokenAddress).transferFrom(msg.sender, address(this), _tokensSold);
    payable(msg.sender).transfer(ethBought);
  }
}
