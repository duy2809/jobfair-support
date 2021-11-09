import React from 'react';
import ErrorNotFound from '../components/err-not-found';
import Otherlayout from '../layouts/OtherLayout';
import Nav from '../components/navbar/index';

function Custom404() {
  return (
    <>
      <Otherlayout>
        <Otherlayout.Main>
          <ErrorNotFound />
        </Otherlayout.Main>
      </Otherlayout>
    </>
  );
}

export default Custom404;
