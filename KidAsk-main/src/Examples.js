import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, Card, Slider, CardContent, AppBar, Toolbar, Typography } from '@material-ui/core';
import ChatMessage from './components/ChatMessage';
import useStyles from './useStyles';

import { GridLayoutItem } from './css/styled';

import { Resize,  ResizeHorizon } from "react-resize-layout";

function valuetext(value) {
  return `${value}°C`;
}

function Examples() {
  const classes = useStyles()

  
  return (
    <div>
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            News
          </Typography>
        </Toolbar>
      </AppBar>

      <ChatMessage
        big
        text="Thank you for doing this exercice with me! We are now going to explore you second favourite topic. But first, can you help me answer this short quiz about it?" />

      <ChatMessage text="What's a robot's component which function can be compared to a human's brain?">
        <Card variant="outlined">
          <CardContent>
            <Grid>
              <Button variant="contained">Je veux essayer de répondre à cette question question</Button>
              <Button variant="contained">Je ne sais pas, je veux passer cette question</Button>
            </Grid>
          </CardContent>
        </Card>
      </ChatMessage>

      <ChatMessage reversed text="What's a robot's component which function can be compared to a human's brain?" />

      <div style={{ position: "relative", height: '100vh' }}>
        <Resize handleWidth="5px" handleColor="#ddd">
          <ResizeHorizon  width="calc(100vw/6)">
            <h1>blabla</h1>
          </ResizeHorizon  >
          <ResizeHorizon  width="calc(100vw/6)">
            <h1>blabla</h1>
          </ResizeHorizon  >
          <ResizeHorizon  >
            <ChatMessage text="What's a robot's component which function can be compared to a human's brain?">
              <Card variant="outlined">
                <CardContent>
                  <Grid>
                    <Button variant="contained">Je veux essayer de répondre à cette question question</Button>
                    <Button variant="contained">Je ne sais pas, je veux passer cette question</Button>
                  </Grid>
                </CardContent>
              </Card>
            </ChatMessage>

            <ChatMessage reversed text="What's a robot's component which function can be compared to a human's brain?" />
          </ResizeHorizon  >
          
        </Resize>
      </div>
      <ChatMessage text="Awesome! You can choose the one answer that you think is correct from the following:">
        <Card variant="outlined">
          <FormControl component="fieldset" className={classes.formControl}>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox color="primary"
                checked={true}  name="gilad" />}
                label="Gilad Gray"
              />
              <FormControlLabel
                control={<Checkbox  color="primary"
                name="jason" />}
                label="Jason Killian"
              />
              <FormControlLabel
                control={<Checkbox color="primary"
                name="antoine" />}
                label="Antoine Llorca"
              />
            </FormGroup>
          </FormControl>
          <Grid>
            <Button variant="contained">Submit</Button>
            <Button variant="contained">I don't know</Button>
          </Grid>
        </Card>
      </ChatMessage>

      <ChatMessage text="What's a robot's component which function can be compared to a human's brain?">
        <Card variant="outlined">
          <Slider
            defaultValue={30}
            getAriaValueText={valuetext}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={10}
            max={110}
          />
        </Card>
      </ChatMessage>

      <Button variant="contained">Next</Button>
    </div>
  );
}

export default Examples;
