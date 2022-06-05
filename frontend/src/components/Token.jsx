import { useWeb3React } from '@web3-react/core';
import { Contract, ethers, Signer } from 'ethers';
import {
  ChangeEvent,
  MouseEvent,
  ReactElement,
  useEffect,
  useState
} from 'react';
import styled from 'styled-components';
import TokenArtifact from '../artifacts/contracts/Token.sol/Token.json';
import { Provider } from '../utils/provider';
import { SectionDivider } from './SectionDivider';

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

export function Token() {
  const context = useWeb3React();
  const { library, active } = context;

  const [signer, setSigner] = useState();
  const [tokenContract, setTokenContract] = useState();
  const [tokenContractAddr, setTokenContractAddr] = useState('');
  const [totalSupply, setTotalSupply] = useState('');
  const [greetingInput, setGreetingInput] = useState('');
console.log("TS ", totalSupply)
  useEffect(() => {
    if (!library) {
      setSigner(undefined);
      return;
    }

    setSigner(library.getSigner());
  }, [library]);

  useEffect(() => {
    if (!tokenContract) {
      return;
    }

    async function getGreeting(tokenContract) {
    //   const _greeting = await tokenContract.greet();

    //   if (_greeting !== totalSupply) {
    //     setGreeting(_greeting);
    //   }
    }

    getGreeting(tokenContract);
  }, [tokenContract, totalSupply]);

  function handleDeployContract(event) {
    event.preventDefault();

    // only deploy the Token contract one time, when a signer is defined
    if (tokenContract || !signer) {
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
        const tokenContract = await Token.deploy("TWICHIES", "TWCH", 500000000);

        await tokenContract.deployed();

        const supply = await tokenContract.getTotalSupply();

        setTokenContract(tokenContract);
        setTotalSupply(supply);

        window.alert(`Token deployed to: ${tokenContract.address}`);

        setTokenContractAddr(tokenContract.address);
      } catch (error) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    deployTokenContract(signer);
  }

  function handleGreetingChange(event) {
    event.preventDefault();
    setGreetingInput(event.target.value);
  }

  function handleFaucetSubmit(event) {
    event.preventDefault();
    if (!tokenContract) {
      window.alert('Undefined tokenContract');
      return;
    }

    async function submitFaucet(tokenContract){
        try {
          const faucetTxn = await tokenContract.faucet();
  
          await faucetTxn.wait();


          console.log("SIGNER ", signer)
  
        //   const balance = await tokenContract.getBalanceOf();
        //   window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);
  
        //   if (newGreeting !== totalSupply) {
        //     setTotalSupply(newGreeting);
        //   }
        } catch (error) {
          window.alert(
            'Error!' + (error && error.message ? `\n\n${error.message}` : '')
          );
        }
      }
  
    submitFaucet(tokenContract);
  }
  function handleGreetingSubmit(event) {
    event.preventDefault();

    if (!tokenContract) {
      window.alert('Undefined tokenContract');
      return;
    }

    if (!greetingInput) {
      window.alert('Greeting cannot be empty');
      return;
    }

    async function submitGreeting(tokenContract){
      try {
        const setGreetingTxn = await tokenContract.setGreeting(greetingInput);

        await setGreetingTxn.wait();

        const newGreeting = await tokenContract.greet();
        window.alert(`Success!\n\nGreeting is now: ${newGreeting}`);

        if (newGreeting !== totalSupply) {
          setTotalSupply(newGreeting);
        }
      } catch (error) {
        window.alert(
          'Error!' + (error && error.message ? `\n\n${error.message}` : '')
        );
      }
    }

    submitGreeting(tokenContract);
  }

  return (
    <>
      <StyledDeployContractButton
        disabled={!active || tokenContract ? true : false}
        style={{
          cursor: !active || tokenContract ? 'not-allowed' : 'pointer',
          borderColor: !active || tokenContract ? 'unset' : 'blue'
        }}
        onClick={handleDeployContract}
      >
        Deploy Token Contract
      </StyledDeployContractButton>
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
          {totalSupply ? parseInt(totalSupply._hex, 16) : <em>{`<Contract not yet deployed>`}</em>}
        </div>
        {/* empty placeholder div below to provide empty first row, 3rd col div for a 2x3 grid */}
        <div></div>
        <StyledLabel htmlFor="greetingInput">Set new totalSupply</StyledLabel>
        <StyledInput
          id="greetingInput"
          type="text"
          placeholder={totalSupply ? '' : '<Contract not yet deployed>'}
          onChange={handleGreetingChange}
          style={{ fontStyle: totalSupply ? 'normal' : 'italic' }}
        ></StyledInput>
        <StyledButton
          disabled={!active || !tokenContract ? true : false}
          style={{
            cursor: !active || !tokenContract ? 'not-allowed' : 'pointer',
            borderColor: !active || !tokenContract ? 'unset' : 'blue'
          }}
          onClick={handleGreetingSubmit}
        >
          Submit
        </StyledButton>
        <StyledButton
          disabled={!active || !tokenContract ? true : false}
          style={{
            cursor: !active || !tokenContract ? 'not-allowed' : 'pointer',
            borderColor: !active || !tokenContract ? 'unset' : 'blue'
          }}
          onClick={handleFaucetSubmit}
        >
          Get Token from Faucet
        </StyledButton>
      </StyledGreetingDiv>
    </>
  );
}