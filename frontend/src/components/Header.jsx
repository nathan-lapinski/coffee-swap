import styled from 'styled-components';

const StyledHeaderDiv = styled.div`
    display: flex;
    max-height: 50px;
    padding: 1rem;
    align-items: center;
    justify-content: space-between;
    color: white;
`;

const LogoAndControlsDiv = styled.div``;
const NetworkDiv = styled.div``;

export const Header = () => {
    return (
        <StyledHeaderDiv>
            <LogoAndControlsDiv>
            <p>
                ☕️Welcome to CoffeeSwap🔷
            </p>
            </LogoAndControlsDiv>
            <NetworkDiv>
                <p>hi</p>
            </NetworkDiv>
        </StyledHeaderDiv>
    )
}