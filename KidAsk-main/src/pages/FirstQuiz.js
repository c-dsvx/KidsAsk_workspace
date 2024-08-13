import React, { useContext, useEffect, useState } from "react"
import { Redirect, useParams } from "react-router";
import TopicQuiz from "../components/TopicQuiz"
import UserContext from "../context/UserContext";

import { getGenData } from '../data/topics'
import getRandom from "../utils/getRandom";

export default function FirstQuiz() {
  let { id } = useParams();
  const [topic, setTopic] = useState(null)
  const [topics, setTopics] = useState(null)
  const [nextTopic, setNextTopic] = useState(null)
  const [endQuiz, setEndQuiz] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (topics) {
        setTopic(topics[id])
      } else {
        const topics = await getGenData()
        setTopics(topics)
      }
    })()
  }, [id, topics])

  const onFinish = () => {
    const nextTopictoRedirect = Object.keys(topics).reduce((ac, e) => {
      if (ac === 'current') {
        return e
      }
      if (e === id) {
        return 'current'
      }
      return ac
    }, null)

    if (nextTopictoRedirect && nextTopictoRedirect !== 'current') {
      setNextTopic(nextTopictoRedirect)
    } else if (nextTopictoRedirect === 'current') {
      setEndQuiz(true)
    }
  }

  if (!topic) return null
  
  return <>
    {
      nextTopic && nextTopic !== 'current' &&
      <Redirect to={`/first-quiz/${nextTopic}`} />
    }

    {
      endQuiz &&
      <Redirect to="/end-quiz" />
    }
    <TopicQuiz topic={topic} phase="first-questions" goNextTopic onFinish={onFinish} />
  </>
}