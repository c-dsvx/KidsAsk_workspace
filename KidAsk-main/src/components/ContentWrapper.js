import styled from "styled-components"

export default styled.div`
  padding: 30px;
  height: calc(100% - 20px);
  overflow: auto;

  ${({ center }) => center && `
    padding: 0;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
  `}

`

export const ContentButtonWrapper = styled.div`
  margin-top: 60px;
  display: flex;
  justify-content: space-around;
`

export const FigureWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 40px 0;

  img {
    max-height: 300px;
  }
`