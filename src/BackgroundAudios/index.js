import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ScrollView,
  Text,
  Dimensions,
  View,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Button from '../Button';
import BackgroundAudioModal from './BackgroundAudioModal';
import { useBackgroundAudio } from '../AudioEditorContext';

const BackgroundAudios = ({ onClose, ...props }) => {
  return (
    <Modal animationType="slide" style={styles.modal} visible>
      <SafeAreaView style={styles.content}>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.text}>Background Music</Text>
            <Button
              style={styles.btnClose}
              onPress={onClose}
              iconStyle={styles.close}
              icon="close"
            ></Button>
          </View>
          <BackgroundAudioModal />
        </View>
      </SafeAreaView>
    </Modal>
  );
};
BackgroundAudios.propTypes = {};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    borderTopColor: '#ffffff10',
    borderTopWidth: 1,
  },
  content: {
    flex: 1,
    backgroundColor: '#061A31',
  },
  scrollview: {
    flexGrow: 0,
    maxHeight: Dimensions.get('window').height - 300,
    width: Dimensions.get('window').width,
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btn: {
    width: 40,
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

export default BackgroundAudios;
