// pages/[appName].js
import React from 'react'
import AppLoader from '../apps/appLoader'

const AppPage = ({ appName }) => {
  return <AppLoader appName={appName} />
}

export async function getStaticPaths() {
  // Define custom routes and map them to app names
  const paths = [
    { params: { appName: 'my-new-house' } },
    { params: { appName: 'new-app' } },
  ]

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({ params }) {
  // Map custom route to appName
  const routeToAppMap = {
    'my-new-house': 'myhouse',
    'new-app': 'newApplication',
  }

  return {
    props: {
      appName: routeToAppMap[params.appName] || null,
    },
  }
}

export default AppPage
