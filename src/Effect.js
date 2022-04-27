import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView, View, Dimensions, Text, StyleSheet } from 'react-native';
import Button from './Button';
import { useAudioEffect, useSpeed } from './AudioEditorContext';
import { EFFECT_SYNTAX } from './utils/audioProducerUtils';

const EFFECTS = Object.keys(EFFECT_SYNTAX).map((e) => EFFECT_SYNTAX[e]);

const Effect = ({ onClose }) => {
  const [audioEffect, setAudioEffect] = useAudioEffect();

  return (
    <View style={styles.container}>
      <View style={styles.headerWrapper}>
        <Text style={styles.text}>Audio Effect</Text>
        <Button
          style={styles.btnClose}
          onPress={onClose}
          iconStyle={styles.close}
          icon="close"
        ></Button>
      </View>
      <ScrollView style={styles.content}>
        <View style={styles.row}>
          {EFFECTS.map((e) => (
            <Button
              key={e.value}
              onPress={() =>
                setAudioEffect(audioEffect === e.value ? null : e.value)
              }
              style={styles.btn}
              selected={audioEffect === e.value}
            >
              {e.title}
            </Button>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
Effect.propTypes = {};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomColor: '#ffffff10',
    borderBottomWidth: 1,
    paddingVertical: 10,
  },
  container: {
    width: Dimensions.get('window').width,
    paddingHorizontal: 20,
    borderTopColor: '#ffffff10',
    borderTopWidth: 1,
  },
  content: {
    height: 100,
    paddingTop: 10,
  },
  btn: {
    height: 40,
    margin: 5,
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

export default Effect;
