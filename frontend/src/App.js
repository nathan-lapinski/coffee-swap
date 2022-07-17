import styled from "styled-components";
import { ActivateDeactivate } from "./components/ActivateDeactivate";
import { SectionDivider } from "./components/SectionDivider";
import { SignMessage } from "./components/SignMessage";
import { WalletStatus } from "./components/WalletStatus";
import { Token } from "./components/Token";
import { Exchange } from "./components/Exchange";
import { Header } from "./components/Header";

const StyledAppDiv = styled.div`
  display: grid;
  grid-gap: 20px;
  background: #000000;
  height: 100%;
`;

const StyledOverlay = styled.span`
  background: url(/glimmer_bg.svg) 0% 0% / cover no-repeat;
`;

const StyledWelcomeDiv = styled.div`
  height: inherit;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledWelcomeText = styled.div`
  color: white;
  font-size: 4rem;
`;

const StyledBoldText = styled.span`
  font-weight: bold;
`;

const StyledAppSection = styled.div`
  background: #fff;
  padding: 2rem;
  margin: 2rem 4rem;
`;

function App() {
  return (
    <StyledAppDiv>
      <StyledOverlay>
        <Header />
        <StyledWelcomeDiv>
          <StyledWelcomeText>
            COFFEESWAP <StyledBoldText>PROTOCOL</StyledBoldText>
          </StyledWelcomeText>
        </StyledWelcomeDiv>
        <StyledAppSection>
          <SectionDivider />
          <WalletStatus />
          <SectionDivider />
          <SignMessage />
          <SectionDivider />
          <Token />
          <SectionDivider />
          <Exchange />
        </StyledAppSection>
      </StyledOverlay>
    </StyledAppDiv>
  );
}

export default App;
