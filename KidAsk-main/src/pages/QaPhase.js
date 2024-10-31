import { Card, CardContent, Checkbox, FormControl, FormControlLabel, FormGroup, TextField, Typography } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react"
import Resize from "react-resize-layout/dist/Resize";
import ResizeHorizon from "react-resize-layout/dist/ResizeHorizon";
import { Redirect, useParams } from "react-router";
import ChatMessage from "../components/ChatMessage";
import ContentWrapper, { ContentButtonWrapper, ContentHelpButtonWrapper, FigureWrapper } from "../components/ContentWrapper";
import { StoryWrapper } from "../components/StoryWrapper";
import quPhase from "../data/quPhase";
import { topicLabels } from "../data/topics";
import useStyles from "../useStyles";
import { Button, HelpButton } from "../components/Button";
import UserContext from "../context/UserContext";
import { addUserInput } from "../services";
import { EaseUp } from "../components/EaseUp";
import { SubTopicList } from "../components/ExplorationUI";
import HighlightedText from "../data/highlight";

export default function QaPhase() {
  // Extract parameters from URL
  let { id, nextTopic } = useParams();
  // Get the topic data based on the id from `quPhase` data
  const topic = quPhase[id]

  // State hooks for managing slide index, question visibility, and other UI states
  const [slideIndex, setSlideIndex] = useState(0)

  const [showQuestions, setShowQuestions] = useState(false)

  const [showHighlights, setShowHighlights] = useState(false);

  const [questionIndex, setQuestionIndex] = useState(0)

  const [phaseEnded, setPhaseEnded] = useState(false)

  const [question, setQuestion] = useState('') /*user-typed question*/

  const [stateFirst, setStateFirst] = React.useState({}) /* first checkbox state */

  const [stateSecond, setStateSecond] = React.useState({}) /* second checkbox state */

  const [keyword, setKeyword] = useState('') /*user-typed keyword1*/
  const[isEditable1, setIsEditable1] = useState(true) /*used for freezing input 1*/

  const [linkword, setLinkword] = useState('') /*user-typed link word*/
  const[isEditable2, setIsEditable2] = useState(true) /*used for freezing input 2*/

  const [help, setHelp] = useState(false) /* help for finding linkwords set to false, true on click */

  const { user } = useContext(UserContext)

  const previousUrl = useRef(''); // Ref to track previous audio URL
  const messagesEndRef = useRef(null); // Reference for the end of the messages (for auto-scroll)
  // Function to scroll to the bottom
  const scrollToBottom = () => {
  messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
  // Auto-scroll when the messages or relevant state changes
  scrollToBottom();}, [stateFirst, stateSecond, isEditable1, isEditable2, help]);


  const audioRef = useRef(); // Ref for audio element

  useEffect(() => {
    // Load new audio if URL changes
    if (topic.slides[slideIndex]) {
      if (previousUrl.current === topic.slides[slideIndex].audio) {
        return;
      }
  
      if (audioRef.current) {
        audioRef.current.load();
      }
  
      previousUrl.current = topic.slides[slideIndex].audio;
    }
  }, [slideIndex]);

  // Handler for the first checklist
  const handleChangeFirst = (event) => {
    const selectedItem = event.target.name;
    const isChecked = event.target.checked;

    if (isChecked) {
      // If checked, set the first checklist to only the selected item
      setStateFirst({ [selectedItem]: true });
    } else {
      // If unchecked, reset the first checklist
      setStateFirst({});
    }
    // Reset second options whenever the first checklist changes
    setStateSecond({});
  };

  // Function to get second checklist options from the external mapping
  const getSecondChecklistOptions = (firstItem) => {
    const currentQuestion = topic.slides[slideIndex]?.questions[questionIndex];
    
    if (currentQuestion?.subtopic2Map) {
      return currentQuestion.subtopic2Map[firstItem] || [];
    }
    return [];
  };

  // Handler for the second checklist
  const handleChangeSecond = (event) => {
    const selectedItem2 = event.target.name;
    const isChecked2 = event.target.checked;

    if (isChecked2) {
      // If checked, set the first checklist to only the selected item
      setStateSecond({ [selectedItem2]: true });
    } else {
      // If unchecked, reset the first checklist
      setStateSecond({});
    }
  };

  const classes = useStyles()

  // Mark the reading as finished and show questions
  const finishedReading = () => {
    setShowQuestions(true);
    setShowHighlights(true); // Set highlights to be visible
  }

  // when button clicked submit keyword
  const freezeWord1 = () => {
    setIsEditable1(false) 
  }

  // when button clicked submit linkword
  const freezeWord2 = () => {
    setIsEditable2(false) 
  }

  // when button clicked help 2 becomes true
  const showHelp = () => {
     setHelp(true)
  } 

  // Update the question state when user types
  const handleChangeQuestion = (e) => {
    setQuestion(e.target.value) /*updates user-typed question state*/
  }

  // Update the keyword state when user types
  const handleChangeKeyword = (e) => {
    setKeyword(e.target.value) /*updates user-typed keyword state*/
  }

  // Update the linkword state when user types
  const handleChangeLinkword = (e) => {
    setLinkword(e.target.value) /*updates user-typed linkword state*/
  }

  // Submit user input and move to the next question or slide
  const nextQuestion = async () => {
    await addUserInput(user.identifiant, 'qa-phase', `${id}/slides/${topic.slides[slideIndex].text.substring(0, 40).replace(/\//g, '-')}/questions/${questionIndex}`, {
      text: topic.slides[slideIndex].text, // records text
      prompt1: Object.keys(stateFirst).length ? Object.keys(stateFirst)[0]: "no-prompt", // records checked option in list 1
      keyword,
      prompt2: Object.keys(stateSecond).length ? Object.keys(stateSecond)[0]: "no-prompt", // records checked option in list 2
      linkword, // records associated keyword
      question // records question typed
    })
    setStateFirst({})
    setStateSecond({})
    setQuestion('')
    setKeyword('')
    setLinkword('')
    setIsEditable1(true)
    setIsEditable2(true)
    setHelp(false)
    if (questionIndex + 1 < 6) {
      setQuestionIndex(questionIndex + 1)
    } else if (slideIndex + 1 < topic.slides.length) {
      setShowQuestions(false)
      setQuestionIndex(0)
      setSlideIndex(slideIndex + 1)
    } else {
      setPhaseEnded(true)
    }
  } /*submits user input and goes to next q or slide */

  return <div>

    {
      // Redirect to next topic if phase ended
      phaseEnded &&
      <Redirect to={`/pre-exploration-intro/${nextTopic}`} />
    }

    <div style={{ position: "relative", height: '100vh' }}>
      <Resize handleWidth="5px" handleColor="#ddd">
        <ResizeHorizon width="calc(100vw / 2)">
          <ContentWrapper>
            {/* Display the topic title */}
            <Typography variant="h5" className={classes.title}>
              Thème: {topicLabels[id]}
            </Typography>
            {/* Display the image for the current slide */}
            <FigureWrapper>
              <img src={topic.slides[slideIndex].image} />
            </FigureWrapper>
            {/* Display the text and audio for the current slide */}
            
            <StoryWrapper>
            <div>
            <HighlightedText text={topic.slides[slideIndex].text} subtopic={topic.slides[slideIndex].questions[questionIndex].subtopic} showHighlights={showHighlights} />
            </div>
              
              {/* Audio player for the current slide */}
              <audio controls ref={audioRef}>
                <source src={topic.slides[slideIndex].audio} type="audio/mp3"></source>
              </audio>

            </StoryWrapper>
            { // Show button Finished reading if questions not being shown
              !showQuestions &&
              <ContentButtonWrapper>
                <Button onClick={finishedReading} variant="contained">J'ai fini la lecture</Button>
              </ContentButtonWrapper>
            }
          </ContentWrapper>
        </ResizeHorizon  >
        <ResizeHorizon width="calc(100vw / 2)">
          <ContentWrapper>
            {/* Display the title */}
            <Typography variant="h5" className={classes.title}>
              Espace Chatty
            </Typography>

            { // if user in control cond
              !user.help &&
              <>
              { // show question if they are to be shown and q less than n°5 (starts at zero)
                  showQuestions && questionIndex < 5 &&
                  <>
                  <ChatMessage text={
                    `Tu peux explorer ce texte plus si tu poses des questions curieuses.`
                  } />
                  
                  <ChatMessage text={
                    `Tiens, je peux t'aider à réfléchir à une question curieuse : Une question interéssante peut commencer par '${topic.slides[slideIndex].questions[questionIndex].starter}'`
                  } />

                  <ChatMessage text={
                    `La réponse à cette question apporte la nouvelle information suivante. Peux-tu trouver la question ?`
                  } >
                    <Card variant="outlined">
                      <CardContent>
                        <FormControl component="fieldset" className={classes.formControl}>
                          <FormGroup>
                            {
                              topic.slides[slideIndex].questions[questionIndex].options.map(op => {
                                return <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={handleChangeFirst}
                                      checked={!!stateFirst[op]}
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
                  </ChatMessage>
                  </>
              }

              { // If at least one checkbox checked show input zone
                  (showQuestions && questionIndex < 5 && Object.keys(stateFirst).length > 0) &&
                    <>
                      <ChatMessage text={
                        `Super ! Tu peux maintenant formuler ta question, prends ton temps !`
                      } />
  
                      <TextField value={question} onChange={handleChangeQuestion} id="standard-basic" label="Mets ta question ici" fullWidth />
  
                      <ContentButtonWrapper>
                        <Button onClick={nextQuestion} variant="contained" disabled={!question}>Soumettre</Button>
                      </ContentButtonWrapper>
  
                      <ChatMessage text={
                      `Je te propose de commencer ta question par le(s) mot(s) '${topic.slides[slideIndex].questions[questionIndex].starter}'. Mais tu peux en choisir un autre si tu veux.`
                      } >
                      
                      </ChatMessage>
  
                        <EaseUp>
                        {
                          <Card>
                            <CardContent>
                              <SubTopicList>
                                  {
                                  <div>
                                    <p>
                                    Pour rappel, voici une liste de mots interrogatifs que tu pourrais utiliser :
                                  </p>
                                  <ul>
                                    <li>Quel.s/ Quelle.s</li>
                                    <li>Pourquoi</li>
                                    <li>Comment</li>
                                    <li>Combien</li>
                                    <li>...</li>
                                      </ul>
                                      </div>
                                  
                                  }
                                </SubTopicList>
                            </CardContent>
                          </Card>
                        }
                        </EaseUp>
  
                    </>
              }

              {
              // Show the final question input if the question index is 5
              showQuestions && questionIndex  === 5 &&
              <>
                <ChatMessage text={
                  `Maintenant essaie de formuler ta question tout seul, comme on s'est entrainés ensemble.`
                  } />
                <ChatMessage text={
                  `Attention, tu ne peux pas répéter une question précédente et la réponse ne doit pas figurer dans le texte.`
                  } />
                        
                  <TextField id="standard-basic" label="Mets ta question ici" fullWidth onChange={handleChangeQuestion} />

                  <ContentButtonWrapper>
                    <Button onClick={nextQuestion} variant="contained" disabled={!question}>Soumettre</Button>
                  </ContentButtonWrapper>
                </>
              }
              </>
            }

            { // If user in exp condition
              user.help &&
              <>

              { // for question 1
                showQuestions && questionIndex < 1 &&
                <>
                <ChatMessage text={
                    `Voici quelques mots importants que j'ai trouvés dans le texte. On appelle ça des mots-clés. Coche la case du mot qui te rend curieux !`
                 } />

                    <Card variant="outlined">
                      <CardContent>
                        <FormControl component="fieldset" className={classes.formControl}>
                          <FormGroup>
                            {
                              topic.slides[slideIndex].questions[questionIndex].subtopic.map(op => {
                                return <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={handleChangeFirst}
                                      checked={!!stateFirst[op]}
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
                  
                  </>
                }

                { // Q1 If at least one FIRST checkbox checked show second list
                 (showQuestions && questionIndex < 1 && Object.keys(stateFirst).length > 0) &&
                  <>
                    <ChatMessage text={
                    `Est-ce que ce mot te fait penser à quelque-chose que tu sais déjà ? Voici à quoi moi, il me fait penser :`
                  } />

                    <Card variant="outlined">
                      <CardContent>
                        <FormControl component="fieldset" className={classes.formControl}>
                          <FormGroup>
                            {
                             // Loop through selected first checklist items and show corresponding second checklist
                              Object.keys(stateFirst).filter(item => stateFirst[item]).map(selectedFirst => {
                              const optionsForSelectedFirst = getSecondChecklistOptions(selectedFirst);
                
                              return optionsForSelectedFirst.map(op => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={handleChangeSecond}
                                      checked={!!stateSecond[op]}
                                      name={op} />
                                  }
                                  label={op}
                                  key={op}  // Add a unique key for each option to avoid warnings
                                />
                              ));
                              }) 
                            }
                          </FormGroup>
                        </FormControl>
                      </CardContent>
                    </Card>
                    </>

                }

                { // Q1 If at least one checkbox checked in each show input zone
                  (showQuestions && questionIndex < 1 && Object.keys(stateFirst).length > 0 && Object.keys(stateSecond).length > 0)
                   &&
                  <>
                    <ChatMessage text={
                      `Super ! Tu peux maintenant formuler ta question en utilisant le(s) mot(s) que tu as choisi(s)`
                      } />

                    <ChatMessage text={
                      `Je te propose de commencer ta question par '${topic.slides[slideIndex].questions[questionIndex].starter}'. Mais tu peux en choisir autre chose si tu veux.`
                      } >
                    </ChatMessage>

                    <EaseUp>
                      {
                        <Card>
                          <CardContent>
                            <SubTopicList>
                                {
                                <div>
                                  <p>
                                  Pour rappel, voici une liste de mots interrogatifs que tu pourrais utiliser :
                                </p>
                                <ul>
                                  <li>Quel.s/ Quelle.s</li>
                                  <li>Pourquoi</li>
                                  <li>Comment</li>
                                  <li>Combien</li>
                                  <li>...</li>
                                    </ul>
                                    </div>
                                
                                }
                              </SubTopicList>
                          </CardContent>
                        </Card>
                      }
                      </EaseUp> 
                      {/*add more space between these elements if possible*/}

                      <TextField value={question} onChange={handleChangeQuestion} id="standard-basic" label="Mets ta question ici" fullWidth />

                      <ContentButtonWrapper>
                      <Button onClick={nextQuestion} variant="contained" disabled={!question}>Soumettre</Button>
                      </ContentButtonWrapper>

                    </>
                }
                
                { // Q2 keyword list
                showQuestions && questionIndex ===1 &&
                <>
                    <ChatMessage text={
                      `Super ! Essayons encore une fois. Coche le mot qui te rend curieux.`
                    } />

                    <Card variant="outlined">
                      <CardContent>
                        <FormControl component="fieldset" className={classes.formControl}>
                          <FormGroup>
                            {
                              topic.slides[slideIndex].questions[questionIndex].subtopic.map(op => {
                                return <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={handleChangeFirst}
                                      checked={!!stateFirst[op]}
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

                    </>
                    
                }

                { // Q2 If at least one checkbox checked, show linkword input
                 (showQuestions && questionIndex === 1 && Object.keys(stateFirst).length > 0) &&
                  <>
                    <ChatMessage text={
                    `Très bien ! Ce mot te fait sûrement penser à quelque-chose que tu connais déjà, non ? Écris-le ici :`
                  } />

                    <TextField value={linkword} onChange={handleChangeLinkword} id="standard-basic" label="Mets ton idée ici" fullWidth disabled={!isEditable2}/>
                    <ContentButtonWrapper>
                      <Button onClick={freezeWord2} variant="contained" disabled={!linkword}>OK</Button>
                    </ContentButtonWrapper>           
                    {/*input keyword and freezed if submitted*/}

                    <ChatMessage text={
                      `Si tu n'as pas d'idée, je peux t'aider !`
                    } />

                    <ContentHelpButtonWrapper>
                      <HelpButton
            onClick={showHelp} variant="contained" disabled={!isEditable2}>Je veux de l'aide</HelpButton>
                    </ContentHelpButtonWrapper>
                 </>   

                }

                { // Q2 If user asked for help 2
                  (showQuestions && questionIndex === 1 && help === true)
                   &&
                  <>
                <ChatMessage text={
                    `Voici les choses auxquelles me font penser ce mot-clé du texte. Coche celle qui t'intéresse aussi'`
                 } />

                    <Card variant="outlined">
                      <CardContent>
                        <FormControl component="fieldset" className={classes.formControl}>
                          <FormGroup>
                            {
                             // Loop through selected first checklist items and show corresponding second checklist
                              Object.keys(stateFirst).filter(item => stateFirst[item]).map(selectedFirst => {
                              const optionsForSelectedFirst = getSecondChecklistOptions(selectedFirst);
                
                              return optionsForSelectedFirst.map(op => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={handleChangeSecond}
                                      checked={!!stateSecond[op]}
                                      name={op} />
                                  }
                                  label={op}
                                  key={op}  // Add a unique key for each option to avoid warnings
                                />
                              ));
                              }) 
                            }
                          </FormGroup>
                        </FormControl>
                      </CardContent>
                    </Card>

                    </>
                    
                }

                { // Q2 If at least one answer in each show input zone
                  (showQuestions && questionIndex === 1 && (Object.keys(stateSecond).length > 0 || isEditable2 === false))
                   &&
                  <>
                    <ChatMessage text={
                      `Super ! Tu peux maintenant formuler ta question en utilisant ton ou tes mot(s)`
                    } />

                    <ChatMessage text={
                    `Je te propose de commencer ta question par '${topic.slides[slideIndex].questions[questionIndex].starter}'. Mais tu peux en choisir un autre si tu veux.`
                    } >
                    
                    </ChatMessage>

                      <EaseUp>
                      {
                        <Card>
                          <CardContent>
                            <SubTopicList>
                                {
                                <div>
                                  <p>
                                  Pour rappel, voici une liste de mots interrogatifs que tu pourrais utiliser :
                                </p>
                                <ul>
                                  <li>Quel.s/ Quelle.s</li>
                                  <li>Pourquoi</li>
                                  <li>Comment</li>
                                  <li>Combien</li>
                                  <li>...</li>
                                    </ul>
                                    </div>
                                
                                }
                              </SubTopicList>
                          </CardContent>
                        </Card>
                      }
                      </EaseUp>
                      {/*add more space between these elements if possible*/}
                      <TextField value={question} onChange={handleChangeQuestion} id="standard-basic" label="Mets ta question ici" fullWidth />

                      <ContentButtonWrapper>
                      <Button onClick={nextQuestion} variant="contained" disabled={!question}>Valider</Button>
                    </ContentButtonWrapper>

                    </>

                }

                { // Q3-5 keyword
                showQuestions && (questionIndex >= 2 && questionIndex <= 4) &&
                <>
                    <ChatMessage text={
                      `En réalité, il y a plein de mots intéressants dans ce texte ! En voici quelques-uns. Choisis celui qui te rend curieux. `
                    } />
                    {/*3 per line not list*/}

                    <Card variant="outlined">
                      <CardContent>
                        <FormControl component="fieldset" className={classes.formControl}>
                          <FormGroup>
                            {
                              topic.slides[slideIndex].questions[questionIndex].subtopic.map(op => {
                                return <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={handleChangeFirst}
                                      checked={!!stateFirst[op]}
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
                 </>   
                }

                { // Q3-5 If at least one checkbox checked, show second input
                 (showQuestions && (questionIndex >= 2 && questionIndex <= 4) && (Object.keys(stateFirst).length > 0)) &&
                  <>
                    <ChatMessage text={
                    `Ce mot te rappelle sûrement quelque-chose que tu connais déjà ! Écris-le ici :`
                  } />

                    <TextField value={linkword} onChange={handleChangeLinkword} id="standard-basic" label="Mets ton mot ici" fullWidth disabled={!isEditable2}/>
                    <ContentButtonWrapper>
                      <Button onClick={freezeWord2} variant="contained" disabled={!linkword}>OK</Button>
                    </ContentButtonWrapper>           
                    {/*input keyword and freezed if submitted*/}

                    <ChatMessage text={
                      `Si tu n'y arrives pas, je peux t'aider !`
                    } />

                    <ContentHelpButtonWrapper>
                      <HelpButton onClick={showHelp} variant="contained" disabled={!isEditable2}>Je veux de l'aide</HelpButton>
                    </ContentHelpButtonWrapper>
                 </>   

                }

                { // Q3-5 If user asked for help 2
                  (showQuestions && (questionIndex >= 2 && questionIndex <= 4) && help === true)
                   &&
                  <>
                <ChatMessage text={
                    `Voici les choses auxquelles me font penser les mots-clés du texte. Coche celle qui te rend curieux.`
                 } />

                    <Card variant="outlined">
                      <CardContent>
                        <FormControl component="fieldset" className={classes.formControl}>
                          <FormGroup>
                            {
                             // Loop through selected first checklist items and show corresponding second checklist
                              Object.keys(stateFirst).filter(item => stateFirst[item]).map(selectedFirst => {
                              const optionsForSelectedFirst = getSecondChecklistOptions(selectedFirst);
                
                              return optionsForSelectedFirst.map(op => (
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      color="primary"
                                      onChange={handleChangeSecond}
                                      checked={!!stateSecond[op]}
                                      name={op} />
                                  }
                                  label={op}
                                  key={op}  // Add a unique key for each option to avoid warnings
                                />
                              ));
                              }) 
                            }
                          </FormGroup>
                        </FormControl>
                      </CardContent>
                    </Card>

                    </>
                    
                }

                { // Q3-5 If at least one answer in each show input zone
                  (showQuestions && (questionIndex >= 2 && questionIndex <= 4) && (Object.keys(stateSecond).length > 0 || isEditable2 === false /*or state button = clicked*/))
                   &&
                  <>
                    <ChatMessage text={
                      `Super ! Tu peux maintenant formuler ta question en utilisant ton ou tes mot(s)-clé(s)`
                    } />

                    <ChatMessage text={
                    `Je te propose de commencer ta question par le(s) mot(s) '${topic.slides[slideIndex].questions[questionIndex].starter}'. Mais tu peux en choisir un autre si tu veux.`
                    } >
                    
                    </ChatMessage>

                      <EaseUp>
                      {
                        <Card>
                          <CardContent>
                            <SubTopicList>
                                {
                                <div>
                                  <p>
                                  Pour rappel, voici une liste de mots interrogatifs que tu pourrais utiliser :
                                </p>
                                <ul>
                                  <li>Quel.s/ Quelle.s</li>
                                  <li>Pourquoi</li>
                                  <li>Comment</li>
                                  <li>Combien</li>
                                  <li>...</li>
                                    </ul>
                                    </div>
                                
                                }
                              </SubTopicList>
                          </CardContent>
                        </Card>
                      }
                      </EaseUp>
                      {/*input keyword and freezed if submitted*/}
                      <TextField value={question} onChange={handleChangeQuestion} id="standard-basic" label="Mets ta question ici" fullWidth />

                      <ContentButtonWrapper>
                      <Button onClick={nextQuestion} variant="contained" disabled={!question}>Soumettre</Button>
                    </ContentButtonWrapper>

                    </>

                }
              
                { // Show the final keyword input if the question index is 5
                showQuestions && questionIndex  === 5 &&
                <>
                <ChatMessage text={
                  `Maintenant essaie de formuler ta question tout seul, comme on s'est entrainés à faire ensemble.`
                } />
                <ChatMessage text={
                  `D'abord, trouve un mot-clé du texte qui te rend curieux et écris-le ici : `
                } />
                        
                <TextField id="standard-basic" label="Mets ton mot-clé ici" fullWidth onChange={handleChangeKeyword} />

                <ContentButtonWrapper>
                  <Button onClick={freezeWord1} variant="contained" disabled={!keyword}>OK</Button>
                </ContentButtonWrapper>
                </>
                } 

                { // Show the final linkword input if the question index is 5
                showQuestions && questionIndex  === 5 && isEditable1 === false &&
                <>
                <ChatMessage text={
                  `Super ! Maintenant écris ce à quoi te fait penser ce mot-clé :`
                } />
                        
                <TextField id="standard-basic" label="Mets ton idée ici" fullWidth onChange={handleChangeLinkword} />

                <ContentButtonWrapper>
                  <Button onClick={freezeWord2} variant="contained" disabled={!linkword}>OK</Button>
                </ContentButtonWrapper>
                </>
                } 

                { // Show the final question input if the question index is 5
                showQuestions && questionIndex  === 5 && isEditable2 === false &&
                <>
                <ChatMessage text={
                  `Parfait ! Tu peux maintenant formuler ta question grâce à ces mots :`
                } />
                        
                <TextField id="standard-basic" label="Mets ta question ici" fullWidth onChange={handleChangeLinkword} />

                <ContentButtonWrapper>
                  <Button onClick={nextQuestion} variant="contained" disabled={!linkword}>Valider</Button>
                </ContentButtonWrapper>
                </>
                } 
                <div ref={messagesEndRef} />
                </>
              }
          </ContentWrapper>
        </ResizeHorizon>
      </Resize>
    </div>
  </div>
}