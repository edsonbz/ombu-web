import React from 'react';

type LoginCardProps = Readonly<React.PropsWithChildren<unknown>>;
export default function LoginCard({ children }: LoginCardProps) {


  return (
    <div
  >
    <div className={'dx-card content'}>
      <div
        className={'header animate__animated animate__zoomInDown'}
      ></div>
      {children}
    </div>
  </div>
  )
}