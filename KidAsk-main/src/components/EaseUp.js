import styled from "styled-components"

export const EaseUp = styled.div`
  @keyframes fadeInUp {
    from {
        transform: translate3d(0,40px,0)
    }

    to {
        transform: translate3d(0,0,0);
        opacity: 1
    }
  }
  animation-duration: 1s;
  animation-fill-mode: both;
  animation-name: fadeInUp;
  opacity: 0;
`