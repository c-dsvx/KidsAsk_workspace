import React from "react"
import { Link, useParams } from "react-router-dom"
import ChatMessage from "../components/ChatMessage"
import { ContentButtonWrapper } from "../components/ContentWrapper"
import { GifWrapper } from "../components/GifWrapper"
import { Button } from "../components/Button"
import { RoboMessage } from "../components/RoboMessage"

export default function PreExplorationIntro() {
  let { id } = useParams();

  return <RoboMessage>
    <GifWrapper>
      <img src="/robot-danse-2-transparent.gif" />
    </GifWrapper>
    <ChatMessage
        big
        text="Merci d'avoir fait cette activité avec moi! On va maintenant explorer ton deuxième topic favori. Mais tout d'abord peux-tu m'aider avec ce petit quiz?" />
    <ContentButtonWrapper>
      <Link to={`/spe-quiz/${id}`}>
        <Button variant="contained">Je commence</Button>
      </Link>
    </ContentButtonWrapper>
  </RoboMessage>
}