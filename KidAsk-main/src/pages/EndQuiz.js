import { AppBar, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormGroup, Toolbar, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react"
import { Redirect } from "react-router";
import useStyles from "../useStyles";
import { Button } from "../components/Button"

import { topicLabels } from '../data/topics'
import ChatMessage from "../components/ChatMessage";
import { NextBtnWrapper, QuizWrapper } from "../components/TopicQuiz.styled";
import getRandom from "../utils/getRandom";
import { GifWrapper } from "../components/GifWrapper";
import { ContentButtonWrapper } from "../components/ContentWrapper";
import UserContext from "../context/UserContext";
import { addUserInput } from "../services";

export default function EndQuiz() {

  const classes = useStyles()

  const { user } = useContext(UserContext)

  const [selectedTopics, setSelectedTopic] = useState([])


  const [state, setState] = React.useState(Object.keys(topicLabels).reduce((ac, key) => {
    return {
      ...ac,
      [key]: false
    }
  }, {}));

  const [start, setStart] = useState(false)

  const handleChange = (event) => {
    if (event.target.checked) {
      if (Object.values(state).filter(e => !!e).length < 2) {
        setState({ ...state, [event.target.name]: true });
      }
    } else {
      setState({ ...state, [event.target.name]: false });
    }
  }

  const handleStart = async () => {
    if (Object.values(state).filter(e => !!e).length === 2) {
      const randomSelectedTopics = getRandom(Object.keys(state).map(e => ({ label: e, value: state[e] })).filter(e => e.value), 2)
      setSelectedTopic(randomSelectedTopics)
      randomSelectedTopics.map(async e => {
        await addUserInput(user.identifiant, "topic-picking",e.label , {})
      })
      setStart(true)
    }
  }


  return <div>
    <AppBar position="static" color="default">
      <Toolbar>
        <Typography variant="h5" className={classes.title}>
          You finished the quiz !
        </Typography>
      </Toolbar>
    </AppBar>

    <QuizWrapper>
      {
        start &&
        <Redirect to={`/qa-phase/${selectedTopics[0].label}/${selectedTopics[1].label}`} />
      }

      <GifWrapper>
        <img src="/robot-danse-1-transparent.gif" />
      </GifWrapper>

      <ChatMessage text="Bravo, tu as fini cette première partie du quiz! Tu peux maintenant choisir tes deux thèmes favoris. Prends ton temps pour réfléchir, nos prochaines activitès seront liées aux thèmes choisis. ">
        <Card variant="outlined">
          <CardContent>
            <FormControl component="fieldset" className={classes.formControl}>
              <FormGroup>
                {
                  Object.keys(topicLabels).map(op => {
                    return <FormControlLabel
                      control={
                        <Checkbox
                          onChange={handleChange}
                          color="primary"
                          checked={!!state[op]}
                          name={op} />
                      }
                      label={topicLabels[op]}
                    />
                  })
                }
              </FormGroup>
            </FormControl>

          </CardContent>
        </Card>
      </ChatMessage>
      
      {
        Object.values(state).filter(e => !!e).length === 2 &&
        <>
          <ChatMessage text="Cool! Quand tu es prêt(e) appuie sur le bouton pour commencer la prochaine activité. " />

          <ContentButtonWrapper>
            <Button variant="contained" onClick={handleStart} disabled={Object.values(state).filter(e => !!e).length < 2}>Je commence</Button>
          </ContentButtonWrapper>
        </>
      }
      
    </QuizWrapper>
  </div>
}
