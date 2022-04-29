import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import {
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import Icons from '../assets/Icons';
import { useThemes } from '../AudioEditorContext';
import Button from '../Button';
import { formatTime } from '../utils';

const PlaylistCard = ({ isPlay, setPlay, style, selected, item, onPress }) => {
  const themes = useThemes();
  const styles = useMemo(() => genStyles(themes), [themes]);

  return (
    <TouchableOpacity onPress={() => onPress(item)}>
      <View style={styles.wrapper}>
        <Image style={styles.thumbnail} source={{ uri: item.thumbnail }} />
        <View style={styles.content}>
          <View>
            <Text style={styles.author} type="body3">
              {item?.author}
            </Text>
            <Text
              style={styles.title}
              type="body3Medium"
              numberOfLines={3}
              ellipsizeMode="tail"
            >
              {item.name}
            </Text>
          </View>
          <View style={styles.rowSpaceBetween}>
            <Button
              icon="play"
              style={styles.btn}
              selected={isPlay}
              onPress={() => setPlay(item, true)}
            >
              {formatTime(item?.data?.duration * 1000)}
            </Button>
            {!!selected && (
              <View style={styles.selectedLabel}>
                <Image style={styles.selectedIcon} source={Icons.checked} />
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

PlaylistCard.propTypes = {
  style: PropTypes.object,
  playlist: PropTypes.object,
  onPress: PropTypes.func,
};

PlaylistCard.defaultProps = {
  style: {},
  playlist: {},
  onPress: () => undefined,
};

const ITEM_WIDTH = (Dimensions.get('window').width - 45) / 2;
const ITEM_HEIGHT = ((Dimensions.get('window').width - 45) * 3) / 5;

const genStyles = (themes) =>
  StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      marginTop: 15,
    },
    topRight: {
      width: 32,
      height: 25,
      borderRadius: 38,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: themes.trackBackgroundColor,
    },
    rowSpaceBetween: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    content: {
      borderBottomWidth: 1,
      paddingBottom: 15,
      height: 102,
      flex: 1,
      justifyContent: 'space-between',
      borderBottomColor: themes.trackBackgroundColor,
    },
    thumbnail: {
      borderRadius: 20,
      width: 86,
      height: 86,
      marginRight: 15,
    },
    btn: {
      height: 25,
    },
    textStyle: {
      fontSize: 12,
      fontWeight: '500',
    },
    mt5: {
      marginTop: 5,
    },
    author: {
      fontSize: 14,
      color: 'white',
      opacity: 0.1,
    },
    title: {
      fontSize: 14,
      marginTop: 5,
      fontWeight: '500',
      color: 'white',
    },
    selectedLabel: {
      height: 25,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: 20,
      borderRadius: 5,
    },
    selectedIcon: {
      width: 20,
      height: 20,
      tintColor: themes.selected,
    },
  });

export default PlaylistCard;
