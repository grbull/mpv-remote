import React, { ReactElement, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

export function FixedBottom({ children }: Props): ReactElement {
  return (
    <section className="fixed bottom-0 w-full flex-auto bg-gray-700 text-gray-200 font-mono">
      {children}
    </section>
  );
}
