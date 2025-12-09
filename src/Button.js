import React, { Component } from "react";

class Button extends Component {
  handleClick = () => {
    const { caption, onButtonClick } = this.props;
    if (onButtonClick) onButtonClick(caption);
  };

  render() {
    const { caption, className = "" } = this.props;

    return (
      <button
        type="button"
        className={`calc-btn ${className}`}
        onClick={this.handleClick}
      >
        {caption}
      </button>
    );
  }
}

export default Button;
