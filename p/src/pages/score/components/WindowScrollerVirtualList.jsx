import React from 'react';
import WindowScroller from 'react-virtualized/dist/es/WindowScroller';
import List from 'react-virtualized/dist/es/List';
import AutoSizer from 'react-virtualized/dist/es/AutoSizer';
import { empty } from '@/utils/common';

const WindowScrollerVirtualList = ({ list, rowHeight, rowRenderer, ...props }) => (
  <WindowScroller>
    {({ height, isScrolling, registerChild, onChildScroll, scrollTop }) => (
      <AutoSizer disableHeight>
        {({ width }) => (
          <div ref={registerChild}>
            <List
              autoHeight
              height={height}
              rowCount={list.length}
              rowHeight={rowHeight}
              rowRenderer={rowRenderer}
              width={width}
              isScrolling={isScrolling}
              onScroll={onChildScroll}
              scrollTop={scrollTop}
              {...props}
            />
          </div>
        )}
      </AutoSizer>
    )}
  </WindowScroller>
);

WindowScrollerVirtualList.defaultProps = {
  list: [],
  rowHeight: 0,
  rowRenderer: empty
};

export default WindowScrollerVirtualList;
