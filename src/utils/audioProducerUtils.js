import {
  FFmpegKit,
  FFmpegKitConfig,
  FFprobeKit,
  ReturnCode,
} from 'ffmpeg-kit-react-native';
import { Platform } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

const { dirs } = RNFetchBlob.fs;

export const EFFECT_SYNTAX = {
  indoor: { value: `aecho=0.8:0.9:40|50|70:0.4|0.3|0.2`, title: 'Indoor' },
  mountains: { value: `aecho=0.8:0.9:500|1000:0.2|0.1`, title: 'Mountains' },
  metal: { value: 'aecho=0.8:0.88:8:0.8', title: 'metal' },
  robot: {
    value: `afftfilt=real='hypot(re,im)*sin(0)':imag='hypot(re,im)*cos(0)':win_size=512:overlap=0.75`,
    title: 'robot',
  },
  whisper: {
    value: `afftfilt=real='hypot(re,im)*cos((random(0)*2-1)*2*3.14)':imag='hypot(re,im)*sin((random(1)*2-1)*2*3.14)':win_size=128:overlap=0.8`,
    title: 'whisper',
  },
  channelShift: { value: `apulsator=mode=sine:hz=0.5`, title: 'channelShift' },
  // pitchAdjust: { value: `rubberband=pitch=1.5`, title: 'pitchAdjust' },
};

const trimAudioPath = Platform.select({
  ios: `${dirs.CacheDir}/trimAudio.m4a`,
  android: `${dirs.CacheDir}/trimAudio.m4a`,
});

const bgPath = Platform.select({
  ios: `${dirs.CacheDir}/bg.m4a`,
  android: `${dirs.CacheDir}/bg.m4a`,
});

const effectUri = Platform.select({
  ios: `${dirs.CacheDir}/effect.m4a`,
  android: `${dirs.CacheDir}/effect.m4a`,
});

let path = null;

const generateNewPath = () => {
  path = Platform.select({
    ios: `${dirs.CacheDir}/recording-${new Date().getTime()}.m4a`,
    android: `${dirs.CacheDir}/recording-${new Date().getTime()}.m4a`,
  });
  return path;
};
export const makeBackgroundAudio = async (bgConfig, audioConfig) => {
  try {
    await RNFetchBlob.fs.unlink(path);
  } catch (error) {
    //
  }

  generateNewPath();

  const bgTrimResult = await trimAudio(bgConfig, bgPath);
  const audioTrimResult = await trimAudio(audioConfig, trimAudioPath);

  return FFmpegKit.execute(
    `-i "${audioTrimResult}" -i "${bgTrimResult}" -filter_complex "[0:a]volume=1dB[a0];[1:a]volume=${
      bgConfig?.volumn || 0.5
    }[a1];[a0][a1]amix=inputs=2:duration=longest[a]" -map "[a]" -ac 1 -ab 32000 -ar 22050 -strict -2 -y  ${path}`,
  )
    .then(async (session) => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        // SUCCESS
        FFmpegKit.cancel();
        return path;
      }
      if (ReturnCode.isCancel(returnCode)) {
        // CANCEL
        return null;
      }
      // ERROR
      FFmpegKit.cancel();
      return null;
    })
    .catch(() => {
      FFmpegKit.cancel();
    });
};

export const trimAudio = async (audio, resultUrl) => {
  try {
    await RNFetchBlob.fs.unlink(resultUrl || path);
  } catch (error) {
    //
  }
  if (!resultUrl) {
    resultUrl = generateNewPath();
  }

  return FFmpegKit.execute(
    `-i "${audio.uri}" -ss ${
      audio.start / (audio.speed || 1)
    } -filter_complex "[0:a]atrim=start=${audio.start}:end=${
      audio.end
    },asetpts=${Number(1 / (audio.speed || 1))}*PTS,atempo=${audio.speed || 1}${
      audio.audioEffect ? `,${audio.audioEffect}` : ''
    }[cut]" -map [cut] ${resultUrl}`,
  )
    .then(async (session) => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        // SUCCESS
        FFmpegKit.cancel();
        console.log('resultUrl', resultUrl);
        return resultUrl;
      }
      if (ReturnCode.isCancel(returnCode)) {
        // CANCEL
        return null;
      }
      // ERROR
      FFmpegKit.cancel();
      return null;
    })
    .catch(() => {
      FFmpegKit.cancel();
    });
};

export const effectIndoor = async (audioUri, resultUrl = effectUri) => {
  try {
    await RNFetchBlob.fs.unlink(resultUrl);
  } catch (error) {
    //
  }

  return FFmpegKit.execute(
    `-i "${audioUri}"  -filter_complex "aecho=0.8:0.9:40|50|70:0.4|0.3|0.2" ${resultUrl}`,
  )
    .then(async (session) => {
      const returnCode = await session.getReturnCode();
      if (ReturnCode.isSuccess(returnCode)) {
        // SUCCESS
        FFmpegKit.cancel();
        return resultUrl;
      }
      if (ReturnCode.isCancel(returnCode)) {
        // CANCEL
        return null;
      }
      // ERROR
      FFmpegKit.cancel();
      return null;
    })
    .catch(() => {
      FFmpegKit.cancel();
    });
};
