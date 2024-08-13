import Papa from 'papaparse';

export const topicLabels = {
  "histoire-de-la-science": "Il était une fois les sciences",
  "robotique-ia": "Les robots intelligents",
  "monde-des-animaux": "Le monde des animaux",
  "univers": "L'univers",
  "proteger-nature": "Protéger la nature",
  "sports": "Les sports"
}

export const topicKeys = {
  "Il était une fois les sciences": "histoire-de-la-science",
  "Robots intelligents": "robotique-ia",
  "Le monde des animaux": "monde-des-animaux",
  "L'univers": "univers",
  "Protéger la nature": "proteger-nature",
  "Sports": "sports"
}

export const getGenData = async () => {
  const response = await fetch('/gen-topics-csv.csv')
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
            "question": e[1],
            options: e.slice(2)
          }
        ]
      }
    } else {
      return {
        ...ac,
        [topicKey]: [
          {
            topic: e[0],
            "question": e[1],
            options: e.slice(2)
          }
        ]
      }
    }
  }, {})
} 
