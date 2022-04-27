import React from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';

export default class FlatListItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visibility: true,
    };
    this.viewProperties = {
      width: 0,
      height: 0,
    };
  }

  onLayout(evt) {
    this.viewProperties.width = evt.nativeEvent.layout.width;
    this.viewProperties.height = evt.nativeEvent.layout.height;
  }

  setVisibility(_visibility) {
    const { visibility } = this.state;
    if (visibility !== _visibility) {
      if (_visibility === true) this.setState({ visibility: true });
      else this.setState({ visibility: false });
    }
  }

  render() {
    const { visibility } = this.state;
    const { itemWidth, itemHeight, viewComponent } = this.props;
    if (visibility === false) {
      return <View style={{ width: itemWidth, height: itemHeight }} />;
    }

    return viewComponent;
  }
}

FlatListItem.propTypes = {
  itemWidth: PropTypes.number,
  itemHeight: PropTypes.number,
  viewComponent: PropTypes.any,
};
