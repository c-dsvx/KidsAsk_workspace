import React from 'react'
import useStyles from '../../useStyles';
import { Avatar, AvatarImg, ChatMessageHolder, MessageBubble, MessageHolder } from './styled';

import { ReactComponent  as RobotIcon } from './robot-appli.svg'

export default function ChatMessage({ big, text, reversed, children }) {
  const classes = useStyles();

  return <ChatMessageHolder big={big} reversed={reversed}>
    {
      !reversed &&
      <Avatar big={big} className={classes.yellow}>
        <AvatarImg>
          <RobotIcon />
        </AvatarImg>
      </Avatar>
    }
    <MessageHolder big={big}>
      <MessageBubble big={big} reversed={reversed}>
        { text }
      </MessageBubble>
      { children }
    </MessageHolder>
  </ChatMessageHolder>
}