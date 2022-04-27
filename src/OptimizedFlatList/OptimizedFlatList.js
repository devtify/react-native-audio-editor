import React from 'react';
import { FlatList, Animated } from 'react-native';
import FlatListItem from './FlatListItem';

// const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class OptimizedFlatList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
    this.rowRefs = [];
    this.viewabilityConfig = {
      waitForInteraction: false,
      viewAreaCoveragePercentThreshold: 0.1,
    };
    this._onViewableItemsChanged = this._onViewableItemsChanged.bind(this);
    this.scrollToEnd = this.scrollToEnd.bind(this);
    this.scrollToIndex = this.scrollToIndex.bind(this);
    this.scrollToItem = this.scrollToItem.bind(this);
    this.scrollToOffset = this.scrollToOffset.bind(this);
  }

  _addRowRefs(ref, data) {
    this.rowRefs[data.index] = {
      ref,
      item: data.item,
      index: data.index,
    };
  }

  _updateItem(index, visibility) {
    if (!this.rowRefs[index].ref) {
      return false;
    }
    this.rowRefs[index].ref.setVisibility(visibility);
    return visibility;
  }

  _renderItem(data) {
    const view = this.props.renderItem(data);
    return (
      <FlatListItem
        ref={myItem => this._addRowRefs(myItem, data)}
        viewComponent={view}
        data={data}
        itemWidth={this.props.itemWidth}
        itemHeight={this.props.itemHeight}
      />
    );
  }

  _onViewableItemsChanged(info: {
    changed: Array<{
      key: string,
      isViewable: boolean,
      item: any,
      index: ?number,
      section?: any,
    }>,
  }) {
    const { onViewableItemsChanged } = this.props;
    onViewableItemsChanged && onViewableItemsChanged(info);
    info.changed.map(item =>
      this._updateItem(
        item.index,
        !item.index ? true : getIsVisibles(item, info.viewableItems),
      ),
    );
  }

  scrollToEnd(params?: ?{ animated?: ?boolean }) {
    if (this._listRef) {
      this._listRef?.scrollToEnd?.(params);
    }
  }

  scrollToIndex(params: {
    animated?: ?boolean,
    index: number,
    viewOffset?: number,
    viewPosition?: number,
  }) {
    if (this._listRef) {
      this._listRef?.scrollToIndex?.(params);
    }
  }

  scrollToItem(params: {
    animated?: ?boolean,
    item: ItemT,
    viewPosition?: number,
  }) {
    if (this._listRef) {
      this._listRef?.scrollToItem?.(params);
    }
  }

  scrollToOffset(params: { animated?: ?boolean, offset: number }) {
    if (this._listRef) {
      this._listRef?.scrollToOffset?.(params);
    }
  }

  render() {
    return (
      <FlatList
        ref={ref => {
          this._listRef = ref;
          this.props.setRef && this.props.setRef(ref);
        }}
        keyExtractor={(item, index) => `col${index}`}
        {...this.props}
        viewabilityConfig={this.viewabilityConfig}
        renderItem={data => this._renderItem(data)}
        onViewableItemsChanged={this._onViewableItemsChanged}
      />
    );
  }
}

const getIsVisibles = (item, visibles) => {
  return (
    item?.isViewable ||
    visibles[0]?.index - 1 <= item?.index ||
    visibles[visibles?.length - 1]?.index + 1 >= item?.index
  );
};
