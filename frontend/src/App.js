import styled from 'styled-components';
import { ActivateDeactivate } from './components/ActivateDeactivate';
import { SectionDivider } from './components/SectionDivider';
import { SignMessage } from './components/SignMessage';
import { WalletStatus } from './components/WalletStatus';
import { Token } from './components/Token';
import { Exchange } from './components/Exchange';
import { Header } from './components/Header';

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
  background: #212429;
  height: 100vh;
`;

function App() {
  return (
      <StyledAppDiv>
      <Header />
      <ActivateDeactivate />
      {/* <SectionDivider />
      <WalletStatus />
      <SectionDivider />
      <SignMessage />
      <SectionDivider />
      <Token />
      <SectionDivider />
      <Exchange />
      <SectionDivider />
      <SectionDivider />
      <SectionDivider />x */}
      </StyledAppDiv>
  );
}

export default App;
