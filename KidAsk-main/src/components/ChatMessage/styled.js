import styled from "styled-components"
import { EaseUp } from "../EaseUp"

export const ChatMessageHolder = styled(EaseUp)`
  display: flex;
  width: 100%;
  ${({ big }) => big && `
   margin: 0 auto;
   width: 45%;
   font-size: 1.2em;
  `}

  ${({ reversed }) => reversed && `
    justify-content: flex-end;
  `}
`

export const MessageHolder = styled.div`
  padding-top: 50px;
  flex: 1;

  
`

export const MessageBubble = styled.div`
  width: fit-content;
  max-width: 80%;
  display: flex;
  align-items: center;
  padding: 16px 26px;
  margin-left: 12px;
  margin-bottom: 12px;
  font-size: 25px;
  background: rgb(239,239,239);
  border-radius: 30px;
  position: relative;

  &::before {
    content: ' ';
    background: rgb(239,239,239);
    height: 18px;
    width: 18px;
    position: absolute;
    top: -9px;
    left: -9px;
    border-radius: 50%;
  }

  &::after {
    content: ' ';
    background: rgb(239,239,239);
    height: 10px;
    width: 10px;
    position: absolute;
    top: -17px;
    left: -17px;
    border-radius: 50%;
  }

  ${({ reversed }) => reversed && `
    float: right;
  `}
`

export const Avatar = styled.div`
  height: 80px;
  width: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin-top: 10px;
`

export const AvatarImg = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  svg {
    max-width: 100%;
  }
`