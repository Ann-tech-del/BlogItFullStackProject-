import _React from 'react'
import Header from "./Header";
import Footer from "./Footer";

const LayOut = ({ children }: any) => {
  return (
   <>
   <Header />
      {children}
      <Footer />
   </>
  )
}

export default LayOut