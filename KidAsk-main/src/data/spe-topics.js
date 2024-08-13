import Papa from 'papaparse';

import { topicKeys } from "./topics"
 
export const getSpeData = async () => {
  const response = await fetch('/spe-topics-csv.csv')
  let reader = response.body.getReader();
  let decoder = new TextDecoder('utf-8');

  const result = await reader.read()
  const decodedData = decoder.decode(result.value);
  const { data: csvData } = await Papa.parse(decodedData)

  return csvData.slice(1).reduce((ac, e) => {
    const topicKey = topicKeys[e[0].trim()]
    if ( ac[topicKey] ) {
      return {
        ...ac,
        [topicKey]: [
          ...ac[topicKey],
          {
            topic: e[0],
            "question": e[2],
            options: e.slice(3)
          }
        ]
      }
    } else {
      return {
        ...ac,
        [topicKey]: [
          {
            topic: e[0],
            "question": e[2],
            options: e.slice(3)
          }
        ]
      }
    }
  }, {})
} 