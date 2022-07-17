import styled from "styled-components";
import { ActivateDeactivate } from "./ActivateDeactivate";

const StyledHeaderDiv = styled.div`
  display: flex;
  max-height: 50px;
  padding: 1rem 2rem 1rem 2rem;
  align-items: center;
  justify-content: space-between;
  color: white;
`;

const StyledIcon = styled.p`
  font-size: 3rem;
`;

const LogoAndControlsDiv = styled.div``;
const NetworkDiv = styled.div``;

export const Header = () => {
  return (
    <StyledHeaderDiv>
      <LogoAndControlsDiv>
        <StyledIcon>☕️</StyledIcon>
      </LogoAndControlsDiv>
      <NetworkDiv>
        <ActivateDeactivate />
      </NetworkDiv>
    </StyledHeaderDiv>
  );
};
