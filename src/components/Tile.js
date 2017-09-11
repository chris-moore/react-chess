import React, { PropTypes, Component } from 'react';
import Link from 'react-router-dom/Link';

class Tile extends Component {
  render() {
    const { color, type } = this.props;
    return (
      <div
        className={`f1-l f3 mt1 mt2-l ${color} icon-${type}`}
      ></div>
    );
  }
}

Tile.propTypes = {
  color: PropTypes.string,
  type: intlShape.string,
};

Tile.defaultProps = {
  color: 'black',
  type: null,
};

export default Tile;
