import React, { useEffect, useCallback, useState } from 'react';
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
import { useBackgroundAudio } from '../AudioEditorContext';
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
        placeholder="Search Music"
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    borderTopColor: '#ffffff10',
    borderTopWidth: 1,
    backgroundColor: '#061A31',
    flex: 1,
  },
  scrollview: {
    width: Dimensions.get('window').width,
  },
  flex1: {},
});

export default BackgroundAudioModal;
