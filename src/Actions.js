import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, LayoutAnimation, Text, StyleSheet } from 'react-native';
import Button from './Button';
import Speed from './Speeds';
import BackgroundAudios from './BackgroundAudios';
import Effect from './Effect';

const Actions = (props) => {
  const [action, setAction] = useState();

  const onChangeAction = (e) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAction(e);
  };
  const onClose = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setAction(null);
  };

  return (
    <View style={styles.wrapper}>
      {action === 'speed' && <Speed onClose={onClose} />}
      {action === 'music' && <BackgroundAudios onClose={onClose} />}
      {action === 'effect' && <Effect onClose={onClose} />}
      {!action && (
        <View style={styles.container}>
          <View style={styles.action}>
            <Button
              iconStyle={styles.icon}
              style={styles.btn}
              icon="speed"
              onPress={() => onChangeAction('speed')}
            ></Button>
            <Text style={styles.text}>Speed</Text>
          </View>
          <View style={styles.action}>
            <Button
              iconStyle={styles.icon}
              style={styles.btn}
              icon="music"
              onPress={() => onChangeAction('music')}
            ></Button>
            <Text style={styles.text}>Background</Text>
          </View>
          <View style={styles.action}>
            <Button
              iconStyle={styles.icon}
              style={styles.btn}
              icon="effect"
              onPress={() => onChangeAction('effect')}
            ></Button>
            <Text style={styles.text}>Effect</Text>
          </View>
        </View>
      )}
    </View>
  );
};
Actions.propTypes = {};

const styles = StyleSheet.create({
  wrapper: {
    paddingBottom: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    width: 60,
    height: 60,
  },
  action: {
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  text: {
    color: 'white',
    fontWeight: '500',
    marginTop: 10,
    fontSize: 14,
  },
  icon: {
    marginRight: 0,
    width: 20,
    height: 20,
  },
});

export default Actions;
