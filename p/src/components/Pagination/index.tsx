import React from 'react';
import Pagination from '@material-ui/lab/Pagination';

import './cssReset001.scss';

export default function PaginationControlled(props: any) {
  const { handleChange } = props;

  return (
    <div className="ui-widget-Pagination">
      <Pagination count={props.count} onChange={handleChange} variant="outlined" shape="rounded" />
    </div>
  );
}
