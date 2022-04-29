import React, { useEffect, useMemo, useCallback, useState } from 'react';
import Video from 'react-native-video';
import PropTypes from 'prop-types';
import {
  FlatList,
  Dimensions,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import Button from '../Button';
import {
  useBackgroundAudio,
  useLocales,
  useThemes,
} from '../AudioEditorContext';
import PlaylistCard from './PlaylistCard';
import SearchInput from './SearchInput';
import LazyLoadFlatList from '../OptimizedFlatList/LazyLoadFlatList';

const BackgroundAudioModal = ({ onClose, ...props }) => {
  const {
    loadMoreAudio,
    onRefreshBackgroundAudio,
    audioList,
    backgroundAudio,
    setBackgroundAudio,
    setTrimmerLeftBG,
    setTrimmerRightBG,
  } = useBackgroundAudio();
  const locales = useLocales();
  const themes = useThemes();
  const styles = useMemo(() => genStyles(themes), [themes]);

  const [playItem, setPlayItem] = useState(null);
  const [searchKey, setSearchKey] = useState('');
  const onSelect = (item) => {
    setPlayItem(item);
    setBackgroundAudio(item);
    setTrimmerLeftBG(0);
    setTrimmerRightBG(1000);
  };

  const renderItem = ({ item }) => (
    <PlaylistCard
      isPlay={playItem?.id === item.id}
      setPlay={() => setPlayItem(item)}
      item={item}
      onPress={onSelect}
      selected={backgroundAudio?.id === item?.id}
    />
  );

  const onRefresh = useCallback(
    () => onRefreshBackgroundAudio?.(searchKey),
    [searchKey],
  );

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  const loadMore = useCallback(() => loadMoreAudio?.(searchKey), [searchKey]);

  return (
    <View style={styles.container}>
      <SearchInput
        placeholder={locales.placeholderSearch}
        onChange={setSearchKey}
        onSearch={setSearchKey}
      />
      <LazyLoadFlatList
        data={audioList}
        renderItem={renderItem}
        loadMore={loadMore}
        isRefresh={false}
        onRefresh={onRefresh}
      />
      {!!playItem && (
        <Video
          ignoreSilentSwitch="ignore"
          source={{
            uri: playItem?.data?.audioLink,
            // Z29va1sj
          }} // Can be a URL or a local file.
          audioOnly
          onEnd={() => {
            setPlayItem(null);
          }}
          volumn={1}
        />
      )}
    </View>
  );
};
BackgroundAudioModal.propTypes = {};

const genStyles = (themes) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      borderTopColor: themes.trackBackgroundColor,
      borderTopWidth: 1,
      backgroundColor: themes.backgroundColor,
      flex: 1,
    },
    scrollview: {
      width: Dimensions.get('window').width,
    },
    flex1: {},
  });

export default BackgroundAudioModal;
