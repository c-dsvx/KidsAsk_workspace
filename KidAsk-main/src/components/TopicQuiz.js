import { AppBar, Card, CardContent, Checkbox, FormControl, FormControlLabel, FormGroup, Slider, Toolbar, Typography } from "@material-ui/core";
import React, { useContext, useState } from "react"
import useStyles from "../useStyles";

import ChatMessage from "../components/ChatMessage";
import { Button, ChatButtons } from "../components/Button"
import { ButtonsWrapper, ButtonWrapper, HeaderWrapper, NextBtnWrapper, QuizWrapper, SliderWrapper } from "./TopicQuiz.styled";
import { EaseUp } from "./EaseUp";
import UserContext from "../context/UserContext";
import { addUserInput } from "../services";

export default function TopicQuiz({ topic, phase, onFinish }) {
  const [questionIndex, setQuestionIndex] = useState(0)
  const [optionEnabled, setOptionEnabled] = useState(false)
  const [ConfidenceEnabled, setConfidenceEnabled] = useState(false)
  const classes = useStyles()
  const { user } = useContext(UserContext)

  console.log({ user })

  const [state, setState] = React.useState({})
  const [confidence, setConfidence] = useState(0)

  const handleChange = (event) => {
    setState({ [event.target.name]: event.target.checked });
  }

  const showOptions = () => {
    setOptionEnabled(true)
  }

  const nextQuestion = () => {
    setOptionEnabled(false)
    setConfidenceEnabled(false)
    if (questionIndex + 1 < topic.length && questionIndex + 1 < topic.length) {
      setQuestionIndex(questionIndex + 1)
    } else {
      setQuestionIndex(0)
      onFinish()
    }
  }

  const skipQuestion = async (skipped) => {
    await addUserInput(user.identifiant, phase, `${topic[questionIndex].topic}/questions/${topic[questionIndex].question.replace(/\//g, '-')}`, {
      question: topic[questionIndex].question,
      skipped,
      didntAnswer: !skipped
    })
    nextQuestion()
  }

  const showConfidence = () => {
    setConfidenceEnabled(true)
  }

  function valuetext(value) {
    return marks.filter(e => e.value === value).label
  }

  const submitQuestion = async () => {
    if (Object.keys(state).length) {
      // submit question to back
      await addUserInput(user.identifiant, phase, `${topic[questionIndex].topic}/questions/${topic[questionIndex].question.replace(/\//g, '-')}` ,{
        question: topic[questionIndex].question,
        skipped: false,
        answer: Object.keys(state)[0],
        confidence: confidence
      })
      setState({})
      nextQuestion()
    }
  }

  const marks = [
    {
      value: 0,
      label: "Super pas confiant",
    },
    {
      value: 1,
      label: "Pas confiant",
    },
    {
      value: 2,
      label: 'Neutre',
    },
    {
      value: 3,
      label: 'Confiant',
    },
    {
      value: 4,
      label: 'Super confiant',
    },
  ];
  

  return <div>
    <AppBar position="fixed" color="default">
      <Toolbar>
        <HeaderWrapper>
          <Typography variant="h5" className={classes.title}>
            Thème: {topic[questionIndex].topic}
          </Typography>
          <Typography variant="h5" className={classes.title}>
            Question {questionIndex + 1}
          </Typography>
        </HeaderWrapper>
      </Toolbar>
    </AppBar>

    <QuizWrapper>
      <ChatMessage text={topic[questionIndex].question}>
          <ChatButtons>
            <ButtonsWrapper>
              <ButtonWrapper>
                <Button variant="contained" onClick={showOptions} >Je veux essayer de répondre à cette question question</Button>
              </ButtonWrapper>
              <ButtonWrapper>
                <Button primary variant="contained" onClick={() => skipQuestion(true)}>Je ne sais pas, je veux passer cette question</Button>
              </ButtonWrapper>
            </ButtonsWrapper>
          </ChatButtons>
         
      </ChatMessage>

      {
        optionEnabled &&
        <ChatMessage text="Super! Tu peux maintenant choisir la proposition qui te semble correcte parmi les suivantes: ">
          <Card variant="outlined">
            <CardContent>
              <FormControl component="fieldset" className={classes.formControl}>
                <FormGroup>
                  {
                    topic[questionIndex].options.map(op => {
                      return <FormControlLabel
                        control={
                          <Checkbox
                            color="primary"
                            onChange={handleChange}
                            checked={!!state[op]}
                            name={op} />
                        }
                        label={op}
                      />
                    })
                  }
                </FormGroup>
              </FormControl>

            </CardContent>
          </Card>

          <ButtonsWrapper style={{ marginTop: '30px' }}>
            <ButtonWrapper>
              <Button variant="contained" onClick={showConfidence} disabled={Object.keys(state).length === 0}>Soumettre</Button>
            </ButtonWrapper>
            <ButtonWrapper>
              <Button primary variant="contained" onClick={() => skipQuestion(false)}>Je ne sais pas</Button>
            </ButtonWrapper>
          </ButtonsWrapper>
        </ChatMessage>
      }

      {
        ConfidenceEnabled &&
        <div>
          <ChatMessage text="Maintenant, peux tu me dire à quel point tu te sens confiant que tu as donné la bonne réponse? ">
            <SliderWrapper>
              <Slider
                defaultValue={0}
                getAriaValueText={valuetext}
                aria-labelledby="discrete-slider"
                valueLabelDisplay="off"
                step={1}
                marks={marks}
                min={0}
                max={4}
                onChange={(e, v) => setConfidence(v)}
              />
            </SliderWrapper>
          </ChatMessage>
          <EaseUp>
            <NextBtnWrapper>
              <Button onClick={submitQuestion} variant="contained">Suivant</Button>
            </NextBtnWrapper>
          </EaseUp>
        </div>
      }
    </QuizWrapper>
  </div>
}
