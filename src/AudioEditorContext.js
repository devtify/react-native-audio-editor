import React, {
  useContext,
  useMemo,
  useState,
  createContext,
  useEffect,
  useCallback,
} from 'react';
import { LOCALES } from './utils/locales';
import { THEMES } from './utils/themes';

const DUMMY_DATA = [];

export const AudioEditorContext = createContext();

export const useSpeed = () => {
  const { speed, setSpeed } = useContext(AudioEditorContext);
  return [speed, setSpeed];
};

export const useAudioEffect = () => {
  const { audioEffect, setAudioEffect } = useContext(AudioEditorContext);
  return [audioEffect, setAudioEffect];
};

export const useThemes = () => {
  const { themes } = useContext(AudioEditorContext);
  return themes;
};

export const useLocales = () => {
  const { locales } = useContext(AudioEditorContext);
  return locales;
};

export const useBackgroundAudio = () => {
  const {
    audioList,
    backgroundAudio,
    onRefreshBackgroundAudio,
    loadMoreAudio,
    setBackgroundAudio,
    trimmerLeftHandlePositionBG,
    trimmerRightHandlePositionBG,
    setTrimmerLeftBG,
    setTrimmerRightBG,
    bgVolumn,
    setBGVolumn,
    duration,
  } = useContext(AudioEditorContext);
  return {
    onRefreshBackgroundAudio,
    backgroundAudio,
    loadMoreAudio,
    audioList,
    setBackgroundAudio,
    trimmerLeftHandlePositionBG,
    trimmerRightHandlePositionBG,
    setTrimmerLeftBG,
    setTrimmerRightBG,
    bgVolumn,
    setBGVolumn,
    duration,
  };
};

export const AudioEditorContextProvider = ({
  initialSpeed = 1,
  initialRightHandlePosition = 2000,
  initialLeftHandlePosition = 0,
  initialRightHandlePositionBG = 2000,
  initialLeftHandlePositionBG = 0,
  initialbgVolumn = 0.5,
  children,
  audioList = DUMMY_DATA,
  loadMoreAudio,
  onRefreshBackgroundAudio,
  audioUri,
  themes,
  locales,
  initialAudioEffect,
  defaultResult,
  initialBackgroundAudio,
}) => {
  const [_themes] = useState(themes || THEMES);
  const [_locales] = useState(locales || LOCALES);
  const [speed, setSpeed] = useState(initialSpeed);
  const [audioEffect, setAudioEffect] = useState(initialAudioEffect);
  const [result, setResult] = useState(defaultResult);
  const [backgroundAudio, setBackgroundAudio] = useState(
    initialBackgroundAudio,
  );
  const [bgVolumn, setBGVolumn] = useState(initialbgVolumn);
  const [duration, setDuration] = useState(0);
  const [trimmerLeftHandlePosition, setTrimmerLeft] = useState(
    initialLeftHandlePosition,
  );
  const [trimmerRightHandlePosition, setTrimmerRight] = useState(
    initialRightHandlePosition,
  );

  const [trimmerLeftHandlePositionBG, setTrimmerLeftBG] = useState(
    initialLeftHandlePositionBG,
  );
  const [trimmerRightHandlePositionBG, setTrimmerRightBG] = useState(
    initialRightHandlePositionBG,
  );

  const _setDuration = useCallback(
    (_duration) => {
      setDuration(_duration * 1000);
      setTrimmerRight(_duration * 1000);
    },
    [setDuration, setTrimmerRight],
  );

  const data = useMemo(
    () => ({
      speed,
      setSpeed,
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      setTrimmerLeft,
      setTrimmerRight,
      backgroundAudio,
      setBackgroundAudio,
      loadMoreAudio,
      onRefreshBackgroundAudio,
      audioList,
      trimmerLeftHandlePositionBG,
      trimmerRightHandlePositionBG,
      setTrimmerLeftBG,
      setTrimmerRightBG,
      bgVolumn,
      setBGVolumn,
      audioUri,
      duration,
      setDuration: _setDuration,
      result,
      setResult,
      audioEffect,
      setAudioEffect,
      themes: _themes,
      locales: _locales,
    }),
    [
      speed,
      backgroundAudio,
      trimmerLeftHandlePosition,
      trimmerRightHandlePosition,
      audioList,
      loadMoreAudio,
      onRefreshBackgroundAudio,
      trimmerLeftHandlePositionBG,
      trimmerRightHandlePositionBG,
      setTrimmerLeftBG,
      setTrimmerRightBG,
      bgVolumn,
      setBGVolumn,
      audioUri,
      duration,
      _setDuration,
      result,
      setResult,
      audioEffect,
      setAudioEffect,
      _themes,
      _locales,
    ],
  );

  return (
    <AudioEditorContext.Provider value={data}>
      {children}
    </AudioEditorContext.Provider>
  );
};
