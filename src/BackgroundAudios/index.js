import React, { useMemo } from 'react';
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
import {
  useBackgroundAudio,
  useLocales,
  useThemes,
} from '../AudioEditorContext';

const BackgroundAudios = ({ onClose, ...props }) => {
  const themes = useThemes();
  const locales = useLocales();
  const styles = useMemo(() => genStyles(themes), [themes]);

  return (
    <Modal animationType="slide" style={styles.modal} visible>
      <SafeAreaView style={styles.content}>
        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.text}>{locales.backgroundMusic}</Text>
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

const genStyles = (themes) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 20,
      borderTopColor: themes.trackBackgroundColor,
      borderTopWidth: 1,
    },
    content: {
      flex: 1,
      backgroundColor: themes.background,
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
