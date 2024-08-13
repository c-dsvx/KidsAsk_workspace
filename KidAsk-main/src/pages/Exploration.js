import { Card, CardContent, Checkbox, FormControlLabel, LinearProgress, TextField } from "@material-ui/core";
import React, { useContext, useEffect, useRef, useState } from "react"
import Resize from "react-resize-layout/dist/Resize";
import ResizeHorizon from "react-resize-layout/dist/ResizeHorizon";
import ResizeVertical from "react-resize-layout/dist/ResizeVertical";
import { Redirect, useParams } from "react-router";
import ChatMessage from "../components/ChatMessage";
import ContentWrapper, { ContentButtonWrapper } from "../components/ContentWrapper";
import { AgentSpace, NavVideosWrapper, NavVideoWrapper, SubTopicList, SubTopicNavWrapper, SubTopicWrapper, VideoWrapper } from "../components/ExplorationUI";
import { ProgressHeader, ProgressWrapper } from "../components/Progress";
import { getVideos } from "../data/explorations";
import { topicLabels } from "../data/topics";
import { Button } from "../components/Button"
import { EaseUp } from "../components/EaseUp";
import UserContext from "../context/UserContext";
import { addUserInput } from "../services";
import firebase from "firebase/app";

export default function Exploration() {
  let { id } = useParams();
  const videoRef = useRef();
  const previousUrl = useRef('');

  const [subTopics, setSubTopics] = useState(null)

  const [selectedVideo, setSelectedVideo] = useState()

  const [currSubTopics, setCurrSubTopics] = useState()

  const [showOptions, setShowOptions] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [videoAdded, setVideoAdded] = useState(false)
  const [noVideoAdded, setNoVideoAdded] = useState(false)
  const [question, setQuestion] = useState("")
  const [asqQuestion, setAskQuestion] = useState(false)

  const [redirectToPost, setRedirectToPost] = useState(false)

  const [videoSeen, setVideoSeen] = useState([])

  const [questionAsked, setQuestionAsked] = useState(false)

  const { user } = useContext(UserContext)

  const [startTime, setStartTime] = useState(null)

  useEffect(() => {
    setStartTime(Date.now())
  }, [])


  useEffect(() => {
    ;(async () => {
      const explorations = await getVideos()
      setSubTopics( explorations[id])
      setCurrSubTopics( explorations[id] )
    })()
  }, [id])

  useEffect(() => {
    if (selectedVideo && user) {
      ;(async () => {
        await addUserInput(user.identifiant, 'exploration', `${id}/viewed-videos/${selectedVideo.label}_${Date.now()}`, {
          video: selectedVideo.label
        })
      })()
    }
  }, [selectedVideo, user])


  useEffect(() => {
    if (selectedVideo) {
      if (previousUrl.current === selectedVideo.vd) {
        return;
      }
  
      if (videoRef.current) {
        videoRef.current.load();
      }
  
      previousUrl.current = selectedVideo.vd;
    }
  }, [selectedVideo]);

  if (!subTopics || !currSubTopics) return null

  const handleQuestionChange = (e) => {
    setQuestion(e.target.value)
  }

  const countItems = Object.keys(currSubTopics).map(st => {
    return currSubTopics[st].length 
  }).reduce((ac, e) => {
    return ac + e
  }, 0)

  const doneItems = Object.keys(currSubTopics).map(st => {
    return currSubTopics[st].filter(v => v.show).length 
  }).reduce((ac, e) => {
    return ac + e
  }, 0)

  const progress = doneItems * 100 / countItems

  const handleNav = async (video) => {
    if (videoSeen.filter(e => e.label === video.label).length === 0) {
      setVideoSeen([
        ...videoSeen,
        video
      ])
    }
    setSelectedVideo(video)
  }

  const enableOptions = async () => {
    await addUserInput(user.identifiant, 'exploration', `${id}/questions/${selectedVideo.label}`, {
      video: selectedVideo.label,
      question
    })
    if (countItems - doneItems === 0) {
      setShowChat(false)
      setAskQuestion(false)
      setShowOptions(false)
      setQuestionAsked(true)
      setSelectedVideo(null)
    } else {
      setShowOptions(true)
      setShowChat(false)
      setAskQuestion(false)
      setQuestionAsked(false)
    }
  }
  

  const enableChat = async () => {
    setShowChat(true)
    setTimeout(() => {
      setAskQuestion(true)
    }, 3000)
    setVideoAdded(false)
    setNoVideoAdded(false)
    setQuestionAsked(false)
  }

  const addVideo = async(subTopic, video) => {
    setCurrSubTopics({
      ...currSubTopics,
      [subTopic]: currSubTopics[subTopic].map(v => {
        if (v.label === video.label) {
          return {
            ...v,
            show: true
          }
        } else {
          return v
        }
      })
    })
    
    setShowChat(false)
    setAskQuestion(false)
    setShowOptions(false)
    setVideoAdded(true)
    setSelectedVideo(null)
    setQuestionAsked(false)
  }

  const handleNoQuestion = () => {
    setShowChat(false)
    setAskQuestion(false)
    setShowOptions(false)
    setNoVideoAdded(true)
    setQuestionAsked(false)
  }

  const endExploration = async () => {
    await addUserInput(user.identifiant, 'exploration', `${id}/stats/duration`, {
      seconds: (Date.now() - startTime) / 1000,
      startTime:startTime,
      endTime:Date.now()
    })

    await addUserInput(user.identifiant, 'exploration', `${id}/stats/progress`, {
      progress,
      videoUnlocked: doneItems,
      total: countItems
    })

    setRedirectToPost(true)
  }


  return <div>
    {
      redirectToPost &&
      <Redirect to={`/post-exploration/${id}`} />
    }
    <div style={{ position: "relative", height: 'calc(100vh)' }}>

      <Resize handleWidth="5px" handleColor="#ddd">
        <ResizeVertical height="100px" minHeight="10px">
          <ProgressHeader>
            <div>
              <h2>Tu as encore {countItems - doneItems} ressources cachées à débloquer</h2>
              <ProgressWrapper>
                <LinearProgress height="10px" variant="determinate" value={progress} />
              </ProgressWrapper>
            </div>
            {
              videoSeen.length >= 4 &&
              <div>
               <Button onClick={endExploration} variant="contained">J'ai fini mon exploration</Button>
              </div>
            }
          </ProgressHeader>
        </ResizeVertical>
        <ResizeVertical>
          <Resize handleWidth="5px" handleColor="#ddd">
            <ResizeHorizon width="calc(100vw / 8 * 2)">
              <SubTopicNavWrapper>
                <h1>Table de contenu</h1>
                <h1>pour <strong>{topicLabels[id]}</strong></h1>

                {
                  Object.keys(currSubTopics).map(key => {
                    const st = currSubTopics[key]
                    return <SubTopicWrapper>
                      <h2>{key}</h2>
                      <NavVideosWrapper>
                        {
                          st.map(v => {
                            if (v.show) {
                              return <NavVideoWrapper onClick={() => handleNav(v)}>
                                <img src={v.icon} />
                                <h3>{v.label}</h3>
                              </NavVideoWrapper>
                            }
                          })
                        }
                      </NavVideosWrapper>
                    </SubTopicWrapper>
                  })
                }
              </SubTopicNavWrapper>
            </ResizeHorizon>
            <ResizeHorizon width="calc(100vw / 8 * 4)">
              <ContentWrapper center>
                <h1>Contenu</h1>
                {
                  selectedVideo &&
                  <>
                    <VideoWrapper>
                      <h2>{selectedVideo.label}</h2>
                      {
                        selectedVideo.yt &&
                        <iframe width="560" height="315" src={`https://www.youtube.com/embed/${selectedVideo.yt}`} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                      }
                      {
                        selectedVideo.vd &&
                        <video ref={videoRef} width="560" height="315" controls>
                          <source src={selectedVideo.vd} type="video/mp4" />
                        </video>
                      }
                    </VideoWrapper>
                    <ContentButtonWrapper>
                      <Button onClick={enableChat} variant="contained">J'ai fini la lecture</Button>
                    </ContentButtonWrapper>
                  </>
                }
              </ContentWrapper>
            </ResizeHorizon>
            <ResizeHorizon width="calc(100vw / 8 * 3)">
              {
                showOptions &&
                <AgentSpace>
                  <ChatMessage text={
                    `Super, merci pour ta question! Tu peux maintenant choisir la vidéo que tu veux débloquer:`
                  } />
                  <EaseUp>
                    <Card>
                      <CardContent>
                        
                        {
                          Object.keys(currSubTopics).map(key => {
                            const st = currSubTopics[key]
                            if (st.filter(v => !v.show).length) {
                              return <div>
                                <p>
                                  Theme: {key}
                                </p>
                                <ul>
                                  {
                                    st.map(v => {
                                      if (!v.show) {
                                        return <FormControlLabel
                                        control={
                                          <Checkbox color="primary"
                                            onChange={() => addVideo(key, v)}
                                            name="gilad" />
                                        }
                                        label={v.label}
                                      />
                                      }
                                    })
                                  }
                                </ul>
                              </div>
                            }
                          })
                        }
                      </CardContent>
                    </Card>
                  </EaseUp>
                </AgentSpace>
              }
              {
                showChat &&
                <AgentSpace>
                  <ChatMessage text={
                    countItems - doneItems === 0
                     ? `J'espère que tu as apprécié cette vidéo.`
                     : `J'espère que tu as apprécié cette vidéo. Si tu le souhaites, tu peux ouvrir d'autres vidéos depuis cette liste que j'ai pour toi:`
                  } />
                  <EaseUp>
                    {
                      countItems - doneItems > 0 &&
                      <Card>
                        <CardContent>
                          <SubTopicList>
                              {
                                Object.keys(currSubTopics).map(key => {
                                  const st = currSubTopics[key]
                                  if (st.filter(v => !v.show).length) {
                                    return <div>
                                      <p>
                                        Thème: {key}
                                      </p>
                                      <ul>
                                        {
                                          st.map(v => {
                                            if (!v.show) {
                                              return <li>{v.label}</li>
                                            }
                                          })
                                        }
                                      </ul>
                                    </div>
                                  }
                                })
                              }
                            </SubTopicList>
                        </CardContent>
                      </Card>
                    }
                  </EaseUp>

                  {
                    asqQuestion &&
                    <>
                      <ChatMessage text={
                        countItems - doneItems === 0
                        ? `Tu peux maintenant me poser une question par rapport à la vidéo que tu viens de voir si tu veux.`
                        : `Mais pour cela, tu dois d'abord me poser une question divergente sur la vidéo que tu viens de voir.`
                      } />

                      

                      <TextField onChange={handleQuestionChange} id="standard-basic" label="Mets ta question ici" fullWidth />

                      <ContentButtonWrapper>
                        <Button onClick={enableOptions} ariant="contained" disabled={!question}>Soumettre ma question</Button>
                        <Button primary onClick={handleNoQuestion}>Je n'ai pas de questions</Button>
                      </ContentButtonWrapper>
                    </>
                  }

                </AgentSpace>
              }
              {
                videoAdded &&
                <AgentSpace>
                   <ChatMessage text={
                    `J'ai ajouté la vidéo que tu as demandée dans ta table de contenu. Profite bien !`
                  } />
                   <ChatMessage text={
                    `Tu peux maintenant continuer ton exploration comme tu veux.`
                  } />
                </AgentSpace>
              }
              {
                questionAsked &&
                <AgentSpace>
                   <ChatMessage text={
                    `Tu peux maintenant continuer ton exploration comme tu veux.`
                  } />
                </AgentSpace>
            }
              {
                noVideoAdded &&
                <AgentSpace>
                   <ChatMessage text={
                    `Ok, tu peux toujours me poser des questions quand tu ouvres une nouvelle vidéo.`
                  } />
                   <ChatMessage text={
                    `Tu peux maintenant continuer ton exploration comme tu veux.`
                  } />
                </AgentSpace>
              }

            </ResizeHorizon>
          </Resize>
        </ResizeVertical>

      </Resize>
    </div>
  </div>
}
