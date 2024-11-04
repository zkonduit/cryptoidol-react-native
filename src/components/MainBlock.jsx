import React, { useEffect, useState } from 'react'
import { Button, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import CustomCanvas from './canvas/CustomCanvas'
import ConfettiComponent from './ConfettiComponent'
import AudioScoring from './AudioScoring'
import { Recording } from './Recording'
import { ScoreResult } from './ScoreResult'
import { PublishScore } from './PublishScore'
import { preloadModel } from '../audio/audioClassifier'
import { setupModelProver } from '../prover/setupModelProver'
import DebugControls from './DebugButton'

const MainBlock = () => {
  const [state, setState] = useState('start')
  const [renderAvatar, setRenderAvatar] = useState(false) // TODO - set this to true after testing
  const [recordingPath, setRecordingPath] = useState(null)
  const [recordingScore, setRecordingScore] = useState(null)
  const [preprocessedRecordingData, setPreprocessedRecordingData] = useState(null)

  const scoreRecording = (recordingPath) => {
    setRecordingPath(recordingPath)
    setState('scoring')
    console.debug('Recording Submitted for Scoring')
  }

  const onScoringFinished = (processedData, score) => {
    setPreprocessedRecordingData(processedData)
    setRecordingScore(score)
    setState('scored')
    console.debug('Audio Scoring Result:', score)
  }

  useEffect(() => {

    preloadModel().catch(error => console.error('Error preloading model:', error))
    setupModelProver().catch(error => console.error('Error preparing model prover:', error))

  }, [])


  return (
    <SafeAreaView style={{ flex: 1 }}>

      {
        <DebugControls state={state} onFinished={() => setState('minted')} renderAvatar={renderAvatar}
                       onRenderSelected={(selection) => setRenderAvatar(selection)} /> // TODO - remove this button after testing

      }


      <CustomCanvas state={state} renderAvatar={renderAvatar} />

      {
        state === 'minted' &&
        <ConfettiComponent />
        // TODO - also show the NFT image as in the web version
      }


      {(state === 'recording' || state === 'start' || state === 'listening' || state === 'recorded') && (
        <Recording onSubmit={scoreRecording} state={state} setState={setState} />
      )
      }
      {state === 'scoring' && (
        <AudioScoring onCancel={() => setState('recording')} recording={recordingPath} onFinished={onScoringFinished} />
        // <Button title="Finish" onPress={() => setState('result')} />
      )
      }
      {
        state === 'scored' && (
          <ScoreResult score={recordingScore} onRetryRecording={() => setState('recording')}
                       onShare={() => setState('sharing')} />
        )
      }
      {
        state === 'sharing' && (
          <PublishScore score={recordingScore} onPublish={() => setState('minted')}
                        preprocessedRecordingData={preprocessedRecordingData} />
        )
      }
      {
        state === 'minted' && (
          <View style={styles.finishedContainer}>
            <Text style={styles.finishedText}>Score successfully published! 🎉</Text>
            <Button onPress={() => setState('recording')} title={'Record Again'} />
          </View>
        )
      }
    </SafeAreaView>
  )
}

export default MainBlock


const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
  },
  textContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  sentenceText: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 28,
    paddingHorizontal: 15,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cancelButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: '#E53E3E',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  finishedContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  finishedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#38a169',
  },
})
