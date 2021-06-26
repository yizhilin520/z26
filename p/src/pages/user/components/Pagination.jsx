import MaterialPagination from '@material-ui/lab/Pagination';
import { withStyles } from '@material-ui/core/styles';

const Pagination = withStyles(() => ({
  root: {
    margin: '20px'
  },
  ul: {
    justifyContent: 'flex-end'
  }
}))(MaterialPagination);

export default Pagination;
