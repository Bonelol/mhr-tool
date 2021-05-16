import { useRef, useLayoutEffect, useEffect } from 'react';

export const usePrevPropsAndState = (props: any, state: any) => {
  const prevPropsAndStateRef = useRef({ props: null, state: null });
  const prevProps = prevPropsAndStateRef.current.props;
  const prevState = prevPropsAndStateRef.current.state;

  useEffect(() => {
    prevPropsAndStateRef.current = { props, state };
  });

  return { prevProps, prevState };
};

export const useGetSnapshotBeforeUpdate = (cb: any, props: any, state: any) => {
  // get prev props and state
  const { prevProps, prevState } = usePrevPropsAndState(props, state);

  const snapshot = useRef(null);

  // getSnapshotBeforeUpdate - not run on mount + run on every update
  const componentJustMounted = useRef(true);
  useLayoutEffect(() => {
    if (!componentJustMounted.current) {
      snapshot.current = cb(prevProps, prevState);
    }
    componentJustMounted.current = false;
  });

  // 👇 look here
  const useComponentDidUpdate = (cb: any) => {
    useEffect(() => {
      if (!componentJustMounted.current) {
        cb(prevProps, prevState, snapshot.current);
      }
    });
  };
  // 👇 look here
  return useComponentDidUpdate;
};
