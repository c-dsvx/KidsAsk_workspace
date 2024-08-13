import styled from "styled-components"

export const IntroContainer = styled.div`
  display: flex;
  overflow: auto;
`

export const Left = styled.div`
  width: 50%;
  padding: 100px 0;
  background-color: #C1E4F7;
  min-height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;

  input {
    width: 250px;
    padding: 10px 12px;
  }
`
export const Right = styled.div`
  width: 50%;
  padding: 100px 0;
  min-height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
`

export const RobotPicture = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

export const ButtonWrapper = styled.div``
