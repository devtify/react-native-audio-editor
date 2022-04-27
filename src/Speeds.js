import React from 'react';
import PropTypes from 'prop-types';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { useSpeed } from './AudioEditorContext';

const SPEEDS = [
  {
    text: '0.5X',
    value: 0.5,
  },
  {
    text: '1X',
    value: 1,
  },
  {
    text: '1.5X',
    value: 1.5,
  },
  {
    text: '2X',
    value: 2,
  },
];

const Speed = ({ onClose }) => {
  const [speed, setSpeed] = useSpeed();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Speed</Text>
      <View style={styles.row}>
        {SPEEDS.map((e) => (
          <Button
            key={e.value}
            onPress={() => setSpeed(e.value)}
            style={styles.btn}
            selected={speed === e.value}
          >
            {e.text}
          </Button>
        ))}
      </View>
      <Button
        style={styles.btnClose}
        onPress={onClose}
        iconStyle={styles.close}
        icon="close"
      ></Button>
    </View>
  );
};
Speed.propTypes = {};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    borderTopColor: '#ffffff10',
    borderTopWidth: 1,
    paddingVertical: 10,
  },
  btn: {
    width: 50,
    height: 40,
    marginHorizontal: 10,
  },
  text: {
    color: 'white',
  },
  close: {
    marginRight: 0,
    width: 10,
    height: 10,
  },
  btnClose: {
    width: 40,
    height: 40,
  },
});

export default Speed;
