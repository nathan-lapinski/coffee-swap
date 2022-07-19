import { useState } from "react";

import styled from "styled-components";
import { WalletStatus } from "./components/WalletStatus";
import { Token } from "./components/Token";
import { Exchange } from "./components/Exchange";
import { Header } from "./components/Header";

import { Tab, Tabs } from "@blueprintjs/core";

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
  const [tabId, setTabId] = useState("home");
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
          <Tabs
            id="TabsExample"
            onChange={(newTab, prevTab) => {
              setTabId(newTab)
            }}
            selectedTabId={tabId}
            renderActiveTabPanelOnly={true}
            key={"vertical"}
            animate={true}
          >
            <Tab id="home" title="Home" panel={<WalletStatus />} />
            <Tab id="tok" title="Token" panel={<Token />} />
            <Tab
              id="ex"
              title="Exchange"
              panel={<Exchange />}
              panelClassName="exchange-panel"
            />
            <Tabs.Expander />
          </Tabs>
        </StyledAppSection>
      </StyledOverlay>
    </StyledAppDiv>
  );
}

export default App;
