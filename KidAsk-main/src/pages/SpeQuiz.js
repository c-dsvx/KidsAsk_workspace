import React, { useEffect, useState } from "react"
import { Redirect, useParams } from "react-router";
import TopicQuiz from "../components/TopicQuiz"
import { getSpeData } from "../data/spe-topics";

export default function SpeQuiz() {
  let { id, exploration } = useParams();
  const [topic, setTopic] = useState(null)

  useEffect(() => {
    ;(async () => {
      const topics = await getSpeData()
      setTopic(topics[id])
    })()
  }, [])

  const [endQuiz, setEndQuiz] = useState(false)

  const onFinish = () => {
    setEndQuiz(true)
  }

  if (!topic) return null

  return <>
    {
      endQuiz &&
      <Redirect to={`/pre-exploration-outro/${id}`} />
    }
    {
      endQuiz && exploration === 'finished' &&
      <Redirect to={`/post-exploration-finished/${id}`} />
    }
    <TopicQuiz phase={exploration === 'finished' ? "post-exploration" : "pre-exploration"} topic={topic} onFinish={onFinish} />
  
    </>
}