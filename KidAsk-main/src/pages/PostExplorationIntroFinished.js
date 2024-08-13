import React, { useContext, useEffect } from "react"
import ChatMessage from "../components/ChatMessage"
import { GifWrapper } from "../components/GifWrapper"
import { RoboMessage } from "../components/RoboMessage"
import UserContext from "../context/UserContext"

export default function PreExplorationIntro() {
  useEffect(() => {
    window.localStorage.removeItem('user')
  }, [])
  return <RoboMessage>
    <GifWrapper>
      <img src="/robot-danse-5-transparent.gif" />
    </GifWrapper>
    <ChatMessage
        big
        text="Merci pour avoir fait ces activités avec moi. J'espère que tu les as appréciées comme moi. Bye-Bye !" />

  </RoboMessage>
}
