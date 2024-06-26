import React from 'react'
import dynamic from 'next/dynamic'

const AppLoader = ({ appName }) => {
  const App = dynamic(() => import(`../apps/${appName}`), { ssr: false })

  return (
    <div>
      <h1>Loading {appName} application...</h1>
      <App />
    </div>
  )
}

export default AppLoader
