import React, { useState, useMemo, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  LayoutAnimation,
} from 'react-native';
import Video from 'react-native-video';
import Slider from '@react-native-community/slider';
import Trimmer from '../Trimmer';
import Icons from '../assets/Icons';
import {
  useBackgroundAudio,
  useLocales,
  useThemes,
} from '../AudioEditorContext';

const BGTrimmer = ({ playling, onChangeSeek }) => {
  const themes = useThemes();
  const {
    setBackgroundAudio,
    trimmerLeftHandlePositionBG,
    trimmerRightHandlePositionBG,
    setTrimmerLeftBG,
    setTrimmerRightBG,
    backgroundAudio,
    bgVolumn,
    duration,
    setBGVolumn,
  } = useBackgroundAudio();
  const [scrubberPosition, setScrubberPosition] = useState(
    trimmerLeftHandlePositionBG,
  );

  const del = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBackgroundAudio(null);
  };

  const onHandleChange = (e) => {
    setTrimmerLeftBG(e.leftPosition);
    setTrimmerRightBG(e.rightPosition);
  };

  useEffect(() => {
    let scrubberInterval = null;
    onChangeSeek(trimmerLeftHandlePositionBG);

    if (!playling) {
      setScrubberPosition(trimmerLeftHandlePositionBG);
    } else {
      setScrubberPosition(trimmerLeftHandlePositionBG);
      scrubberInterval = setInterval(() => {
        setScrubberPosition((old) => {
          if (old + 50 > trimmerRightHandlePositionBG) {
            clearInterval(scrubberInterval);
            return old;
          }
          return old + 50;
        });
      }, 50);
    }
    return () => {
      if (scrubberInterval) {
        clearInterval(scrubberInterval);
        scrubberInterval = null;
      }
    };
  }, [playling]);

  const maxTrimDuration = useMemo(() => {
    return backgroundAudio.data?.duration * 1000 > duration
      ? duration
      : backgroundAudio.data?.duration * 1000;
  }, [duration, backgroundAudio]);

  const totalDuration = useMemo(() => {
    return backgroundAudio?.data?.duration * 1000;
  }, [backgroundAudio]);

  return (
    <Trimmer
      onHandleChange={onHandleChange}
      totalDuration={totalDuration}
      trimmerLeftHandlePosition={trimmerLeftHandlePositionBG}
      trimmerRightHandlePosition={trimmerRightHandlePositionBG}
      minimumTrimDuration={1000}
      maxTrimDuration={maxTrimDuration}
      maximumZoomLevel={20}
      zoomMultiplier={1}
      initialZoomValue={1}
      scaleInOnInit={false}
      tintColor={themes.tintColor}
      markerColor={themes.markerColor}
      trackBackgroundColor={themes.trackBackgroundColor}
      trackBorderColor={themes.trackBorderColor}
      scrubberColor={themes.scrubberColor}
      scrubberPosition={scrubberPosition}
      onScrubbingComplete={setScrubberPosition}
      onLeftHandlePressIn={() => console.log('onLeftHandlePressIn')}
      onRightHandlePressIn={() => console.log('onRightHandlePressIn')}
      onScrubberPressIn={() => console.log('onScrubberPressIn')}
    />
  );
};

const BackgroundAudioPreview = ({ playling, maxTrimDuration }) => {
  const [bgPlayling, setPlayling] = useState(false);
  const themes = useThemes();
  const locales = useLocales();
  const {
    setBackgroundAudio,
    trimmerLeftHandlePositionBG,
    trimmerRightHandlePositionBG,
    setTrimmerLeftBG,
    setTrimmerRightBG,
    backgroundAudio,
    bgVolumn,
    setBGVolumn,
  } = useBackgroundAudio();
  const ref = useRef();
  const [scrubberPosition, setScrubberPosition] = useState(
    trimmerLeftHandlePositionBG,
  );

  const styles = useMemo(() => genStyles(themes), [themes]);

  const del = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setBackgroundAudio(null);
  };

  const onChangeSeek = (e) => {
    ref.current.seek(e / 1000);
    if (e >= trimmerRightHandlePositionBG) {
      setPlayling(false);
    }
  };

  useEffect(() => {
    if (!playling) {
      setPlayling(false);
    } else {
      setPlayling(true);
    }
  }, [playling]);

  return (
    <View style={styles.container}>
      <View style={styles.overlay} />
      <View style={styles.row}>
        <Text style={styles.text}>{locales.backgroundMusic}</Text>
        <TouchableOpacity onPress={del}>
          <View style={styles.delWrapper}>
            <Image source={Icons.del} style={styles.icon} />
          </View>
        </TouchableOpacity>
      </View>
      {!!backgroundAudio?.data?.duration && (
        <BGTrimmer
          playling={bgPlayling}
          onChangeSeek={onChangeSeek}
          maxTrimDuration={maxTrimDuration}
        />
      )}
      <View style={styles.row}>
        <Text style={styles.val}>0%</Text>
        <Text style={styles.val}>50%</Text>
        <Text style={styles.val}>100%</Text>
      </View>
      <View style={styles.sliderWrapper}>
        <View style={styles.thumb} />
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={1}
          value={bgVolumn}
          onValueChange={setBGVolumn}
          minimumTrackTintColor={themes.markerColor}
          maximumTrackTintColor={themes.trackBackgroundColor}
          thumbTintColor={themes.tintColor}
        />
        <View style={styles.thumb} />
      </View>
      <Video
        ignoreSilentSwitch="ignore"
        source={{
          uri: backgroundAudio?.data?.audioLink,
        }}
        audioOnly
        ref={ref}
        volume={bgVolumn}
        onEnd={() => {}}
        onSeek={(e) => console.log(e)}
        paused={!bgPlayling}
        onProgress={(e) => {
          if (e.currentTime * 1000 >= trimmerRightHandlePositionBG) {
            setPlayling(false);
          }
        }}
      />
    </View>
  );
};
BackgroundAudioPreview.propTypes = {};

const genStyles = (themes) =>
  StyleSheet.create({
    container: {
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 5,
      marginBottom: 10,
      paddingBottom: 20,
    },
    overlay: {
      backgroundColor: themes.trackBackgroundColor,
      borderRadius: 10,
      paddingVertical: 10,
      marginTop: 5,
      marginBottom: 10,
      position: 'absolute',
      top: 0,
      left: 20,
      right: 20,
      bottom: 0,
    },
    text: {
      color: 'white',
      fontSize: 14,
      fontWeight: '500',
      textAlign: 'center',
      flex: 1,
      paddingLeft: 50,
    },
    row: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      paddingHorizontal: 40,
      alignItems: 'center',
    },
    icon: {
      width: 15,
      height: 15,
      resizeMode: 'contain',
    },
    delWrapper: {
      width: 50,
      alignItems: 'flex-end',
      height: 40,
      justifyContent: 'center',
    },
    val: {
      color: 'white',
      fontWeight: '500',
      textAlign: 'center',
    },
    sliderWrapper: {
      justifyContent: 'center',
      flexDirection: 'row',
      alignItems: 'center',
    },
    slider: {
      width: Dimensions.get('window').width - 62,
      alignSelf: 'center',
    },
    thumb: {
      height: 5,
      width: 2,
      backgroundColor: 'white',
    },
    trimmer: {
      alignItems: 'center',
      justifyContent: 'center',
      width: Dimensions.get('window').width,
    },
  });

export default BackgroundAudioPreview;
