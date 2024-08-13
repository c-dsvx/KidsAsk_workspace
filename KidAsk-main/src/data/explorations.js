import Papa from 'papaparse';

import { topicKeys, topicLabels } from "./topics"
 
export const getVideos = async () => {
  const response = await fetch('/videos.csv')
  let reader = response.body.getReader();
  let decoder = new TextDecoder('utf-8');

  const result = await reader.read()
  const decodedData = decoder.decode(result.value);
  const { data: csvData } = await Papa.parse(decodedData)

  return csvData.slice(1).filter(e => !!e && !!e[0]).reduce((ac, e) => {
    const topicKey = topicKeys[e[0].trim()]
    const subTopicKey = e[1]

    const videoURL = e[6]

    if ( ac[topicKey] ) {
      if (ac[topicKey][subTopicKey]) {
        return {
          ...ac,
          [topicKey]: {
            ...ac[topicKey],
            [subTopicKey] : [
              ...ac[topicKey][subTopicKey],
              {
                label: e[2],
                icon: `/pics-intervention-expl/${e[0]}/${e[2].replace(/'/g, '_')}.jpg`,
                vd: videoURL,
                show: e[5].toLowerCase() === 'oui'
              }
            ]
          }
        }
      } else {
        return {
          ...ac,
          [topicKey]: {
            ...ac[topicKey],
            [subTopicKey] : [
              {
                label: e[2],
                icon: `/pics-intervention-expl/${e[0]}/${e[2].replace(/'/g, '_')}.jpg`,
                vd: videoURL,
                show: e[5].toLowerCase() === 'oui'
              }
            ]
          }
        }
      }
    } else {
      return {
        ...ac,
        [topicKey]: {
          [subTopicKey]: [
            {
              label: e[2],
              icon: `/pics-intervention-expl/${e[0]}/${e[2].replace(/'/g, '_')}.jpg`,
              vd: videoURL,
              show: e[5].toLowerCase() === 'oui'
            }
          ]
        }
      }
    }
  }, {})
} 

export default {
 "robotique-ia": {
     "Composition d'un robot": [
       {
         label: "Définition de la robotique",
         icon: "/pics-intervention-expl/Les robots intelligents/Définition de la robotique.jpg",
         vd: "/videos/Définition de la robotique.mp4",
         show: true
       },
       {
        label: "Composants principaux d'un robot",
        icon: "/pics-intervention-expl/Les robots intelligents/Composants principaux d_un robot.jpg",
        vd: "/videos/Composants principaux d_un robot.mp4",
        show: false
      },
      {
        label: "L'intelligence des robots",
        icon: "/pics-intervention-expl/Les robots intelligents/L_intelligence des robots.jpg",
        vd: "/videos/Définition de la robotique.mp4",
        show: false
      }
     ]
   },
}