import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import { useEffect, useState } from "react";
import styled from "styled-components";
import ExchangeArtifact from "../artifacts/contracts/LPTokenExchange.sol/CoffeeSwapExchange.json";
import { SectionDivider } from "./SectionDivider";

const StyledDeployContractButton = styled.button`
  width: 180px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
  place-self: center;
`;

const StyledGreetingDiv = styled.div`
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-columns: 135px 2.7fr 1fr;
  grid-gap: 10px;
  place-self: center;
  align-items: center;
`;

const StyledLabel = styled.label`
  font-weight: bold;
`;

const StyledInput = styled.input`
  padding: 0.4rem 0.6rem;
  line-height: 2fr;
`;

const StyledButton = styled.button`
  width: 150px;
  height: 2rem;
  border-radius: 1rem;
  border-color: blue;
  cursor: pointer;
`;

export function Exchange() {
  const context = useWeb3React();
  const { library, active } = context;

  const [signer, setSigner] = useState();
  const [exchangeContract, setExchangeContract] = useState();
  const [exchangeContractAddr, setExchangeContractAddr] = useState("");
  const [reserves, setReserves] = useState("");
  const [tokenAddressInput, setExchangeAddressInput] = useState("");
  const [minTokens, setMinTokens] = useState("");

  const [minTokensInput, setMinTokensInput] = useState("");
  const [liquidity, setLiquidity] = useState("");

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  function handleDeployContract(event) {
    event.preventDefault();

    // only deploy the Exchange contract one time, when a signer is defined
    if (exchangeContract || !signer || !tokenAddressInput) {
      return;
    }

    async function deployExchangeContract(signer) {
      const Exchange = new ethers.ContractFactory(
        ExchangeArtifact.abi,
        ExchangeArtifact.bytecode,
        signer
      );

      try {
        if (!tokenAddressInput) {
          window.alert(`Need a token Address ${tokenAddressInput}`);
        }
        // needs exchange address
        const exchangeContract = await Exchange.deploy(tokenAddressInput);

        await exchangeContract.deployed();

        const reserve = await exchangeContract.reserves();

        setExchangeContract(exchangeContract);
        setReserves(reserve);

        window.alert(`Exchange deployed to: ${exchangeContract.address}`);

        setExchangeContractAddr(exchangeContract.address);
      } catch (error) {
        window.alert(
          "Error!" + (error && error.message ? `\n\n${error.message}` : "")
        );
      }
    }

    deployExchangeContract(signer);
  }

  function handleExchangeAddressChange(event) {
    event.preventDefault();
    setExchangeAddressInput(event.target.value);
  }

  function handleMinTokensChange(event) {
    event.preventDefault();
    setMinTokens(event.target.value);
  }

  function handleLiquidityChange(event) {
    event.preventDefault();
    setLiquidity(event.target.value);
  }

  function handleProvideLiquiditySubmit(event) {
    event.preventDefault();

    if (!exchangeContract) {
      window.alert("Undefined exchangeContract");
      return;
    }

    if (!liquidity) {
      window.alert("Need to specify liquidity to provide");
      return;
    }

    async function submitLiquidity(exchangeContract) {
      try {
        // TODO: The value of eth sent should be set in the UI instead of being hardcoded
        const liquidityTxn = await exchangeContract.provideLiquidity(liquidity, {value: ethers.utils.parseUnits("1", "ether")});

        await liquidityTxn.wait();
      } catch (error) {
        window.alert(
          "Error!" + (error && error.message ? `\n\n${error.message}` : "")
        );
      }
    }

    submitLiquidity(exchangeContract);
  }

  function handleEthForTokenSubmit(event) {
    event.preventDefault();

    if (!exchangeContract) {
      window.alert("Undefined exchangeContract");
      return;
    }

    if (!minTokens) {
      window.alert("Need to specify a minimum number of tokens for purchasing");
      return;
    }

    async function submitEthToTokenSwap(exchangeContract) {
      try {
        const swapTxn = await exchangeContract.ethToTokenSwap(minTokens);

        await swapTxn.wait();
      } catch (error) {
        window.alert(
          "Error!" + (error && error.message ? `\n\n${error.message}` : "")
        );
      }
    }

    submitEthToTokenSwap(exchangeContract);
  }

  function handleGreetingSubmit(event) {
    event.preventDefault();

    if (!exchangeContract) {
      window.alert("Undefined exchangeContract");
      return;
    }

    if (!tokenAddressInput) {
      window.alert("Greeting cannot be empty");
      return;
    }

    async function submitGreeting(exchangeContract) {
      try {
        const setGreetingTxn = await exchangeContract.setGreeting(
          tokenAddressInput
        );

        await setGreetingTxn.wait();

        const newGreeting = await exchangeContract.greet();
        window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);

        if (newGreeting !== reserves) {
          setReserves(newGreeting);
        }
      } catch (error) {
        window.alert(
          "Error!" + (error && error.message ? `\n\n${error.message}` : "")
        );
      }
    }

    submitGreeting(exchangeContract);
  }

  return (
    <>
      <StyledDeployContractButton
        disabled={!active || exchangeContract ? true : false}
        style={{
          cursor: !active || exchangeContract ? "not-allowed" : "pointer",
          borderColor: !active || exchangeContract ? "unset" : "blue",
        }}
        onClick={handleDeployContract}
      >
        Deploy Exchange Contract
      </StyledDeployContractButton>
      <SectionDivider />
      <StyledGreetingDiv>
        <StyledLabel>Contract addr</StyledLabel>
        <div>
          {exchangeContractAddr ? (
            exchangeContractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel>Current reserves</StyledLabel>
        <div>
          {reserves ? (
            parseInt(reserves._hex, 16)
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel htmlFor="tokenAddressInput">
          Set new token address
        </StyledLabel>
        <StyledInput
          id="tokenAddressInput"
          type="text"
          placeholder={reserves ? "" : "<Contract not yet deployed>"}
          onChange={handleExchangeAddressChange}
          style={{ fontStyle: reserves ? "normal" : "italic" }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !exchangeContract ? true : false}
          style={{
            cursor: !active || !exchangeContract ? "not-allowed" : "pointer",
            borderColor: !active || !exchangeContract ? "unset" : "blue",
          }}
          onClick={handleGreetingSubmit}
        >
          Submit
        </StyledButton>
        <StyledLabel htmlFor="liquidityInput">Provide Liquidity</StyledLabel>
        <StyledInput
          id="liquidityInput"
          type="text"
          placeholder={"<Liquidity to provice>"}
          onChange={handleLiquidityChange}
          style={{ fontStyle: "italic" }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !exchangeContract ? true : false}
          style={{
            cursor: !active || !exchangeContract ? "not-allowed" : "pointer",
            borderColor: !active || !exchangeContract ? "unset" : "blue",
          }}
          onClick={handleProvideLiquiditySubmit}
        >
          Submit
        </StyledButton>
        <StyledLabel htmlFor="minTokensInput">Swap Eth for Token</StyledLabel>
        <StyledInput
          id="minTokensInput"
          type="text"
          placeholder={"<Minimum number of tokens to buy>"}
          onChange={handleMinTokensChange}
          style={{ fontStyle: "italic" }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !exchangeContract ? true : false}
          style={{
            cursor: !active || !exchangeContract ? "not-allowed" : "pointer",
            borderColor: !active || !exchangeContract ? "unset" : "blue",
          }}
          onClick={handleEthForTokenSubmit}
        >
          Submit
        </StyledButton>
      </StyledGreetingDiv>
    </>
  );
}
