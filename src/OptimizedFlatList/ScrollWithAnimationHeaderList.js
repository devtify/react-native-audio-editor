import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { View, Animated, Dimensions, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { globalStyle } from 'globalStyle';
import { safeArea } from 'utils/Devices';
import Text from 'uikit/Text';
import Touchable from 'uikit/Touchable';
import FastImageLoader, { RNImageLoader } from 'uikit/FastImageLoader';
import Button from 'uikit/Button';
import StyleSheet from 'react-native-extended-stylesheet';
import LazyLoadFlatList from './LazyLoadFlatList';

const BUTTON_WIDTH = 35;
const ANDROID_PADDING_TOP = 50;

const ScrollWithAnimationHeader = ({
  title,
  style,
  children,
  image,
  heightImage,
  rightButtons,
  leftButtons,
  onPressImage,
  isHideImage,
  isHideNavBarBorder,
  transparent,
  animationHeader = true,
  shadowReverse,
  imageMirrorView,
  onRefresh,
  refreshing,
  colors,
  customHeader,
  ...props
}) => {
  const INPUT_RANGE = [-heightImage, -40, 0, 20, heightImage];
  const [scrollY] = useState(new Animated.Value(-35));
  const transform = scrollY
    ? [
        {
          translateY: scrollY.interpolate({
            inputRange: INPUT_RANGE,
            outputRange: [heightImage / 2, 0, 0, 0, -heightImage / 3],
          }),
        },
        {
          scale: scrollY.interpolate({
            inputRange: INPUT_RANGE,
            outputRange: [2, 1, 1, 1, 1],
          }),
        },
      ]
    : [];

  const numberOfButtons = Math.max(leftButtons.length, rightButtons.length);

  const opacity = !animationHeader
    ? 1
    : scrollY.interpolate({
        inputRange: INPUT_RANGE,
        outputRange: [0, 0, 0, 0, 1],
      });

  const color = !animationHeader
    ? 'black'
    : scrollY.interpolate({
        inputRange: INPUT_RANGE,
        outputRange: [
          'rgb(255,255,255)',
          'rgb(255,255,255)',
          'rgb(255,255,255)',
          'rgb(255,255,255)',
          'rgb(0,0,0)',
        ],
      });

  const BUTTONS_WIDTH = numberOfButtons * BUTTON_WIDTH;

  return (
    <View style={[styles.container, style]}>
      <RNImageLoader
        image={image}
        style={[
          styles.imageBackground,
          // scale heigh by adding heigh of backgroundSize
          { height: isHideImage ? 0 : heightImage + 10 },
          !isHideImage && { transform },
        ]}
        nativeID="headerImage"
      />
      <Animated.View
        style={[
          styles.imageBackground,
          { height: heightImage + 10 }, // scale heigh by adding heigh of backgroundSize
          { transform },
        ]}
      >
        <LinearGradient
          colors={
            colors || [
              'rgba(0, 0, 0, 0)',
              'rgba(0, 0, 0, 0)',
              'rgba(0, 0, 0, 0)',
              'rgba(0, 0, 0, 0.20)',
            ]
          }
          startPoint={{ x: 0, y: 0.75 }}
          endPoint={{ x: 0, y: 0 }}
          locations={shadowReverse ? [0, 0.2, 0.75, 1] : [1, 0.88, 0.6, 0]}
          style={[
            styles.imageBackground,
            { height: heightImage + 10 }, // scale heigh by adding heigh of backgroundSize
          ]}
        >
          {imageMirrorView}
        </LinearGradient>
      </Animated.View>
      <LazyLoadFlatList
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        scrollEventThrottle={16}
        style={styles.container}
        contentContainerStyle={globalStyle.contentContainerStyle}
        {...props}
        ListHeaderComponent={
          <>
            <Touchable onPress={() => onPressImage && onPressImage()}>
              <View
                style={{
                  height: heightImage - (Platform.OS === 'android' ? 0 : 44),
                }}
              />
            </Touchable>
            {customHeader}
          </>
        }
      />
      <Animated.View
        style={[
          globalStyle.paddingHorizontal,
          styles.headerTitle,
          isHideNavBarBorder && {
            borderBottomColor: 'transparent',
          },
          transparent && { backgroundColor: 'transparent' },
          {
            opacity,
            paddingTop: Platform.OS === 'android' ? ANDROID_PADDING_TOP - 5 : 0,
          },
        ]}
      >
        <Text
          style={{
            marginHorizontal: BUTTONS_WIDTH,
            flex: 1,
          }}
          center
          title="headline"
        >
          {title}
        </Text>
      </Animated.View>
      <Animated.View
        style={[
          globalStyle.paddingHorizontal,
          styles.headerTitle,
          {
            backgroundColor: 'transparent',
            borderBottomColor: 'transparent',
            paddingTop: Platform.OS === 'android' ? ANDROID_PADDING_TOP : 0,
          },
        ]}
      >
        <View
          style={[
            styles.row,
            {
              width: BUTTONS_WIDTH,
              alignItems: 'flex-start',
            },
          ]}
        >
          {leftButtons?.map(e => (
            <Button
              style={[
                styles.icon,
                {
                  color,
                  width: BUTTON_WIDTH,
                  height: BUTTON_WIDTH,
                  textAlign: 'left',
                },
              ]}
              ghost
              size="small"
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              {...e}
            />
          ))}
        </View>
        <View
          style={[
            styles.row,
            {
              width: BUTTONS_WIDTH,
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
            },
          ]}
        >
          {rightButtons?.map(e => (
            <Button
              style={[
                styles.icon,
                {
                  color,
                  marginLeft: 10,
                  width: BUTTON_WIDTH,
                  height: BUTTON_WIDTH,
                  textAlign: 'right',
                },
              ]}
              size="small"
              ghost
              hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
              {...e}
            />
          ))}
        </View>
      </Animated.View>
    </View>
  );
};

const { height, width } = Dimensions.get('screen');

ScrollWithAnimationHeader.propTypes = {
  children: PropTypes.any,
  heightImage: PropTypes.number,
  image: PropTypes.string,
  style: PropTypes.any,
  title: PropTypes.string,
  leftButtons: PropTypes.array,
  rightButtons: PropTypes.array,
  shadowReverse: PropTypes.bool,
  imageMirrorView: PropTypes.any,
  onPressImage: PropTypes.func,
  isHideImage: PropTypes.bool,
  isHideNavBarBorder: PropTypes.bool,
  transparent: PropTypes.bool,
  animationHeader: PropTypes.bool,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  colors: PropTypes.any,
  customHeader: PropTypes.any,
};

ScrollWithAnimationHeader.defaultProps = {
  heightImage: height / 3,
  leftButtons: [],
  rightButtons: [],
};

const HEIGHT_TITLE_INSIDE_IMAGE =
  ANDROID_PADDING_TOP + safeArea().statusBar + 25;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  imageBackground: {
    width,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  headerTitle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '$backgroundInput',
    height: HEIGHT_TITLE_INSIDE_IMAGE,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: safeArea().statusBar + 15,
    flexDirection: 'row',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 36,
    width: 36,
  },
});

export default ScrollWithAnimationHeader;
