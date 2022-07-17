import { useWeb3React } from "@web3-react/core";
import { Contract, ethers, Signer } from "ethers";
import { useEffect, useState } from "react";
import styled from "styled-components";
import TokenArtifact from "../artifacts/contracts/Token.sol/Token.json";
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

export function Token() {
  const context = useWeb3React();
  const { library, active } = context;

  const [signer, setSigner] = useState();
  const [tokenContract, setTokenContract] = useState();
  const [tokenContractAddr, setTokenContractAddr] = useState("");
  const [totalSupply, setTotalSupply] = useState("");
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [tokenInitialSupply, setTokenInitialSupply] = useState("");
  const [allowance, setAllowance] = useState("");
  const [allowanceAddress, setAllowanceAddress] = useState("");

  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  function handleDeployContract(event) {
    event.preventDefault();

    // only deploy the Token contract one time, when a signer is defined
    if (tokenContract || !signer) {
      return;
    }

    if (!tokenName || !tokenSymbol) {
      return;
    }

    async function deployTokenContract(signer) {
      const Token = new ethers.ContractFactory(
        TokenArtifact.abi,
        TokenArtifact.bytecode,
        signer
      );

      try {
        // needs name, symbol, initial supply
        const tokenContract = await Token.deploy(
          tokenName,
          tokenSymbol,
          tokenInitialSupply || "500000000000000000000000000"
        );

        await tokenContract.deployed();

        const supply = await tokenContract.totalSupply();

        setTokenContract(tokenContract);
        setTotalSupply(supply);

        window.alert(`Token deployed to: ${tokenContract.address}`);

        setTokenContractAddr(tokenContract.address);
      } catch (error) {
        window.alert(
          "Error!" + (error && error.message ? `\n\n${error.message}` : "")
        );
      }
    }

    deployTokenContract(signer);
  }

  async function setAddressAllowance() {
    if (!allowance) {
      return;
    }
    try {
      await tokenContract.approve(allowanceAddress, allowance);
      window.alert(`Approval: ${allowanceAddress}: ${allowance}`);
    } catch (error) {
      window.alert(
        "Error!" + (error && error.message ? `\n\n${error.message}` : "")
      );
    }
  }

  return (
    <>
      <StyledDeployContractButton
        disabled={!active || tokenContract ? true : false}
        style={{
          cursor: !active || tokenContract ? "not-allowed" : "pointer",
          borderColor: !active || tokenContract ? "unset" : "blue",
        }}
        onClick={handleDeployContract}
      >
        Deploy Token Contract
      </StyledDeployContractButton>
      <div>
        <div>
          Token Name:{" "}
          <input
            type="text"
            onBlur={(e) => {
              setTokenName(e.target.value);
            }}
          />
        </div>
        <div>
          Token Symbol:{" "}
          <input
            type="text"
            onBlur={(e) => {
              setTokenSymbol(e.target.value);
            }}
          />
        </div>
        <div>
          Initial Amount:{" "}
          <input
            type="text"
            onBlur={(e) => {
              setTokenInitialSupply(e.target.value);
            }}
          />
        </div>
      </div>
      <SectionDivider />
      <StyledGreetingDiv>
        <StyledLabel>Contract addr</StyledLabel>
        <div>
          {tokenContractAddr ? (
            tokenContractAddr
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel>Current totalSupply</StyledLabel>
        <div>
          {totalSupply ? (
            parseInt(totalSupply._hex, 16)
          ) : (
            <em>{`<Contract not yet deployed>`}</em>
          )}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <div>
          Set Token Allowance:
          <input
            type="text"
            onBlur={(e) => {
              setAllowanceAddress(e.target.value);
            }}
          />
          <input
            type="text"
            onBlur={(e) => {
              setAllowance(e.target.value);
            }}
          />
          <button onClick={() => setAddressAllowance()}>Set Allowance</button>
        </div>
      </StyledGreetingDiv>
    </>
  );
}
