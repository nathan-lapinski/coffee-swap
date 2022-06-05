import './App.css';
import styled from 'styled-components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { SectionDivider } from './components/SectionDivider';
import { SignMessage } from './components/SignMessage';
import { WalletStatus } from './components/WalletStatus';
import { Token } from './components/Token';
import { Exchange } from './components/Exchange';

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
`;

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>
        ☕️Welcome to CoffeeSwap🔷
        </p>
      </header>
      <StyledAppDiv>
      <ActivateDeactivate />
      <SectionDivider />
      <WalletStatus />
      <SectionDivider />
      <SignMessage />
      <SectionDivider />
      <Token />
      <SectionDivider />
      <Exchange />
      <SectionDivider />
      <SectionDivider />
      <SectionDivider />x
      </StyledAppDiv>
    </div>
  );
}

export default App;
