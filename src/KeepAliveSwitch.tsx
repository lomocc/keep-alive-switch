import React, {
  ComponentType,
  CSSProperties,
  Key,
  ReactNode,
  useContext,
  useMemo,
  useRef,
} from 'react';
import {
  matchPath,
  SwitchProps,
  __RouterContext as RouterContext,
} from 'react-router';

export interface RenderRouteProps {
  visible: boolean;
  children: ReactNode;
}

interface Props extends SwitchProps {
  renderRoute?: ComponentType<RenderRouteProps>;
  className?: string;
  style?: CSSProperties;
}
/**
 * The public API for rendering the first <Route> that matches.
 */
export default function KeepAliveSwitch(props: Props) {
  const context = useContext(RouterContext);
  const {
    renderRoute,
    className,
    style,
    location = context.location,
    children,
  } = props;
  const initializedRef = useRef(new Set<Key>());
  const RenderRoute = useMemo(
    () =>
      renderRoute ??
      ((({ visible, children }) => (
        <div
          style={visible ? style : { display: 'none', ...style }}
          className={className}
        >
          {children}
        </div>
      )) as ComponentType<RenderRouteProps>),
    [renderRoute, className, style]
  );
  let matchedIndex: number | null = null;
  const elements = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      const { children, render, component, keepAlive } = child.props;
      const key = child.key ?? index;
      const path = child.props.path || child.props.from;
      const match = path
        ? matchPath(location!.pathname, { ...child.props, path })
        : context.match;
      if (matchedIndex == null && match) {
        matchedIndex = index;
        if (!initializedRef.current.has(key)) {
          initializedRef.current.add(key);
        }
      }
      const initialized = initializedRef.current.has(key);
      if (!initialized) {
        return null;
      }
      const matched = matchedIndex === index;
      if (!keepAlive && !matched) {
        return null;
      }
      const element = React.cloneElement(
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
      );
      if (keepAlive) {
        return <RenderRoute visible={matched}>{element}</RenderRoute>;
      }
      return element;
    }
    return null;
  });
  return <>{elements}</>;
}
