import styled from "styled-components"

export const Button = styled.button`
  padding: 12px 16px;
  background: #27ae60;
  box-shadow: none;
  border: none;
  border-radius: 500px;
  color: white;
  opacity: .9;
  transition: all .3s ease-in;
  cursor: pointer;
  font-size: 22px;
  &:hover {
    opacity: 1;
  }

  &:disabled {
    opacity: .3;
  }

  ${({ primary }) => primary && `
    background: white;
    border: solid 1px #7f8c8d;
    color: #7f8c8d;

    &:hover {
      background: #7f8c8d;
      color: white;
    }
  `}
`

export const ChatButtons = styled.div`
  margin-top: 20px;
  margin-left: 14px;
`