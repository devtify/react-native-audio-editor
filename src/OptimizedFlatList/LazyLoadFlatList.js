import React, { Component } from 'react';
import { unionBy } from 'lodash';
import PropTypes from 'prop-types';
import { StyleSheet } from 'react-native';
import OptimizedFlatList from './OptimizedFlatList';

class LazyLoadFlatList extends Component {
  constructor(props) {
    super(props);
    this.itemRendered = [];
    this.ref = React.createRef();
    this.viewabilityConfig = {
      waitForInteraction: true,
      viewAreaCoveragePercentThreshold: 95,
    };
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;
    if (prevProps.data?.length === 0 && data?.length > 0) {
      this.itemRendered = [];
    }
  }

  onViewableItemsChanged = e => {
    const { data, loadMore } = this.props;
    this.itemRendered = unionBy(this.itemRendered, e.viewableItems, 'key');
    if (this.itemRendered?.length > data?.length - 7) {
      loadMore();
    }
  };

  onRefresh = () => {
    const { onRefresh } = this.props;
    this.itemRendered = [];
    onRefresh?.();
  };

  scrollToTop = () => {
    this.ref.current.scrollToOffset({ animated: true, offset: 0 });
  };

  render() {
    const { refreshing } = this.props;
    return (
      <OptimizedFlatList
        style={styles.styles}
        {...this.props}
        onRefresh={
          typeof refreshing !== 'undefined' ? this.onRefresh : undefined
        }
        ref={this.ref}
        viewabilityConfig={this.viewabilityConfig}
        onViewableItemsChanged={this.onViewableItemsChanged}
      />
    );
  }
}
LazyLoadFlatList.propTypes = {
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  data: PropTypes.array,
  loadMore: PropTypes.func,
};

const styles = StyleSheet.create({});

export default LazyLoadFlatList;
