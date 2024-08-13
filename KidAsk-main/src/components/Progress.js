import styled from "styled-components";

export const ProgressWrapper = styled.div`
  max-width: 400px;

  > div {
    height: 10px;
  }
`

export const ProgressHeader = styled.div`
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  > div {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  h2 {
    margin-bottom: 15px;
    font-weight: normal;
  }
`