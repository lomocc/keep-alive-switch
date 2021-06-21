import React, { ComponentType, ReactNode, useContext, useRef } from 'react';
import {
  matchPath,
  SwitchProps,
  __RouterContext as RouterContext,
} from 'react-router';

interface RenderRouteProps {
  visible: boolean;
  children: ReactNode;
}
const RenderRouteDefault = ({ visible, children }: RenderRouteProps) => (
  <div style={visible ? void 0 : { display: 'none' }}>{children}</div>
);
interface Props extends SwitchProps {
  renderRoute?: ComponentType<RenderRouteProps>;
}
/**
 * The public API for rendering the first <Route> that matches.
 */
export default function KeepAliveSwitch(props: Props) {
  const context = useContext(RouterContext);
  const initializedRef = useRef(new Set<any>());
  const RenderRoute = props.renderRoute ?? RenderRouteDefault;
  const location = props.location || context.location;
  let matchedIndex: number | null = null;
  const elements = React.Children.map(props.children, (child, index) => {
    if (React.isValidElement(child)) {
      const { children, render, component } = child.props;
      const key = child.key ?? index;
      const path = child.props.path || child.props.from;
      const match = path
        ? matchPath(location.pathname, { ...child.props, path })
        : context.match;
      if (matchedIndex == null && match) {
        matchedIndex = index;
        if (!initializedRef.current.has(key)) {
          initializedRef.current.add(key);
        }
      }
      const initialized = initializedRef.current.has(key);
      return (
        initialized && (
          <RenderRoute visible={matchedIndex === index}>
            {React.cloneElement(
              child,
              {
                location,
                computedMatch: match,
              },
              (props: any) =>
                children
                  ? typeof children === 'function'
                    ? children(props)
                    : children
                  : component
                  ? React.createElement(component, props)
                  : render
                  ? render(props)
                  : null
            )}
          </RenderRoute>
        )
      );
    }
    return null;
  });
  return <>{elements}</>;
}
