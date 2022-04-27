import PropTypes from 'prop-types';
import React from 'react';
import {
  TouchableHighlight,
  Animated,
  Text,
  View,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Icons from '../assets/Icons';

const Button = ({
  selected,
  loading,
  children,
  icon,
  onPress,
  style,
  iconStyle,
}) => {
  return (
    <TouchableHighlight underlayColor="transparent" onPress={onPress}>
      <View style={[styles.btn, selected && styles.selected, style]}>
        {icon && !loading && (
          <Image
            style={[styles.icon, selected && styles.selectedIcon, iconStyle]}
            source={Icons[icon]}
          />
        )}
        {!loading && (
          <Text style={[styles.text, selected && styles.selectedText]}>
            {children}
          </Text>
        )}
        {!!loading && <ActivityIndicator />}
      </View>
    </TouchableHighlight>
  );
};

Button.propTypes = {
  onPress: PropTypes.func.isRequired,
  icon: PropTypes.string,
};

Button.defaultProps = {};

export default Button;

const styles = StyleSheet.create({
  btn: {
    backgroundColor: '#ffffff10',
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
  selected: {
    backgroundColor: '#FFCA28',
  },
  selectedText: {
    color: '#061A31',
  },
  selectedIcon: {
    tintColor: '#061A31',
  },
});
