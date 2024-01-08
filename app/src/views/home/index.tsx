import React, {useContext} from 'react'

import {ReactReduxContext} from 'react-redux'

export const Home = () => {
  const {store} = useContext(ReactReduxContext)
  console.log('store in home: ', store.getState())
  return (
    <div>Home</div>
  )
}
