import React from 'react';
import { leftmostOutermostRedex, renderExpression } from '../../lib/lambda';

// Quick and dirty expansion of errors, because i forgot to go through
// everything before submitting this somewhere

const shownSteps = 25;

function buildErrorMetadata(ast){
  const firstSteps = [ ast ];
  for (let i = 0; i < shownSteps; i++){
    firstSteps.push(ast && leftmostOutermostRedex(firstSteps[firstSteps.length - 1]));
  }

  const firstStepsRendered = (
    <ol>{
      firstSteps
        .filter(item => Boolean(item))
        .map((step, idx) => (
          <li key={idx}>{renderExpression(step)}</li>
        ))
    }</ol>
  );

  return (
    <div className="metadata">
      <div><h3 className="error-metadata-header">First {shownSteps} redexes:</h3>{firstStepsRendered}</div>
    </div>
  );
}

export default class Error extends React.Component {
  state = { expanded: false };

  handleButtonClick = (e) => {
    this.setState({
      expanded: !this.state.expanded,
    });
    e.preventDefault();
    e.stopPropagation();
  }

  render(){
    const {ast} = this.props;
    return (
      <div>
        <div className="result-inner">
          <span>{this.props.children}</span>
          {ast && ( // implicitly selects runtime errors, kinda shitty
            <div>
              <span onClick={this.handleButtonClick} className='expand-collapse-button'>
                {this.state.expanded ? '(-)' : '(+)'}
              </span>
            </div>
          )}
        </div>
        {this.state.expanded && buildErrorMetadata(ast)}
      </div>
    );
  }
}
