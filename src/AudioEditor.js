import React, { useRef, useEffect, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  TouchableHighlight,
  Text,
  StyleSheet,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Video from 'react-native-video';
import Trimmer from './Trimmer';
import Icons from './assets/Icons';
import Button from './Button';
import Actions from './Actions';
import {
  AudioEditorContext,
  AudioEditorContextProvider,
} from './AudioEditorContext';
import BackgroundAudioPreview from './BackgroundAudios/BackgroundAudioPreview';
import { makeBackgroundAudio, trimAudio } from './utils/audioProducerUtils';

const _minimumTrimDuration = 1000;

const _initialLeftHandlePosition = 0;
const _initialRightHandlePosition = 36000;

const _scrubInterval = 50;
let scrubberInterval = null;

const AudioTrimmer = ({ playling, setPlayling, onChangeSeek }) => {
  const {
    trimmerLeftHandlePosition,
    setTrimmerLeft,
    trimmerRightHandlePosition,
    setTrimmerRight,
    backgroundAudio,
    duration,
    speed,
  } = useContext(AudioEditorContext);

  const [scrubberPosition, setScrubberPosition] = useState(
    trimmerLeftHandlePosition,
  );

  const onHandleChange = (e) => {
    setTrimmerLeft(e.leftPosition);
    setTrimmerRight(e.rightPosition);
  };

  const onScrubbingComplete = (e) => {};

  useEffect(() => {
    let scrubberInterval = null;
    if (!playling) {
      setScrubberPosition(trimmerLeftHandlePosition);
    } else {
      setScrubberPosition(trimmerLeftHandlePosition);
      scrubberInterval = setInterval(() => {
        setScrubberPosition((old) => {
          if (old + _scrubInterval >= trimmerRightHandlePosition) {
            setPlayling(false);
            clearInterval(scrubberInterval);
            return trimmerLeftHandlePosition;
          }
          return old + _scrubInterval * speed;
        });
      }, _scrubInterval);
    }
    return () => {
      if (scrubberInterval) {
        clearInterval(scrubberInterval);
        scrubberInterval = null;
      }
    };
  }, [playling]);

  return (
    <Trimmer
      onHandleChange={onHandleChange}
      totalDuration={duration}
      trimmerLeftHandlePosition={trimmerLeftHandlePosition}
      trimmerRightHandlePosition={trimmerRightHandlePosition}
      minimumTrimDuration={_minimumTrimDuration}
      maxTrimDuration={duration}
      maximumZoomLevel={200}
      zoomMultiplier={20}
      initialZoomValue={1}
      scaleInOnInit={false}
      tintColor="#FFCA28"
      markerColor="#ffffff"
      trackBackgroundColor="#ffffff10"
      trackBorderColor="#ffffff10"
      scrubberColor="#FFCA28"
      scrubberPosition={scrubberPosition}
      onScrubbingComplete={onScrubbingComplete}
      onLeftHandlePressIn={() => console.log('onLeftHandlePressIn')}
      onRightHandlePressIn={() => console.log('onRightHandlePressIn')}
      onScrubberPressIn={() => console.log('onScrubberPressIn')}
    />
  );
};

const AudioEditorUI = (props) => {
  const [loading, setLoading] = useState(false);
  const [playling, setPlayling] = useState(false);
  const ref = useRef();
  const refResult = useRef();
  const {
    backgroundAudio,
    setDuration,
    trimmerLeftHandlePosition,
    audioUri,
    trimmerRightHandlePosition,
    duration,
    result,
    setResult,
    bgVolumn,
    speed,
    trimmerLeftHandlePositionBG,
    trimmerRightHandlePositionBG,
    audioEffect,
  } = useContext(AudioEditorContext);

  const playScrubber = () => {
    setLoading(true);
    if (backgroundAudio) {
      makeBackgroundAudio(
        {
          volumn: bgVolumn,
          start: trimmerLeftHandlePositionBG / 1000,
          end: trimmerRightHandlePositionBG / 1000,
          uri: backgroundAudio?.data?.audioLink,
        },
        {
          uri: audioUri,
          speed,
          start: trimmerLeftHandlePosition / 1000,
          end: trimmerRightHandlePosition / 1000,
          audioEffect,
        },
      )
        .then((e) => {
          setResult(e);
          setPlayling(true);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
      return;
    }
    trimAudio({
      uri: audioUri,
      speed,
      start: trimmerLeftHandlePosition / 1000,
      end: trimmerRightHandlePosition / 1000,
      audioEffect,
    })
      .then((e) => {
        setResult(e);
        setPlayling(true);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const pauseScrubber = () => {
    setPlayling(false);
  };

  const onChangeSeek = (e) => {
    ref.current?.seek?.(e / 1000);
    refResult.current?.seek?.(0);
  };

  console.log('result', result);
  return (
    <SafeAreaView style={styles.wrapper}>
      <Video
        ignoreSilentSwitch="ignore"
        source={{
          uri: audioUri,
        }}
        audioOnly
        onEnd={() => {}}
        onSeek={(e) => console.log(e)}
        paused={true}
        onLoad={(e) => {
          !duration && setDuration(e.duration);
        }}
      />
      {!!result && playling && (
        <Video
          ignoreSilentSwitch="ignore"
          source={{
            uri: result,
          }}
          audioOnly
          ref={refResult}
          onEnd={() => {
            console.log('onEnd');
          }}
          onProgress={(e) => console.log('onProgress')}
          onLoad={(e) => console.log(e)}
          onSeek={(e) => console.log(e)}
        />
      )}
      {duration ? (
        <View style={styles.container}>
          <View style={styles.centerContent}>
            <AudioTrimmer
              onChangeSeek={onChangeSeek}
              playling={!!result && playling}
              setPlayling={setPlayling}
            />
            {!!backgroundAudio && (
              <BackgroundAudioPreview playling={playling} />
            )}
            <Button
              onPress={playling ? pauseScrubber : playScrubber}
              icon={playling ? 'pause' : 'play'}
              loading={loading}
            >
              {playling ? 'Pause' : 'Play'}
            </Button>
          </View>
          <Actions />
        </View>
      ) : null}
    </SafeAreaView>
  );
};

const AudioEditor = ({
  initSpeed,
  audioUri = 'https://audio.meetyourgenie.com/threads/tai-sao-nguoi-tre-lai-thich-dau-tu-tai-chinh-7f89d276f0e56118.mp3',
  ...props
}) => {
  return (
    <AudioEditorContextProvider initSpeed={initSpeed} audioUri={audioUri}>
      <AudioEditorUI {...props} />
    </AudioEditorContextProvider>
  );
};

AudioEditor.propTypes = {
  audioUri: PropTypes.string,
  initSpeed: PropTypes.number,
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: '#061A31',
    width: Dimensions.get('window').width,
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  btn: {
    backgroundColor: '#ffffff10',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    height: 32,
    borderRadius: 10,
  },
  icon: {
    width: 15,
    height: 15,
    resizeMode: 'contain',
    marginRight: 10,
  },
  text: {
    color: 'white',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 300,
  },
});

export default AudioEditor;
