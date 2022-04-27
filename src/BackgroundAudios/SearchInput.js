import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Keyboard,
  Text,
} from 'react-native';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';

const SearchInput = ({
  containerStyle,
  style,
  unFocusBackground,
  isShadow,
  onChange,
  onSearch = () => {},
  onFocus,
  onBlur,
  placeholder,
  hasSearchIcon,
  hasCancelButton,
  isCenter,
  defaultValue,
  children,
  onCancel,
}) => {
  const [isFocus, setIsFocus] = useState(false);
  const ref = useRef(null);
  const _onFocus = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFocus(true);
    onFocus && onFocus();
  };

  const _onBlur = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsFocus(false);
    onBlur && onBlur();
  };

  const onChangeText = useCallback(debounce(onChange, 300), [onChange]);

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.vTextInput, style]}>
        <View
          style={[
            styles.contentInput,
            unFocusBackground && {
              backgroundColor: !isFocus
                ? unFocusBackground
                : 'rgba(255,255,255,0.2)',
            },
            isShadow && styles.shadow,
          ]}
        >
          <TextInput
            style={[
              styles.input,
              hasSearchIcon && {
                paddingLeft: 15,
              },
              {
                flex: isCenter && !isFocus ? -1 : 1,
                textAlign: isCenter && !isFocus ? 'center' : 'left',
              },
            ]}
            ref={ref}
            defaultValue={defaultValue}
            underlineColorAndroid="transparent"
            placeholder={placeholder}
            placeholderTextColor="rgba(255,255,255,0.2)"
            returnKeyType="search"
            onChangeText={onChangeText}
            onSubmitEditing={(event) => onSearch(event.nativeEvent.text || '')}
            onFocus={_onFocus}
            onBlur={_onBlur}
            onenter
            autoCorrect={false}
          />
          {children}
        </View>
      </View>
    </View>
  );
};

SearchInput.propTypes = {
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  isShadow: PropTypes.bool,
  unFocusBackground: PropTypes.string,
  onCancel: PropTypes.func,
  onBlur: PropTypes.func,
  onSearch: PropTypes.func,
  style: PropTypes.any,
  containerStyle: PropTypes.any,
  placeholder: PropTypes.string,
  hasSearchIcon: PropTypes.bool,
  hasCancelButton: PropTypes.bool,
  isCenter: PropTypes.bool,
  defaultValue: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 15,
  },
  vTextInput: {
    flex: 1,
    height: 40,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentInput: {
    flex: 1,
    paddingLeft: 15,
    borderRadius: 10,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  shadow: {
    shadowColor: 'rgba(0, 0, 0, 0.15)',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowRadius: 4,
    shadowOpacity: 1,
    elevation: 4,
  },
  input: {
    color: '#ffff',
    fontSize: 12,
    height: 40,
    paddingHorizontal: 10,
  },
  icon: {
    color: '#ffff',
  },
  button: {
    borderRadius: 0,
    backgroundColor: 'transparent',
    fontSize: 17,
    // position: 'absolute',
    // right: 15,
    color: '#ffff',
    transform: [{ translateY: 1 }],
    marginRight: 15,
  },
});

export default SearchInput;
