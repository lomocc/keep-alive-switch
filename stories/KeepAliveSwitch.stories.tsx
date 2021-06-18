import { storiesOf } from '@storybook/react';
import React, { useState } from 'react';
import { Link, MemoryRouter, Route, useLocation } from 'react-router-dom';
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

function KeepAliveSwitchDemo() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link to="/children">children</Link>
        </li>
      </ul>
      <hr />
      <KeepAliveSwitch>
        <Route exact path="/" component={Counter} />
        <Route path="/about" component={() => <Counter />}></Route>
        <Route path="/dashboard">{() => <Counter />}</Route>
        <Route path="/children">
          <Counter />
        </Route>
      </KeepAliveSwitch>
      <hr />
    </div>
  );
}

storiesOf('KeepAliveSwitchDemo', module)
  .addDecorator(story => (
    <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>
  ))
  .add('KeepAliveSwitch', () => {
    return <KeepAliveSwitchDemo />;
  });
