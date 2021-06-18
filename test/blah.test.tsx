import React, { useState } from 'react';
import * as ReactDOM from 'react-dom';
import { MemoryRouter, Route, useLocation } from 'react-router-dom';
import KeepAliveSwitch from '../src';

function Counter() {
  const location = useLocation();
  const [count, setCount] = useState(0);
  return (
    <div>
      {location.pathname} count: {count}
      <button onClick={() => setCount(count => count + 1)}>add</button>
    </div>
  );
}

describe('Thing', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <MemoryRouter>
        <KeepAliveSwitch>
          <Route exact path="/" component={Counter} />
          <Route path="/about" component={() => <Counter />}></Route>
          <Route path="/dashboard">{() => <Counter />}</Route>
          <Route path="/children">
            <Counter />
          </Route>
        </KeepAliveSwitch>
      </MemoryRouter>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
