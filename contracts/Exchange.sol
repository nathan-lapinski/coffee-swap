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
}
