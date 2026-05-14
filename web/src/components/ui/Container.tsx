import type { PropsWithChildren, CSSProperties } from 'react';

export function Container({ children, style }: PropsWithChildren<{ style?: CSSProperties }>) {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-6" style={style}>
      {children}
    </div>
  );
}
