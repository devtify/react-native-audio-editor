import React, { useRef, useEffect, useContext, useState, useMemo } from 'react';
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
  LayoutAnimation,
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
    themes,
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
            setTimeout(() => {
              setPlayling(false);
            }, 0);
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
  console.log('themes', themes);
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
      tintColor={themes.tintColor}
      markerColor={themes.markerColor}
      trackBackgroundColor={themes.trackBackgroundColor}
      trackBorderColor={themes.trackBorderColor}
      scrubberColor={themes.scrubberColor}
      scrubberPosition={scrubberPosition}
      onScrubbingComplete={onScrubbingComplete}
      onLeftHandlePressIn={() => console.log('onLeftHandlePressIn')}
      onRightHandlePressIn={() => console.log('onRightHandlePressIn')}
      onScrubberPressIn={() => console.log('onScrubberPressIn')}
    />
  );
};

const AudioEditorUI = ({ hasSpeed, hasEffect, onCancel, onConfirm }) => {
  const [loading, setLoading] = useState(false);
  const [playling, setPlayling] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);

  const ref = useRef();

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
    themes,
    locales,
  } = useContext(AudioEditorContext);

  const styles = useMemo(() => genStyles(themes), [themes]);

  const playScrubber = () => {
    onChangeSeek(trimmerLeftHandlePosition);
    setPlayling(true);
    compressResult();
  };

  const compressResult = () => {
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
        })
        .finally(() => {
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pauseScrubber = () => {
    setPlayling(false);
  };

  const onChangeSeek = (e) => {
    ref.current?.seek?.(e / 1000);
  };

  const _onConfirm = () => {
    if (result && !loading) {
      onConfirm?.(result);
    } else {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsConfirm(true);
      !result && compressResult();
    }
  };

  useEffect(() => {
    if (isConfirm && !loading && result) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      onConfirm?.(result);
      setIsConfirm(false);
    }
  }, [isConfirm, loading, result]);

  return (
    <>
      <SafeAreaView style={styles.wrapper}>
        <Video
          ignoreSilentSwitch="ignore"
          source={{
            uri: audioUri,
          }}
          ref={ref}
          audioOnly
          onEnd={() => {}}
          paused={!playling}
          onLoad={(e) => {
            !duration && setDuration(e.duration);
          }}
        />
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
              >
                {playling ? locales.pause : locales.play}
              </Button>
            </View>
            <Actions
              onConfirm={_onConfirm}
              onCancel={onCancel}
              hasSpeed={hasSpeed}
              hasEffect={hasEffect}
            />
          </View>
        ) : null}
      </SafeAreaView>
      {isConfirm && (
        <View style={styles.overlay}>
          <ActivityIndicator />
        </View>
      )}
    </>
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
  hasEffect: PropTypes.bool,
  hasSpeed: PropTypes.bool,
};

const genStyles = (themes) =>
  StyleSheet.create({
    wrapper: {
      flex: 1,
      backgroundColor: themes.background,
      width: Dimensions.get('window').width,
    },
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      flex: 1,
    },
    btn: {
      backgroundColor: themes.trackBackgroundColor,
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
    overlay: {
      backgroundColor: 'rgba(0,0,0,0.5)',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });

export default AudioEditor;
