import React, {
  useContext,
  useMemo,
  useState,
  createContext,
  useEffect,
  useCallback,
} from 'react';

const DUMMY_DATA = [
  {
    id: 17,
    createdAt: '2022-04-18T05:11:50.537Z',
    updatedAt: '2022-04-18T05:15:34.147Z',
    name: 'Genie 5',
    thumbnail:
      'https://d1dppjm4v1py41.cloudfront.net/400x0/common/avt-cute1-52a3d1f28d09238b.jpg',
    hashtag: null,
    categoryId: null,
    data: {
      duration: 201.142857,
      audioLink:
        'https://audio.meetyourgenie.com/threads/bite20me20clean20-20neffex-d7b76a21f3fbf66f.mp3',
    },
    isActive: true,
    userId: null,
    user: null,
  },
  {
    id: 18,
    createdAt: '2022-04-18T05:12:20.281Z',
    updatedAt: '2022-04-18T05:15:27.443Z',
    name: 'Genie 4',
    thumbnail:
      'https://d1dppjm4v1py41.cloudfront.net/400x0/common/avt-cute-d7b294b84369eb82.jpg',
    hashtag: null,
    categoryId: null,
    data: {
      duration: 138.997551,
      audioLink:
        'https://audio.meetyourgenie.com/threads/breeze20-20telecasted-eb7c91f09f63dae6.mp3',
    },
    isActive: true,
    userId: null,
    user: null,
  },
  {
    id: 21,
    createdAt: '2022-04-18T05:15:15.591Z',
    updatedAt: '2022-04-18T05:15:15.591Z',
    name: 'Genie 3',
    thumbnail:
      'https://d1dppjm4v1py41.cloudfront.net/400x0/common/avt-cute-3-a96bb92be439ec63.jpg',
    hashtag: null,
    categoryId: null,
    data: {
      duration: 176.117551,
      audioLink:
        'https://audio.meetyourgenie.com/threads/thats20what20it20takes20instrumental20-20neffex-5b04315475bbf5a6.mp3',
    },
    isActive: true,
    userId: null,
    user: null,
  },
  {
    id: 20,
    createdAt: '2022-04-18T05:14:42.041Z',
    updatedAt: '2022-04-18T05:14:42.041Z',
    name: 'Genie 2',
    thumbnail:
      'https://d1dppjm4v1py41.cloudfront.net/400x0/common/avt-cute-4-75342d8d64ffc5f9.jpg',
    hashtag: null,
    categoryId: null,
    data: {
      duration: 183.614694,
      audioLink:
        'https://audio.meetyourgenie.com/threads/its20only20worth20it20if20you20work20for20it20instrumental20-20neffex-f2c6f71d094e86d1.mp3',
    },
    isActive: true,
    userId: null,
    user: null,
  },
  {
    id: 19,
    createdAt: '2022-04-18T05:13:38.889Z',
    updatedAt: '2022-04-18T05:13:38.889Z',
    name: 'Genie 1',
    thumbnail:
      'https://d1dppjm4v1py41.cloudfront.net/400x0/common/avt-cute-2-d6b753efe8074585.jpg',
    hashtag: null,
    categoryId: null,
    data: {
      duration: 155.297959,
      audioLink:
        'https://audio.meetyourgenie.com/threads/dont20wanna20let20myself20down20instrumental20-20neffex-833a9fa8a12959a2.mp3',
    },
    isActive: true,
    userId: null,
    user: null,
  },
];

export const AudioEditorContext = createContext();

export const useSpeed = () => {
  const { speed, setSpeed } = useContext(AudioEditorContext);
  return [speed, setSpeed];
};

export const useAudioEffect = () => {
  const { audioEffect, setAudioEffect } = useContext(AudioEditorContext);
  return [audioEffect, setAudioEffect];
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
  initSpeed = 1,
  initialRightHandlePosition,
  initialLeftHandlePosition,
  children,
  audioList = DUMMY_DATA,
  loadMoreAudio,
  onRefreshBackgroundAudio,
  audioUri,
}) => {
  const [speed, setSpeed] = useState(initSpeed);
  const [audioEffect, setAudioEffect] = useState();
  const [result, setResult] = useState();
  const [backgroundAudio, setBackgroundAudio] = useState(null);
  const [bgVolumn, setBGVolumn] = useState(0.5);
  const [duration, setDuration] = useState(0);
  const [trimmerLeftHandlePosition, setTrimmerLeft] = useState(0);
  const [trimmerRightHandlePosition, setTrimmerRight] = useState(2000);

  const [trimmerLeftHandlePositionBG, setTrimmerLeftBG] = useState(0);
  const [trimmerRightHandlePositionBG, setTrimmerRightBG] = useState(2000);

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
    ],
  );

  return (
    <AudioEditorContext.Provider value={data}>
      {children}
    </AudioEditorContext.Provider>
  );
};
